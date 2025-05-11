"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800 bg-[#202124] py-6 px-4 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-2 md:gap-0">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-bold text-white">GDGoC INHA</span>
          <span className="text-xs md:text-sm">&copy; {new Date().getFullYear()} GDGoC Solution Gallery</span>
        </div>
        <div className="flex flex-row items-center gap-4 mt-2 md:mt-0">
          <a
            href="https://gdgocinha.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors underline underline-offset-2"
          >
            공식 홈페이지
          </a>
          {/* 추후 추가 링크: <a href="#" className="hover:text-white transition-colors">Link</a> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
