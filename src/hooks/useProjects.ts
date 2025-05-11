import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types/project';

export const useProjects = (searchTerm: string = '') => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      
      try {
        let query = supabase
          .from('projects')
          .select(`
            *,
            teams (name)
          `);

        if (searchTerm) {
          query = query.ilike('title', `%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        // 프로젝트 태그 가져오기
        const projectsWithTags = await Promise.all(
          data.map(async (project) => {
            const { data: tagData } = await supabase
              .from('project_tags')
              .select('tag')
              .eq('project_id', project.id);
              
            const tags = tagData ? tagData.map(t => t.tag) : [];
            
            return {
              ...project,
              team_name: project.teams?.name || '',
              tags,
              thumbnail_url: project.thumbnail_url || '/sample.png' // 기본 이미지 설정
            };
          })
        );

        setProjects(projectsWithTags);
      } catch (err) {
        setError(err instanceof Error ? err.message : '프로젝트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchTerm]);

  return { projects, loading, error };
}; 