-- public.teams 테이블 생성
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);
-- 관계
-- members.team_id -> teams.id
-- projects.team_id -> teams.id 