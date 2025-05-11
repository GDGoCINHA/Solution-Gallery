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