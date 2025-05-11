import * as React from "react";
import Image from "next/image";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { title, team_name, tags, thumbnail_url, id } = project;
  
  return (
    <a
      href={`/projects/${id}`}
      rel="noopener noreferrer"
      className="block h-full w-full focus:outline-none focus:ring-2 focus:ring-primary rounded-xl transition-transform hover:scale-105"
    >
      <div className="relative h-[340px] md:h-[380px] w-full overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow">
        <Image
          src={thumbnail_url || "/src/images/placeholder.jpg"}
          alt={title}
          fill
          className="object-cover object-center w-full h-full"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col gap-1">
          <div className="flex flex-wrap gap-2">
            {tags && tags.length > 0 && (
              tags.map((tag) => (
                <p key={tag} className="text-xs text-primary font-semibold text-white hover:text-zinc-200 transition-colors">{`#${tag}`}</p>
              ))
            )}
          </div>
          <h3 className="text-base md:text-lg font-bold text-white truncate">{title}</h3>
          <span className="text-xs text-zinc-200">{team_name || ""}</span>
        </div>
      </div>
    </a>
  );
}