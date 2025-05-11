-- public.project_tags 테이블 생성
CREATE TABLE IF NOT EXISTS public.project_tags (
  id serial PRIMARY KEY,
  project_id uuid,
  tag text NOT NULL,
  CONSTRAINT project_tags_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
); 