-- public.project_files 테이블 생성
CREATE TABLE IF NOT EXISTS public.project_files (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  file_url text NOT NULL,
  file_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT project_files_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);

-- RLS 활성화 및 public select 정책
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all for project_files" ON public.project_files
FOR SELECT USING (true); 