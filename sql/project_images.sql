-- public.project_images 테이블 생성
CREATE TABLE IF NOT EXISTS public.project_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT project_images_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);

-- RLS 활성화 및 public select 정책
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all for project_images" ON public.project_images
FOR SELECT USING (true); 