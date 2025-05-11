import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types/project';

// 멤버 타입 정의 (간단)
type Member = {
  id: string;
  name: string;
  affiliation: string | null;
  profile_image_url: string | null;
  role: string | null;
  social_url?: string | null;
};

export const useProjectDetail = (projectId: string | undefined) => {
  const [project, setProject] = useState<Project & { members?: Member[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    const fetchProject = async () => {
      setLoading(true);
      try {
        // 프로젝트 기본 정보
        const { data, error } = await supabase
          .from('projects')
          .select(`*, teams (name)`)
          .eq('id', projectId)
          .single();
        if (error) throw error;
        if (!data) throw new Error('프로젝트를 찾을 수 없습니다.');

        // 태그 정보
        const { data: tagData } = await supabase
          .from('project_tags')
          .select('tag')
          .eq('project_id', projectId);
        const tags = tagData ? tagData.map(t => t.tag) : [];

        // 프로젝트 이미지 정보
        const { data: imageData } = await supabase
          .from('project_images')
          .select('image_url, display_order')
          .eq('project_id', projectId)
          .order('display_order', { ascending: true });
        const images = imageData ? imageData.map(img => img.image_url) : [];

        // 팀원 정보
        let members: Member[] = [];
        if (data.team_id) {
          const { data: memberData } = await supabase
            .from('members')
            .select('id, name, affiliation, profile_image_url, role, social_url')
            .eq('team_id', data.team_id)
            .order('name');
          if (memberData) {
            // 팀장 우선 정렬 (role에 '팀장' 포함 or 이름에 '팀장' 포함)
            members = [...memberData].sort((a, b) => {
              const aIsLeader = (a.role && a.role.includes('팀장')) || (a.name && a.name.includes('팀장'));
              const bIsLeader = (b.role && b.role.includes('팀장')) || (b.name && b.name.includes('팀장'));
              if (aIsLeader && !bIsLeader) return -1;
              if (!aIsLeader && bIsLeader) return 1;
              return 0;
            });
          }
        }

        // 첨부파일 정보
        const { data: fileData } = await supabase
          .from('project_files')
          .select('file_url, file_name')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });
        const files = fileData ? fileData.map(f => ({ name: f.file_name, url: f.file_url })) : [];

        setProject({
          ...data,
          team_name: data.teams?.name || '',
          tags,
          thumbnail_url: data.thumbnail_url || '/sample.png',
          images,
          members,
          files,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '프로젝트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  return { project, loading, error };
}; 