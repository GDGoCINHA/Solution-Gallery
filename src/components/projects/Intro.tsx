import { useEffect, useRef, RefObject } from 'react';

type VantaTopology = (options: Record<string, unknown>) => { destroy?: () => void };

// Reusable hook for VANTA effect
function useVantaTopology(ref: RefObject<HTMLDivElement>) {
    useEffect(() => {
        let vantaEffect: { destroy?: () => void } | null = null;
        let script: HTMLScriptElement | null = null;
        if (ref.current) {
            // Dynamically load VANTA and p5.js if not already loaded
            const loadVanta = async () => {
                const win = window as typeof window & {
                    VANTA?: { TOPOLOGY?: VantaTopology };
                };
                if (!win.VANTA || !win.VANTA.TOPOLOGY) {
                    // Load p5.js
                    const p5Script = document.createElement('script');
                    p5Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js';
                    p5Script.async = true;
                    document.body.appendChild(p5Script);
                    await new Promise((res) => {
                        p5Script.onload = res;
                    });
                    // Load VANTA.TOPOLOGY
                    script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js';
                    script.async = true;
                    document.body.appendChild(script);
                    await new Promise((res) => {
                        script!.onload = res;
                    });
                }
                if (win.VANTA && win.VANTA.TOPOLOGY) {
                    vantaEffect = win.VANTA.TOPOLOGY({
                        el: ref.current,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.0,
                        minWidth: 200.0,
                        scale: 1.0,
                        scaleMobile: 1.0,
                        backgroundColor: 0x202124,
                        color: 0x4298a4,
                    });
                }
            };
            loadVanta();
        }
        return () => {
            if (vantaEffect && typeof vantaEffect.destroy === 'function') {
                vantaEffect.destroy();
            }
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, [ref]);
}

export default function Intro() {
    const vantaRef = useRef<HTMLDivElement>(null!); // non-null assertion
    useVantaTopology(vantaRef);

    return (
        <section className="relative min-h-screen bg-[#202124] overflow-hidden">
            {/* VANTA TOPOLOGY */}
            <div
                ref={vantaRef}
                id="vanta-topology"
                className="absolute w-full h-full pointer-events-none"
                style={{ zIndex: 1 }}
            />
            {/* Title Text */}
            <div className="relative z-10 flex flex-col justify-center h-screen pl-[5%] w-[85%] mx-auto">
                <div className="flex mt-54 mb-2">
                    <span className="text-white text-lg md:text-3xl font-semibold">
                        Solution Challenge 2025 Showcases
                    </span>
                </div>
                <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                    프로젝트
                </h1>
            </div>
        </section>
    );
}
