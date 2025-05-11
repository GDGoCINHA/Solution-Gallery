import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionTitle({ children, className = '', id }: SectionTitleProps) {
  return (
    <div id={id} className={`w-full max-w-6xl flex justify-start mt-2 mb-4 px-4 md:px-8 ${className}`}>
      <h1 className="text-xl md:text-2xl font-semibold text-white border-l-4 border-primary pl-3">{children}</h1>
    </div>
  );
} 