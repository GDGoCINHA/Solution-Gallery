-- public.project_votes 테이블 생성
CREATE TABLE IF NOT EXISTS public.project_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  fingerprint text NOT NULL,
  ip_hash text NOT NULL,
  user_agent_hash text NOT NULL,
  vote_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  cookie_id uuid,
  PRIMARY KEY (id),
  CONSTRAINT project_votes_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
); 