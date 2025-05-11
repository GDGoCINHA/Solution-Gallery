'use client';

import { useEffect, useRef } from 'react';

import Intro from '@/components/projects/Intro';
import Solutions from '@/components/projects/Solutions';
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

    return (
        <main className="relative h-screen overflow-y-scroll snap-y snap-mandatory">
            <Intro />
            <Solutions />
            <Footer />
        </main>
    );
}
