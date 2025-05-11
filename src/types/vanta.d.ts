interface VantaEffect {
    destroy: () => void;
}

interface VantaGlobeConfig {
    el: string | HTMLElement;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    backgroundColor?: number;
}

interface Vanta {
    GLOBE: (config: VantaGlobeConfig) => VantaEffect;
}

declare global {
    interface Window {
        VANTA: Vanta;
    }
} 