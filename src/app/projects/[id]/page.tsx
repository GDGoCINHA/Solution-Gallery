'use client';

import { useParams } from "next/navigation";
import { useProjectDetail } from '@/hooks/useProjectDetail';
import Footer from '@/components/common/Footer';
import { TeamMembers } from '@/components/projects/TeamMembers';
import { HeroSection } from '@/components/projects/HeroSection';
import { ProjectTags } from '@/components/projects/ProjectTags';
import { ProjectLinks } from '@/components/projects/ProjectLinks';
import { SectionTitle } from '@/components/projects/SectionTitle';
import { ProjectDescription } from '@/components/projects/ProjectDescription';
import { ProjectFiles } from '@/components/projects/ProjectFiles';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { useState } from 'react';
import Loading from "@/app/Loading";

export default function ProjectsDetailPage() {
    const { id } = useParams();
    const { project, loading, error } = useProjectDetail(id as string);
    const [liked, setLiked] = useState(false);

    if (loading) return <Loading />;
    if (error || !project) return <div className="flex justify-center items-center h-screen text-red-500">{error || '프로젝트를 찾을 수 없습니다.'}</div>;

    return (
        <main className="relative min-h-screen bg-[#202124] flex flex-col items-center px-2 py-8 md:px-0">
            <HeroSection
                title={project.title}
                teamName={project.team_name}
                thumbnailUrl={project.thumbnail_url}
                liked={liked}
                onLike={() => setLiked(l => !l)}
            />
            <ProjectTags tags={project.tags || []} />
            <ProjectLinks githubUrl={project.github_url} demoUrl={project.demo_url} />
            <SectionTitle>Description</SectionTitle>
            <ProjectDescription description={project.description} />
            <SectionTitle>Presentation</SectionTitle>
            <ProjectFiles files={project.files} />
            <SectionTitle>Overview</SectionTitle>
            <ProjectGallery images={project.images} thumbnailUrl={project.thumbnail_url} title={project.title} />
            <SectionTitle>Team</SectionTitle>
            {project.members && project.members.length > 0 && (
                <TeamMembers members={project.members} />
            )}
            <Footer />
        </main>
    );
}
