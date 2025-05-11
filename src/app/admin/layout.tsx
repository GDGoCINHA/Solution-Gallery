'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase, isAdmin } from '@/lib/supabase';
import Footer from '@/components/common/Footer';
import AdminLoading from './Loading';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // 현재 경로가 /admin/login인지 확인
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // 로그인 페이지일 경우 인증 체크 생략
    if (isLoginPage) {
      setLoading(false);
      setAuthenticated(true);
      return;
    }

    // 인증 상태 체크
    const checkAuth = async () => {
      setLoading(true);
      
      // 현재 로그인된 사용자 가져오기
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }
      
      // 관리자 권한 확인
      const adminStatus = await isAdmin();
      
      if (!adminStatus) {
        // 관리자가 아니면 로그인 페이지로 리디렉션
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }
      
      setAuthenticated(true);
      setLoading(false);
    };

    checkAuth();
    
    // 인증 상태 변화 감지
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      // 로그인 페이지가 아닐 때만 인증 상태 확인
      if (!isLoginPage) {
        checkAuth();
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, isLoginPage, pathname]);

  // 로딩 중 표시
  if (loading) {
    return <AdminLoading />;
  }

  // 인증되지 않았을 때는 아무것도 표시하지 않음
  if (!authenticated) {
    return null;
  }

  // 로그인 페이지에는 기본 레이아웃 없이 자식 컴포넌트만 표시
  if (isLoginPage) {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* 관리자 헤더 */}
      <header className="bg-[#202124] text-white py-4 px-6 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">GDGoC 솔루션 갤러리 관리자</h1>
          <div className="space-x-2">
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/admin/login');
              }}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 container mx-auto my-6 px-4 md:px-6">
        {/* 사이드바 네비게이션 */}
        <aside className="w-64 bg-white rounded-lg shadow p-4 mr-6 hidden md:block overflow-y-auto">
          <nav className="space-y-1">
            <Link href="/admin" className="block px-4 py-2 rounded hover:bg-gray-100">
              대시보드
            </Link>
            <Link href="/admin/teams" className="block px-4 py-2 rounded hover:bg-gray-100">
              팀 관리
            </Link>
            <Link href="/admin/projects" className="block px-4 py-2 rounded hover:bg-gray-100">
              프로젝트 관리
            </Link>
            <Link href="/admin/members" className="block px-4 py-2 rounded hover:bg-gray-100">
              멤버 관리
            </Link>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 bg-white rounded-lg shadow p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
} 