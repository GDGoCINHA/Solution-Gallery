"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function Logo() {
  return (
    <Link href="/" className="flex flex-col items-start cursor-pointer">
      <div className="text-sm md:text-lg font-medium">GDGoC INHA</div>
      <div className="text-base md:text-xl font-bold">Solution Challenge 2025</div>
    </Link>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav className="hidden md:flex items-center justify-center flex-1 mx-4">
      <div className="flex gap-8">
        <Link href="/" className={`hover:text-gray-300 transition-colors ${pathname === '/' ? 'font-bold' : ''}`}>Home</Link>
        <Link href="/projects" className={`hover:text-gray-300 transition-colors ${pathname === '/projects' ? 'font-bold' : ''}`}>Projects</Link>
        <a href="https://gdgocinha.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">About</a>
      </div>
    </nav>
  );
}

function MobileNav({ pathname, setIsMenuOpen }: { pathname: string, setIsMenuOpen: (open: boolean) => void }) {
  return (
    <div className="w-full md:hidden mt-4">
      <nav className="flex flex-col space-y-3">
        <Link href="/" className={`hover:text-gray-300 transition-colors ${pathname === '/' ? 'font-bold' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link href="/projects" className={`hover:text-gray-300 transition-colors ${pathname === '/projects' ? 'font-bold' : ''}`} onClick={() => setIsMenuOpen(false)}>Projects</Link>
        <a href="https://gdgocinha.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
      </nav>
    </div>
  );
}

function MenuButton({ isMenuOpen, toggleMenu }: { isMenuOpen: boolean, toggleMenu: () => void }) {
  return (
    <button className="md:hidden p-2" onClick={toggleMenu} aria-label="Toggle menu">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
        {isMenuOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
}

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 기기 감지 및 리사이즈 이벤트 처리
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind의 md 브레이크포인트(768px) 기준
    };

    // 초기 로드 시 모바일 여부 확인
    checkIsMobile();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', checkIsMobile);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // 경로 변경 및 모바일 여부에 따라 헤더 표시 여부 결정
  useEffect(() => {
    // 모바일이거나 루트 경로가 아닌 경우 항상 헤더 표시
    if (isMobile || pathname !== '/') {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [pathname, isMobile]);

  // 마우스 호버 이벤트 처리를 위한 함수
  const handleMouseEnter = () => {
    // 데스크톱에서만 호버 이벤트 처리
    if (!isMobile) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    // 데스크톱 + 루트 경로에서만 마우스가 떠날 때 헤더를 숨김
    if (!isMobile && pathname === '/') {
      setIsVisible(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* 루트 경로의 데스크톱에서만 필요한 감지 영역 */}
      {pathname === '/' && !isMobile && (
        <div 
          className="fixed top-0 w-full h-8 z-40 hover:cursor-default" 
          onMouseEnter={handleMouseEnter}
        />
      )}

      {/* 헤더 */}
      <header 
        className={`fixed top-0 w-full bg-[#18191A]/80 text-white py-3 md:py-4 px-4 md:px-8 transition-all duration-300 z-50 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <Logo />
          <MenuButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
          <DesktopNav pathname={pathname} />

          {/* 로그인 버튼 - 데스크톱 */}
          {/* <div className="hidden md:block">
            <Link href="/login">
              <button className="px-4 py-2 bg-transparent hover:bg-white hover:text-black border border-white rounded transition-colors">
                Login
              </button>
            </Link>
          </div> */}

          {isMenuOpen && <MobileNav pathname={pathname} setIsMenuOpen={setIsMenuOpen} />}
        </div>
      </header>
    </>
  );
};

export default Header;
