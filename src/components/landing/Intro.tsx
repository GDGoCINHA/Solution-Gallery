import Image from 'next/image';

export default function Intro() {
    return (
        <section className="relative min-h-screen bg-[#202124] overflow-hidden snap-start">
            {/* VANTA GLOBE */}
            <div
                id="vanta-globe"
                className="absolute w-full h-full pointer-events-none"
                style={{ zIndex: 1 }}
            />
            {/* Title Text */}
            <div className="relative z-10 flex flex-col justify-center h-screen pl-[5%] w-[85%] mx-auto">
                <div className="flex items-center mb-6">
                    <Image
                        src="/logo.png"
                        alt="GDGoC Logo"
                        width={48}
                        height={48}
                        className="mr-3"
                        priority
                    />
                    <span className="text-white text-lg md:text-2xl font-semibold">
                        GDG on Campus Inha University
                    </span>
                </div>
                <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                    Solution Challenge 2025
                    <br />
                    Gallery
                </h1>
            </div>
        </section>
    );
}
