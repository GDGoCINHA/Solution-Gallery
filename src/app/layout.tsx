import * as React from "react";
import localFont from "next/font/local";
import Script from 'next/script';
import { NextUIProvider } from "@nextui-org/react";

// components
import ClientRoot from "@/components/client/ClientRoot";

// css
import "@/styles/globals.css";

const pretendard = localFont({
    src: "../../public/fonts/PretendardVariable.woff2",
    display: "swap",
    variable: "--font-pretendard",
    preload: true,
    fallback: ["system-ui", "arial"]
});

const ocra = localFont({
    src: "../../public/fonts/OCRAExtended.woff2",
    display: "swap",
    variable: "--font-ocra",
    preload: true,
    fallback: ["monospace"]
});

export const viewport = {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
    minimumScale: 1.0,
    userScalable: true,
    themeColor: "#202124",
    colorScheme: "light dark"
};

// 수정 필요
export const metadata = {
    metadataBase: new URL('https://solutions.gdgocinha.com/'),
    title: {
        template: '%s | Solution Gallery',
        default: 'GDGoC INHA Solution Gallery'
    },
    description: "2025 GDGoC INHA Solution Challenge Gallery",
    manifest: "@public/manifest.json",
    applicationName: "GDGoC Solution Gallery",
    keywords: [
        "google", "education", "technology", "developer", "gdg", "gdsc", "gdgoc",
        "google developer group", "google for developers", "google developer groups on campus",
        "inha", "university", "inha university", "구글", "개발자", "동아리", "인하대",
        "인하대학교", "학생", "프로그래밍", "코딩", "개발", "IT", "테크", "테크동아리",
        "웹개발", "앱개발", "클라우드", "AI", "머신러닝", "안드로이드", "iOS",
        "프론트엔드", "백엔드", "풀스택"
    ],
    authors: [{ name: "GDGoC INHA" }],
    creator: "GDGoC INHA",
    publisher: "GDGoC INHA",
    formatDetection: {
        telephone: true,
        date: true,
        address: true,
        email: true,
        url: true
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any", type: "image/x-icon" }
        ],
        shortcut: ["/favicon.ico"]
    },
    openGraph: {
        title: "GDGoC Solution Gallery",
        description: "GDGoC INHA Solution Gallery",
        url: "https://solutions.gdgocinha.com/",
        siteName: "GDGoC Solution Gallery",
        images: [
            {
                url: "https://solutions.gdgocinha.com/screenshots/home.png",
                width: 1280,
                height: 720,
                alt: "GDGoC INHA Landing"
            }
        ],
        type: "website",
        locale: "ko_KR",
    },
    twitter: {
        card: "summary_large_image",
        title: "GDGoC Solution Gallery",
        description: "GDGoC INHA Solution Gallery",
        images: ["https://solutions.gdgocinha.com/screenshots/home.png"],
        creator: "GDGoC INHA",
    },
    verification: {
        // Google Search Console 등에 사용되는 확인 코드가 있다면 추가
        // google: "VERIFICATION_CODE",
    },
    alternates: {
        canonical: 'https://solutions.gdgocinha.com',
        languages: {
            'ko-KR': 'https://solutions.gdgocinha.com',
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='ko' className={`${pretendard.variable} ${ocra.variable}`} suppressHydrationWarning>
            <head>
                <meta name="theme-color" content="#202124"/>
                <link rel="manifest" href="/manifest.json"/>
                <meta name="mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                <meta name="apple-mobile-web-app-title" content="GDGoC INHA Solution Gallery"/>
                <link rel="apple-touch-icon" href="/icons/apple-icon-180x180.png"/>
                <title>GDGoC Solution Gallery</title>
            </head>
            <body className={`${pretendard.className} antialiased bg-[#202124]`}>
                <NextUIProvider>
                    <ClientRoot>
                        {children}
                    </ClientRoot>
                </NextUIProvider>
                {/* Load Three.js first */}
                <Script 
                    src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
                    strategy="beforeInteractive"
                />
                {/* Then load VANTA */}
                <Script 
                    src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}