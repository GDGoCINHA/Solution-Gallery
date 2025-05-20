'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display/Card';
import { Input } from '@/components/ui/form/Input';
import { v4 as uuidv4 } from 'uuid';
import TagInputField from '@/components/ui/form/TagInputField';
import Image from 'next/image';
import dynamic from 'next/dynamic';

type Team = {
  id: string;
  name: string;
};

type ProjectImage = {
  id: string;
  image_url: string;
  description: string | null;
};

// 첨부파일 관련 타입
interface ProjectFile {
  id?: string;
  name: string;
  url: string;
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const [projectData, setProjectData] = useState({
    title: '',
    summary: '',
    description: '',
    github_url: '',
    demo_url: '',
    team_id: '',
    thumbnail_url: ''
  });

  // 이미지 관련 상태
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 추가: 프로젝트 태그 관련 상태
  const [projectTags, setProjectTags] = useState<string[]>([]);

  // 첨부파일 관련 상태
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<ProjectFile[]>([]);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  const fetchProjectData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 프로젝트 기본 정보 불러오기
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      if (projectError) throw projectError;
      if (!project) {
        setError('프로젝트를 찾을 수 없습니다.');
        return;
      }
      setProjectData({
        title: project.title || '',
        summary: project.summary || '',
        description: project.description || '',
        github_url: project.github_url || '',
        demo_url: project.demo_url || '',
        team_id: project.team_id || '',
        thumbnail_url: project.thumbnail_url || ''
      });
      if (project.thumbnail_url) {
        setThumbnailPreview(project.thumbnail_url);
      }
      const { data: projectImages, error: imagesError } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectId);
      if (imagesError) throw imagesError;
      setExistingImages(projectImages || []);
      await fetchProjectTags(projectId);
    } catch (err) {
      console.error('프로젝트 정보 조회 오류:', err);
      setError('프로젝트 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchProjectFiles = useCallback(async () => {
    if (!projectId) return;
    const { data, error } = await supabase
      .from('project_files')
      .select('id, file_url, file_name')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    if (!error && data) {
      setExistingFiles(data.map(f => ({ id: f.id, name: f.file_name, url: f.file_url })));
    }
  }, [projectId]);

  useEffect(() => {
    // 팀 목록 불러오기
    fetchTeams();
    // 프로젝트 정보 불러오기
    fetchProjectData();
    fetchProjectFiles();
  }, [projectId, fetchProjectData, fetchProjectFiles]);

  async function fetchTeams() {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setTeams(data || []);
    } catch (err) {
      console.error('팀 목록 조회 오류:', err);
      setError('팀 목록을 불러오는 데 실패했습니다.');
    }
  }

  // 추가: 프로젝트 태그 불러오기
  async function fetchProjectTags(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('project_tags')
        .select('tag')
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      if (data) {
        setProjectTags(data.map(item => item.tag));
      }
    } catch (err) {
      console.error('프로젝트 태그 조회 오류:', err);
      // 태그 로딩 실패는 치명적이지 않으므로 에러 표시하지 않음
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // 썸네일 이미지 핸들러
  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setError('썸네일 이미지 크기는 5MB 이하여야 합니다.');
      return;
    }
    
    // 이미지 타입 체크
    if (!file.type.startsWith('image/')) {
      setError('썸네일은 이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    setThumbnail(file);
    
    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
  
  // 추가 이미지 핸들러
  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    // 각 파일 체크 및 미리보기 생성
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setError(`이미지 '${file.name}'의 크기가 5MB를 초과합니다.`);
        continue;
      }
      
      // 이미지 타입 체크
      if (!file.type.startsWith('image/')) {
        setError(`'${file.name}'은(는) 이미지 파일이 아닙니다.`);
        continue;
      }
      
      newFiles.push(file);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === newFiles.length) {
          setImagePreview([...imagePreview, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }
    
    setImages([...images, ...newFiles]);
  }
  
  // 이미지 제거 핸들러
  function removeImage(index: number) {
    const newImages = [...images];
    const newPreviews = [...imagePreview];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreview(newPreviews);
  }
  
  // 기존 이미지 제거 핸들러
  async function removeExistingImage(id: string) {
    try {
      const imageToRemove = existingImages.find(img => img.id === id);
      if (!imageToRemove) return;
      
      // 데이터베이스에서 이미지 정보 삭제
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // UI에서 이미지 제거
      setExistingImages(existingImages.filter(img => img.id !== id));
      
      // 스토리지에서 이미지 파일 삭제 (URL에서 파일 경로 추출)
      const urlParts = imageToRemove.image_url.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('project-images') + 1).join('/');
      
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('project-images')
          .remove([filePath]);
        
        if (storageError) console.error('스토리지 이미지 삭제 오류:', storageError);
      }
    } catch (err) {
      console.error('이미지 삭제 오류:', err);
      setError('이미지 삭제에 실패했습니다.');
    }
  }
  
  // 썸네일 제거 핸들러
  function removeThumbnail() {
    if (thumbnailPreview === projectData.thumbnail_url) {
      // 기존 썸네일 제거 표시
      setProjectData({...projectData, thumbnail_url: ''});
    }
    
    setThumbnail(null);
    setThumbnailPreview(null);
    
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  }

  async function uploadImages() {
    try {
      const imagePaths: string[] = [];
      let thumbnailPath = projectData.thumbnail_url; // 기본값은 현재 썸네일 URL
      
      // 업로드 진행상황 초기화
      const totalFiles = (thumbnail ? 1 : 0) + images.length;
      let uploadedFiles = 0;
      
      // 새 썸네일 업로드
      if (thumbnail) {
        const fileName = `${uuidv4()}-${thumbnail.name.replace(/\s+/g, '_')}`;
        const filePath = `projects/${projectId}/thumbnail/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, thumbnail);
        
        if (uploadError) throw uploadError;
        
        // 공개 URL 가져오기
        const { data } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);
        
        thumbnailPath = data.publicUrl;
        
        uploadedFiles++;
        setUploadProgress(Math.round((uploadedFiles / totalFiles) * 100));
      }
      
      // 추가 이미지 업로드
      for (const image of images) {
        const fileName = `${uuidv4()}-${image.name.replace(/\s+/g, '_')}`;
        const filePath = `projects/${projectId}/images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, image);
        
        if (uploadError) throw uploadError;
        
        // 공개 URL 가져오기
        const { data } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);
        
        imagePaths.push(data.publicUrl);
        
        uploadedFiles++;
        setUploadProgress(Math.round((uploadedFiles / totalFiles) * 100));
      }
      
      // 썸네일 URL 업데이트
      if (thumbnailPath !== projectData.thumbnail_url) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({ thumbnail_url: thumbnailPath })
          .eq('id', projectId);
        
        if (updateError) throw updateError;
      }
      
      // 추가 이미지 정보 저장
      if (imagePaths.length > 0) {
        const imageRecords = imagePaths.map(path => ({
          project_id: projectId,
          image_url: path,
          created_at: new Date().toISOString()
        }));
        
        const { error: insertError } = await supabase
          .from('project_images')
          .insert(imageRecords);
        
        if (insertError) throw insertError;
      }
      
      return { thumbnailPath, imagePaths };
    } catch (err) {
      console.error('이미지 업로드 오류:', err);
      throw err;
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setNewFiles(Array.from(e.target.files));
  }

  async function handleFileUpload() {
    if (!newFiles.length) return;
    let uploaded = 0;
    let uploadErrorMsg = '';
    for (const file of newFiles) {
      const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, '_')}`;
      const filePath = `projects/${projectId}/files/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);
      if (uploadError) {
        uploadErrorMsg = '파일 업로드에 실패했습니다. Storage 버킷(project-files) 설정을 확인하세요.';
        continue;
      }
      const { data } = supabase.storage.from('project-files').getPublicUrl(filePath);
      const { error: dbError } = await supabase.from('project_files').insert({
        project_id: projectId,
        file_url: data.publicUrl,
        file_name: file.name,
      });
      if (dbError) {
        uploadErrorMsg = 'DB에 파일 정보를 저장하는 데 실패했습니다.';
        continue;
      }
      uploaded++;
      setFileUploadProgress(Math.round((uploaded / newFiles.length) * 100));
    }
    setNewFiles([]);
    setFileUploadProgress(0);
    fetchProjectFiles();
    if (uploadErrorMsg) setError(uploadErrorMsg);
  }

  async function handleFileDelete(fileId: string) {
    const file = existingFiles.find(f => f.id === fileId);
    if (!file) return;
    // 스토리지에서 삭제
    const urlParts = file.url.split('/');
    const idx = urlParts.indexOf('projects');
    const filePath = urlParts.slice(idx).join('/');
    await supabase.storage.from('project-files').remove([filePath]);
    // DB에서 삭제
    await supabase.from('project_files').delete().eq('id', fileId);
    fetchProjectFiles();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectData.title.trim()) {
      setError('프로젝트 제목은 필수 입력 항목입니다.');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // 1. 프로젝트 기본 정보 업데이트
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          title: projectData.title,
          summary: projectData.summary,
          description: projectData.description,
          github_url: projectData.github_url || null,
          demo_url: projectData.demo_url || null,
          team_id: projectData.team_id || null,
          thumbnail_url: projectData.thumbnail_url
        })
        .eq('id', projectId);
      
      if (updateError) throw updateError;
      
      // 2. 이미지 업로드 (새로운 이미지가 있는 경우)
      if (thumbnail || images.length > 0) {
        try {
          await uploadImages();
        } catch (err) {
          console.error('이미지 업로드 오류:', err);
          setError('이미지 업로드 중 오류가 발생했습니다. 다른 변경사항은 저장되었습니다.');
          router.push('/admin/projects');
          return;
        }
      }

      // 2-1. 첨부파일 업로드 (newFiles가 있으면 자동 업로드)
      if (newFiles.length > 0) {
        await handleFileUpload();
      }
      
      // 3. 프로젝트 태그 업데이트
      // 3-1. 기존 태그 삭제
      const { error: deleteTagsError } = await supabase
        .from('project_tags')
        .delete()
        .eq('project_id', projectId);
      
      if (deleteTagsError) {
        console.error('태그 삭제 오류:', deleteTagsError);
      }
      
      // 3-2. 새 태그 추가
      if (projectTags.length > 0) {
        const tagData = projectTags.map(tag => ({
          project_id: projectId,
          tag
        }));
        
        const { error: tagError } = await supabase
          .from('project_tags')
          .insert(tagData);
        
        if (tagError) {
          console.error('태그 저장 오류:', tagError);
          // 태그 저장 실패해도 다른 수정은 성공한 것으로 간주
        }
      }
      
      // 성공 시 프로젝트 목록 페이지로 이동
      router.push('/admin/projects');
    } catch (err) {
      console.error('프로젝트 수정 오류:', err);
      setError('프로젝트 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">프로젝트 수정</h1>
        <Button 
          variant="outline"
          onClick={() => router.push('/admin/projects')}
        >
          목록으로 돌아가기
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>프로젝트 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  프로젝트 제목 *
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="프로젝트 제목"
                  value={projectData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="team_id" className="text-sm font-medium">
                  소속 팀
                </label>
                <select
                  id="team_id"
                  name="team_id"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={projectData.team_id}
                  onChange={handleChange}
                >
                  <option value="">팀 선택 (선택사항)</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="summary" className="text-sm font-medium">
                간단한 요약
              </label>
              <Input
                id="summary"
                name="summary"
                placeholder="프로젝트에 대한 간단한 요약"
                value={projectData.summary}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                상세 설명 (마크다운 지원)
              </label>
              <div data-color-mode="dark">
                <MDEditor
                  value={projectData.description}
                  onChange={val => setProjectData(prev => ({ ...prev, description: val || '' }))}
                  height={300}
                  preview="edit"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="github_url" className="text-sm font-medium">
                  GitHub URL
                </label>
                <Input
                  id="github_url"
                  name="github_url"
                  placeholder="GitHub 저장소 URL"
                  value={projectData.github_url}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="demo_url" className="text-sm font-medium">
                  데모 URL
                </label>
                <Input
                  id="demo_url"
                  name="demo_url"
                  placeholder="데모 사이트 URL"
                  value={projectData.demo_url}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                프로젝트 태그
              </label>
              <TagInputField 
                tags={projectTags}
                setTags={setProjectTags}
                placeholder="태그 입력 후 엔터 (예: React, TypeScript)"
              />
            </div>

            {/* 썸네일 업로드 영역 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                대표 이미지 (썸네일)
              </label>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                {thumbnailPreview ? (
                  <div className="relative">
                    <Image 
                      src={thumbnailPreview} 
                      alt="썸네일 미리보기" 
                      width={200}
                      height={100}
                      className="max-h-48 mx-auto rounded-md" 
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                      aria-label="썸네일 제거"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">썸네일 이미지를 선택하세요</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (최대 5MB)</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-3"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      이미지 선택
                    </Button>
                  </div>
                )}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* 기존 이미지 목록 */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">기존 이미지</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative">
                      <Image 
                        src={image.image_url} 
                        alt="프로젝트 이미지" 
                        width={200}
                        height={100}
                        className="w-full h-24 object-cover rounded-md" 
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                        aria-label="이미지 제거"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 추가 이미지 업로드 영역 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                추가 이미지 업로드 {existingImages.length > 0 && `(현재 ${existingImages.length}개)`}
              </label>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                {imagePreview.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {imagePreview.map((src, index) => (
                        <div key={index} className="relative">
                          <Image 
                            src={src} 
                            alt={`이미지 ${index+1}`} 
                            width={200}
                            height={100}
                            className="w-full h-24 object-cover rounded-md" 
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                            aria-label="이미지 제거"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    {(imagePreview.length + existingImages.length) < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        추가 이미지 선택
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">프로젝트 이미지를 추가하세요</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (최대 5MB)</p>
                    {existingImages.length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        이미지 선택
                      </Button>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="project-images"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* 업로드 진행상황 */}
            {submitting && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="text-sm flex justify-between">
                  <span>업로드 중...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">첨부파일 업로드 (PDF, PPT, DOCX 등)</label>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.hwp,.txt,.xls,.xlsx"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="mb-2"
                />
                {fileUploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${fileUploadProgress}%` }}></div>
                  </div>
                )}
                <ul className="mt-4 space-y-2">
                  {existingFiles.map(file => (
                    <li key={file.id} className="flex items-center gap-2">
                      <span className="truncate max-w-xs md:max-w-md">{file.name}</span>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">바로가기</a>
                      <Button type="button" size="sm" variant="ghost" onClick={() => handleFileDelete(file.id!)}>
                        삭제
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/admin/projects')}
              >
                취소
              </Button>
              <Button 
                type="submit"
                disabled={submitting || !projectData.title.trim()}
              >
                {submitting ? '저장 중...' : '프로젝트 수정'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 