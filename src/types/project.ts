export type Project = {
  id: string;
  title: string;
  team_id?: string;
  team_name?: string;
  summary?: string;
  description?: string;
  github_url?: string;
  demo_url?: string;
  tech_stack?: string[];
  thumbnail_url?: string;
  tags?: string[] | null;
  vote_count?: number;
  created_at?: string;
  images?: string[];
  files?: { name: string; url: string }[];
}; 