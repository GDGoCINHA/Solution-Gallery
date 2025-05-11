'use client';

import Image from 'next/image';
import { useState } from 'react';
import gdgocIcon from '/public/logo.png';

export default function AdminLoading() {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#202124]/90"
      role="status"
      aria-label="로딩 중"
    >
      {/* GDGoC 로고 + 회전 원 */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-red-500 border-dashed animate-spin" />
        <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-[#202124] rounded-full">
          {!imageError ? (
            <Image
              src={gdgocIcon}
              alt="GDGoC Icon"
              width={48}
              height={48}
              className="object-contain"
              priority
              loading="eager"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-red-500 text-lg font-bold">GDGoC</span>
          )}
        </div>
      </div>
      {/* 프로그레스 바 */}
      <div className="w-40 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-red-500 to-red-400 rounded-full animate-loading-shuttle-admin" />
      </div>
      {/* 애니메이션 정의 */}
      <style jsx global>{`
        @keyframes loading-shuttle-admin {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(300%); }
          100% { transform: translateX(-100%); }
        }
        .animate-loading-shuttle-admin {
          animation: loading-shuttle-admin 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 