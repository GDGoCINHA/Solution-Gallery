-- public.members 테이블 생성
CREATE TABLE IF NOT EXISTS public.members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid,
  name text NOT NULL,
  affiliation text,
  profile_image_url text,
  role text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
); 