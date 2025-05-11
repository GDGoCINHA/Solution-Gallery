import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/base/Button';

interface GalleryProps {
  images: string[];
  title: string;
}

export function Gallery({ images, title }: GalleryProps) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  // 이미지가 비어있거나 falsy면 대체 이미지로 대체
  const safeImages = images.map(img => img ? img : '/images/sample.jpg');

  const prev = () => setCurrent((c) => (c === 0 ? total - 1 : c - 1));
  const next = () => setCurrent((c) => (c === total - 1 ? 0 : c + 1));

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 이미지 */}
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src={safeImages[current]}
          alt={`${title} 이미지 ${current + 1}`}
          fill
          className="object-contain select-none"
          priority
        />
      </div>
      {/* 좌우 버튼 */}
      {total > 1 && (
        <>
          <Button
            variant="ghost"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
            onClick={prev}
            aria-label="이전 이미지"
            size="sm"
          >
            &#8592;
          </Button>
          <Button
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
            onClick={next}
            aria-label="다음 이미지"
            size="sm"
          >
            &#8594;
          </Button>
        </>
      )}
      {/* dot indicator */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${idx === current ? 'bg-white' : 'bg-zinc-500'} transition-colors`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 