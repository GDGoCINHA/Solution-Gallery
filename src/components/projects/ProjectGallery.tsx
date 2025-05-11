import Image from 'next/image';
import { Gallery } from '@/components/ui/display/ImageGallery';

interface ProjectGalleryProps {
  images?: string[];
  thumbnailUrl?: string;
  title: string;
}

export function ProjectGallery({ images, thumbnailUrl, title }: ProjectGalleryProps) {
  // 썸네일이 images에 없으면 prepend
  let galleryImages = images || [];
  if (thumbnailUrl && (!galleryImages.length || galleryImages[0] !== thumbnailUrl)) {
    if (!galleryImages.includes(thumbnailUrl)) {
      galleryImages = [thumbnailUrl, ...galleryImages];
    }
  }
  // 각 이미지가 비어있으면 대체 이미지로 대체
  const safeGalleryImages = galleryImages.map(img => img ? img : '/images/sample.jpg');
  return (
    <section className="w-full max-w-6xl flex justify-center mt-8 mb-4 px-4 md:px-8">
      {safeGalleryImages.length > 0 ? (
        <div className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-800 flex items-center">
          {/* 간단한 슬라이더: 좌우 버튼 + 이미지 */}
          <Gallery images={safeGalleryImages} title={title} />
        </div>
      ) : (
        <section className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-800 px-4 md:px-8">
          <Image
            src={thumbnailUrl || "/images/sample.jpg"}
            alt={title}
            fill
            className="object-contain"
            priority
          />
        </section>
      )}
    </section>
  );
} 