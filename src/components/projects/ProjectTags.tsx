import { Badge } from '@/components/ui/display/Badge';

interface ProjectTagsProps {
  tags?: string[];
}

export function ProjectTags({ tags }: ProjectTagsProps) {
  if (!tags || tags.length === 0) return null;
  return (
    <section className="w-full max-w-4xl flex flex-wrap gap-2 justify-center mb-4">
      {tags.map(tag => (
        <Badge key={tag} className="px-3 py-1 bg-white text-[#202124] border-white">#{tag}</Badge>
      ))}
    </section>
  );
} 