import { Button } from '@/components/ui/base/Button';

interface ProjectLinksProps {
  githubUrl?: string;
  demoUrl?: string;
}

function normalizeUrl(url?: string) {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return 'https://' + trimmed;
}

export function ProjectLinks({ githubUrl, demoUrl }: ProjectLinksProps) {
  const normalizedGithub = normalizeUrl(githubUrl);
  const normalizedDemo = normalizeUrl(demoUrl);
  if (!normalizedGithub && !normalizedDemo) return null;
  return (
    <section className="w-full max-w-4xl flex gap-4 justify-center mb-8">
      {normalizedGithub && (
        <a href={normalizedGithub} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="rounded-full px-6 text-white border-white">Github</Button>
        </a>
      )}
      {normalizedDemo && (
        <a href={normalizedDemo} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="rounded-full px-6 text-white border-white">Demo</Button>
        </a>
      )}
    </section>
  );
} 