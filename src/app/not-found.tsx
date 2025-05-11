'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#202124] text-white px-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-8">페이지를 찾을 수 없습니다.<br /><span className="text-zinc-400">Sorry, the page you are looking for does not exist.</span></p>
      <Link href="/" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow">
        홈으로 돌아가기
      </Link>
    </div>
  );
} 