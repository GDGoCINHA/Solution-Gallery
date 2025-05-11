import Image from 'next/image';
import { Button } from '@/components/ui/base/Button';
import React from 'react';

interface HeroSectionProps {
  title: string;
  teamName?: string;
  thumbnailUrl?: string;
  liked: boolean;
  onLike: () => void;
}

export function HeroSection({ title, teamName, thumbnailUrl, liked, onLike }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[240px] md:min-h-[320px] flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 overflow-hidden mx-0">
      {/* 연한 배경 이미지 */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Image
          src={thumbnailUrl || "/images/sample.jpg"}
          alt="타이틀 배경"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>
      {/* 왼쪽 하단 텍스트 */}
      <div className="absolute left-0 bottom-0 z-10 p-4 md:p-14 flex flex-col-reverse items-start gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{title}</h1>
        {teamName && <div className="text-zinc-300 text-sm mb-2">{teamName}</div>}
      </div>
      {/* 헤더 오른쪽 중앙 좋아요(하트) 버튼 */}
      <div className="absolute right-0 top-[60%] z-10 pr-10 pt-6 pb-6 pl-6 flex items-center justify-end">
        <Button
          aria-label="좋아요"
          variant="outline"
          className={`rounded-full px-6 py-2 border-white text-white bg-transparent hover:bg-white/10 text-2xl transition-colors ${liked ? 'text-red-500' : 'text-white'}`}
          onClick={onLike}
        >
          <span role="img" aria-label="heart">❤️</span>
        </Button>
      </div>
    </section>
  );
} 