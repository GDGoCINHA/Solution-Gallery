import React, { useRef, useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import ProjectCard from "@/components/ui/cards/ProjectCard";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/project";

// 메인 Solutions 컴포넌트
// const PROJECTS = Array.from({ length: 12 }).map(() => ({
//     hashtag: "#해시태그",
//     team: "팀명",
//     title: "프로젝트명",
//     image: "/src/images/overviewImage.png",
//     link: "https://example.com"
// }));

const SLIDES_TO_SHOW = {
    mobile: 1,      // 모바일에서는 1개씩 표시
    tablet: 2,      // 태블릿에서는 2개씩 표시
    desktop: 3      // 데스크톱에서는 3개씩 표시
};

// --- ProjectSkeletonCard ---
function ProjectSkeletonCard() {
    return (
        <div className="min-w-0 flex-[0_0_100%] max-w-[100%] sm:flex-[0_0_50%] sm:max-w-[50%] lg:flex-[0_0_33.33%] lg:max-w-[33.33%] px-0" style={{ scrollSnapAlign: 'start' }}>
            <div className="h-[340px] md:h-[380px] w-full rounded-xl bg-gray-800 animate-pulse"></div>
        </div>
    );
}

// --- ProjectCardList ---
function ProjectCardList({ projects }: { projects: Project[] }) {
    return (
        <>
            {projects.map((project, idx) => (
                <div
                    key={project.id || idx}
                    className="min-w-0 flex-[0_0_100%] max-w-[100%] sm:flex-[0_0_50%] sm:max-w-[50%] lg:flex-[0_0_33.33%] lg:max-w-[33.33%] px-0"
                    style={{ scrollSnapAlign: 'start' }}
                >
                    <ProjectCard project={project} />
                </div>
            ))}
        </>
    );
}

// --- ProjectSlider ---
function ProjectSlider({ loading, projects }: { loading: boolean, projects: Project[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    // 드래그/스와이프 이벤트 핸들러
    const onDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        isDragging.current = true;
        startX.current = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        scrollLeft.current = trackRef.current ? trackRef.current.scrollLeft : 0;
    };
    const onDragMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging.current || !trackRef.current) return;
        const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const walk = startX.current - x;
        trackRef.current.scrollLeft = scrollLeft.current + walk;
    };
    const onDragEnd = () => {
        isDragging.current = false;
        
        // 현재 화면 너비에 따라 적절한 슬라이드 수 결정
        let slidesToShow = SLIDES_TO_SHOW.mobile;
        if (window.innerWidth >= 640) slidesToShow = SLIDES_TO_SHOW.tablet;
        if (window.innerWidth >= 1024) slidesToShow = SLIDES_TO_SHOW.desktop;
        
        // 카드 단위로 스냅
        if (!trackRef.current) return;
        const cardWidth = trackRef.current.offsetWidth / slidesToShow;
        const newIdx = Math.round(trackRef.current.scrollLeft / cardWidth);
        trackRef.current.scrollTo({
            left: newIdx * cardWidth,
            behavior: "smooth"
        });
    };

    // 마우스 이벤트 핸들러 래핑
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        onDragStart(e);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };
    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        // MouseEvent는 clientX만 필요
        if (!trackRef.current) return;
        const x = e.clientX;
        const walk = startX.current - x;
        trackRef.current.scrollLeft = scrollLeft.current + walk;
    };
    const onMouseUp = () => {
        onDragEnd();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };

    return (
        <div className="w-full max-w-7xl mx-auto overflow-hidden hide-scrollbar">
            <div
                ref={trackRef}
                className="flex gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-10 items-stretch touch-pan-x select-none cursor-grab hide-scrollbar"
                style={{ scrollSnapType: 'x mandatory', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
                onTouchStart={onDragStart}
                onTouchMove={onDragMove}
                onTouchEnd={onDragEnd}
                onMouseDown={handleMouseDown}
            >
                {loading
                    ? Array.from({ length: 6 }).map((_, idx) => <ProjectSkeletonCard key={idx} />)
                    : <ProjectCardList projects={projects} />
                }
            </div>
        </div>
    );
}

export default function Solutions() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 프로젝트 데이터를 Supabase에서 가져오기
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // 프로젝트 기본 정보 가져오기
                const { data: projectsData, error } = await supabase
                    .from('projects')
                    .select(`
                        *,
                        teams (name)
                    `)
                    .order('vote_count', { ascending: false })
                    .limit(12);  // 최대 12개까지 표시

                if (error) {
                    throw new Error(error.message);
                }

                // 프로젝트 태그 가져오기
                const projectsWithTags = await Promise.all(
                    projectsData.map(async (project) => {
                        const { data: tagData } = await supabase
                            .from('project_tags')
                            .select('tag')
                            .eq('project_id', project.id);
                            
                        const tags = tagData ? tagData.map(t => t.tag) : [];
                        
                        return {
                            ...project,
                            team_name: project.teams?.name || '',
                            tags,
                            thumbnail_url: project.thumbnail_url || '/icons/default-project.png' // 기본 이미지 설정
                        };
                    })
                );

                setProjects(projectsWithTags);
            } catch (err) {
                console.error('프로젝트를 불러오는 중 오류가 발생했습니다:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <section className="w-full h-full flex flex-col items-center justify-center bg-[#202124] py-12 md:py-16 px-4 snap-start">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white text-center mb-3 md:mb-4">
                Project
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/80 text-center mb-8 md:mb-12">
                2025 솔루션 챌린지의 작업물들입니다.
            </p>
            <ProjectSlider loading={loading} projects={projects} />
            <Button
                size="lg"
                className="w-full max-w-[250px] h-12 md:h-14 flex items-center justify-center text-base md:text-lg font-bold rounded-xl bg-white text-black hover:bg-white/90 transition-all shadow-lg cursor-pointer"
                onPress={() => window.location.href = "/projects"}
            >
                <span className="text-sm md:text-sm text-black">더보기</span>
            </Button>

        </section>
    );
}