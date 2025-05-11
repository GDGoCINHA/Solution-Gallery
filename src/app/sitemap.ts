import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  // 프로젝트 목록 가져오기
  const { data: projects } = await supabase
    .from('projects')
    .select('id, updated_at, created_at');

  // 기본 경로
  const urls = [
    {
      url: 'https://solutions.gdgocinha.com/',
      lastModified: new Date().toISOString(),
    },
    {
      url: 'https://solutions.gdgocinha.com/projects',
      lastModified: new Date().toISOString(),
    },
  ];

  // 프로젝트 상세 경로 추가
  if (projects) {
    urls.push(
      ...projects.map((project) => ({
        url: `https://solutions.gdgocinha.com/projects/${project.id}`,
        lastModified: project.updated_at || project.created_at || new Date().toISOString(),
      }))
    );
  }

  return urls;
} 