'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // 에러가 발생할 때마다 실행됨
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#202124] text-white px-4">
      <h1 className="text-4xl font-bold mb-4">문제가 발생했습니다</h1>
      <p className="text-lg mb-8">예상치 못한 오류가 발생했습니다.<br /><span className="text-zinc-400">An unexpected error has occurred.</span></p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow mb-2"
      >
        다시 시도하기
      </button>
      <div className="text-sm text-zinc-400 mt-4 max-w-xl break-all">
        {error?.message}
      </div>
    </div>
  );
} 