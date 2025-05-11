import React from 'react';
import Image, { StaticImageData } from "next/image";

interface CardProps {
  children: React.ReactNode;
  imageLink: string | StaticImageData;
  imageAlt?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
}

export default function TopicCard({ children, imageLink, imageAlt = "Image", onClick, className = '', style, active = false }: CardProps) {
  return (
      <div
          onClick={onClick}
          className={`relative bg-gray-100 rounded-xl shadow-md cursor-pointer transition hover:scale-105 hover:shadow-lg overflow-hidden ${className}`}
          style={{ minHeight: '8rem', ...style }}
      >
          <Image
            src={imageLink}
            alt={imageAlt}
            fill
            className={`object-cover w-full h-full absolute top-0 left-0 z-0 transition duration-200
              ${active ? 'brightness-100' : 'brightness-75 hover:brightness-100'}
            `}
            priority
          />
          <div className={`relative z-10 p-2 text-left text-sm w-full h-full flex items-end rounded-xl
            ${active ? 'bg-transparent' : 'bg-black/40'} text-white`}>
            {children}
          </div>
      </div>
  );
}