-- public.projects 테이블 생성
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid,
  title text NOT NULL,
  summary text,
  description text,
  github_url text,
  demo_url text,
  tech_stack jsonb,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  vote_count integer DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT projects_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);
-- 관계
-- project_tags.project_id -> projects.id
-- project_images.project_id -> projects.id
-- project_votes.project_id -> projects.id 