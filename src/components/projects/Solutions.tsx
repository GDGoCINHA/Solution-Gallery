import { useState } from "react";
import ProjectCard from "@/components/ui/cards/ProjectCard";
import SearchInput from "@/components/ui/form/SearchInput";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/types/project";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="text-center py-10">
      <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-10">
      <p className="text-zinc-400">검색 결과가 없습니다.</p>
    </div>
  );
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project: Project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default function Solutions() {
  const [searchTerm, setSearchTerm] = useState("");
  const { projects, loading, error } = useProjects(searchTerm);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full min-h-screen bg-[#202124] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <SearchInput 
            onChange={handleSearch} 
            value={searchTerm}
            placeholder="프로젝트명, 팀명으로 검색..."
          />
          {/* 필터 드롭다운 등 추가 가능 */}
        </div>
        
        {loading && <LoadingSpinner />}
        
        {error && <ErrorState />}
        
        {!loading && !error && projects.length === 0 && <EmptyState />}
        
        {!loading && !error && projects.length > 0 && <ProjectList projects={projects} />}
      </div>
    </div>
  );
}