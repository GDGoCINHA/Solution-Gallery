'use client';

import { useEffect, useRef } from 'react';

import Intro from '@/components/landing/Intro';
import Overview from '@/components/landing/Overview';
import Topic from '@/components/landing/Topic';
import Solutions from '@/components/landing/Solutions';
import Footer from '@/components/common/Footer';

declare global {
    interface Window {
        VANTA: {
            GLOBE: (config: {
                el: HTMLElement;
                mouseControls: boolean;
                touchControls: boolean;
                gyroControls: boolean;
                minHeight: number;
                minWidth: number;
                scale: number;
                scaleMobile: number;
                color: number;
                color2: number;
                backgroundColor: number;
                points: number;
                maxDistance: number;
                spacing: number;
            }) => {
                destroy: () => void;
            };
        };
    }
}

export default function Home() {
    const vantaEffect = useRef<{ destroy: () => void } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isScrolling = useRef(false);

    useEffect(() => {
        const checkVanta = setInterval(() => {
            if (window.VANTA) {
                const vantaElement = document.getElementById('vanta-globe');
                if (vantaElement) {
                    clearInterval(checkVanta);
                    vantaEffect.current = window.VANTA.GLOBE({
                        el: vantaElement,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: 1.00,
                        scaleMobile: 1.00,
                        color: 0x4285F4,
                        color2: 0x34A853,
                        backgroundColor: 0x202124,
                        points: 10.0,
                        maxDistance: 25.0,
                        spacing: 20.0,
                    });
                }
            }
        }, 100);

        return () => {
            clearInterval(checkVanta);
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const sections = Array.from(container.children) as HTMLElement[];

        const onWheel = (e: WheelEvent) => {
            if (isScrolling.current) return;
            isScrolling.current = true;
            e.preventDefault();

            const currentScroll = container.scrollTop;
            const sectionTops = sections.map(sec => sec.offsetTop);
            const currentIdx = sectionTops.findIndex((top, i) =>
                currentScroll >= top && (i === sectionTops.length - 1 || currentScroll < sectionTops[i + 1])
            );

            let nextIdx = currentIdx;
            if (e.deltaY > 0 && currentIdx < sections.length - 1) {
                nextIdx = currentIdx + 1;
            } else if (e.deltaY < 0 && currentIdx > 0) {
                nextIdx = currentIdx - 1;
            }

            sections[nextIdx].scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                isScrolling.current = false;
            }, 700); // 스크롤 애니메이션 시간
        };

        container.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, []);

    return (
        <main
            ref={containerRef}
            className="relative h-screen overflow-y-scroll hide-scrollbar"
            style={{ scrollSnapType: 'y mandatory' }}
        >
            <div className="snap-start min-h-screen">
                <Intro />
            </div>
            <div className="snap-start min-h-screen">
                <Overview />
            </div>
            <div className="snap-start min-h-screen">
                <Topic />
            </div>
            <div className="snap-start h-screen flex flex-col">
                <Solutions />
                <div className="mt-0 md:mt-auto">
                    <Footer />
                </div>
            </div>
        </main>
    );
}
