import ReactMarkdown from 'react-markdown';
import './ProjectDescription.css';

interface ProjectDescriptionProps {
  description?: string;
}

export function ProjectDescription({ description }: ProjectDescriptionProps) {
  if (!description) return null;
  return (
    <section className="w-full max-w-4xl flex justify-center mb-4 px-2 md:px-0">
      <div className="bg-zinc-900/80 text-zinc-100 rounded-lg p-6 w-full text-base md:text-lg leading-relaxed shadow markdown-body">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
    </section>
  );
} 