'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display/Card';
import { Input } from '@/components/ui/form/Input';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Project = {
  id: string;
  team_id: string | null;
  title: string;
  summary: string | null;
  description: string | null;
  github_url: string | null;
  demo_url: string | null;
  tech_stack: string[] | Record<string, unknown> | null;
  thumbnail_url: string | null;
  created_at: string | null;
  vote_count: number | null;
  team_name?: string;
};

type Team = {
  id: string;
  name: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 상세 보기 상태
  const [viewMode, setViewMode] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // 검색 필터
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState<string | 'all'>('all');

  const router = useRouter();

  useEffect(() => {
    // 팀 목록 불러오기
    fetchTeams();
    // 프로젝트 목록 불러오기
    fetchProjects();
  }, []);

  // 검색 결과 필터링
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.summary?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesTeam = teamFilter === 'all' || project.team_id === teamFilter;
    
    return matchesSearch && matchesTeam;
  });

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
    }
  }

  async function fetchProjects() {
    setLoading(true);
    setError(null);
    try {
      // 프로젝트와 팀 정보 조인하여 가져오기
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          teams:team_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // 팀 이름을 프로젝트 객체에 추가
      const projectsWithTeamName = (data || []).map(p => ({
        ...p,
        team_name: p.teams?.name || '팀 없음'
      }));
      
      setProjects(projectsWithTeamName);
    } catch (err) {
      console.error('프로젝트 목록 조회 오류:', err);
      setError('프로젝트 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProject(id: string) {
    if (!window.confirm('정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    setLoading(true);
    try {
      // 관련 태그 삭제
      await supabase
        .from('project_tags')
        .delete()
        .eq('project_id', id);
      
      // 관련 이미지 정보 삭제
      await supabase
        .from('project_images')
        .delete()
        .eq('project_id', id);
      
      // 관련 투표 정보 삭제
      await supabase
        .from('project_votes')
        .delete()
        .eq('project_id', id);
      
      // 프로젝트 삭제
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // 목록 새로고침
      await fetchProjects();
    } catch (err) {
      console.error('프로젝트 삭제 오류:', err);
      setError('프로젝트 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  function viewProject(project: Project) {
    setCurrentProject(project);
    setViewMode(project.id);
  }

  function closeView() {
    setViewMode(null);
    setCurrentProject(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">프로젝트 관리</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={() => router.push('/admin/projects/new')}
          >
            새 프로젝트
          </Button>
          <Button 
            variant="outline"
            onClick={() => fetchProjects()}
            disabled={loading}
          >
            새로고침
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* 검색 및 필터링 */}
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                프로젝트 검색
              </label>
              <Input
                id="search"
                placeholder="프로젝트명, 설명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="teamFilter" className="text-sm font-medium">
                팀 필터
              </label>
              <select
                id="teamFilter"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                <option value="all">모든 팀</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setTeamFilter('all');
                }}
                variant="outline"
                className="mb-0.5"
              >
                필터 초기화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 프로젝트 목록 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">프로젝트 목록</h2>
          <p className="text-sm text-muted-foreground">
            총 {filteredProjects.length}개의 프로젝트
          </p>
        </div>
        
        {loading && <div className="text-center py-4">로딩 중...</div>}
        
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm || teamFilter !== 'all' ? 
              '검색 조건에 맞는 프로젝트가 없습니다.' : 
              '등록된 프로젝트가 없습니다.'}
          </div>
        )}

        {viewMode && currentProject ? (
          // 프로젝트 상세 보기
          <Card>
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle>{currentProject.title}</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={closeView}
                >
                  목록으로 돌아가기
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {currentProject.thumbnail_url && (
                    <div className="mb-4">
                      <Image 
                        src={currentProject.thumbnail_url} 
                        alt={currentProject.title}
                        width={192}
                        height={96}
                        className="w-full h-48 object-cover rounded-md" 
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">팀</h3>
                    <p>{currentProject.team_name}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">투표 수</h3>
                    <p>{currentProject.vote_count || 0}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">생성일</h3>
                    <p>{currentProject.created_at ? new Date(currentProject.created_at).toLocaleDateString() : '-'}</p>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">요약</h3>
                    <p>{currentProject.summary || '-'}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">설명</h3>
                    <p className="whitespace-pre-line">{currentProject.description || '-'}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Github</h3>
                    <p>
                      {currentProject.github_url ? (
                        <a href={currentProject.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {currentProject.github_url}
                        </a>
                      ) : '-'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">데모 URL</h3>
                    <p>
                      {currentProject.demo_url ? (
                        <a href={currentProject.demo_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {currentProject.demo_url}
                        </a>
                      ) : '-'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">기술 스택</h3>
                    {currentProject.tech_stack ? (
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(currentProject.tech_stack) ? 
                          currentProject.tech_stack.map((tech: string, i: number) => (
                            <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              {tech}
                            </span>
                          )) : 
                          <span className="text-muted-foreground">JSON 형식: {JSON.stringify(currentProject.tech_stack)}</span>
                        }
                      </div>
                    ) : <p>-</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // 프로젝트 목록 보기
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                  {/* 썸네일 영역 */}
                  <div className="sm:w-48 lg:w-56">
                    {project.thumbnail_url ? (
                      <Image 
                        src={project.thumbnail_url} 
                        alt={project.title}
                        width={192}
                        height={96}
                        className="w-full h-32 object-cover rounded-md" 
                      />
                    ) : (
                      <Image
                        src="/images/sample.jpg"
                        alt="이미지 없음"
                        width={192}
                        height={96}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                  
                  {/* 내용 영역 */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                    <p className="text-sm text-blue-600 mb-2">
                      {project.team_name}
                    </p>
                    {project.summary && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {project.summary}
                      </p>
                    )}
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewProject(project)}
                      >
                        상세 보기
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                      >
                        수정
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                  
                  {/* 우측 정보 영역 (투표 수, 날짜) */}
                  <div className="sm:w-32 flex sm:flex-col gap-4 sm:gap-2 sm:text-right">
                    <div>
                      <p className="text-xs text-muted-foreground">투표 수</p>
                      <p className="font-medium">{project.vote_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">생성일</p>
                      <p className="text-sm">
                        {project.created_at ? new Date(project.created_at).toLocaleDateString() : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 