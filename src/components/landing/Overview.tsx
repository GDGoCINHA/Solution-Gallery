import React from 'react';
import Image from 'next/image';

import OverviewImage from '/public/images/overviewImage.png';

export default function Overview() {
  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#202124] snap-start py-8 md:py-0 px-4 md:px-0">
      <div className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] bg-gray-200 rounded-md md:mr-16 mb-8 md:mb-0">
        <Image 
          src={OverviewImage} 
          alt="Solution Challenge 2025"
          className="w-full h-full object-cover" 
        />
      </div>
      {/* Text Area */}
      <div className="max-w-xl px-4 md:px-0">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center md:text-left whitespace-normal">
          Solution Challenge<span className="font-normal">란?</span>
        </h2>
        <p className="text-[#4285F4] font-semibold text-xl md:text-2xl mb-1 text-center md:text-left whitespace-normal">
          Solution Challenge
          <span className="text-white font-normal text-xl md:text-2xl">는</span>
        </p>
        <p className="text-white text-lg md:text-xl mb-3 md:mb-4 text-center md:text-left whitespace-normal">
          <span className="font-bold text-lg md:text-xl whitespace-normal">Google Developer Groups</span>
          에서 진행하는 프로젝트로,
        </p>
        <p className="text-[#D1D5DB] text-base md:text-lg leading-relaxed text-center md:text-left whitespace-normal">
          UN이 지정한 17개의 문제를 정의하고<br />
          솔루션을 개발하여 지속 가능한 미래를 만들어가는<br />
          프로젝트 입니다.
        </p>
        <p className="text-[#4285F4] font-semibold text-xl md:text-2xl mt-4 md:mt-6 mb-1 text-center md:text-left whitespace-normal">
          GDGoC INHA
          <span className="text-white font-normal text-xl md:text-2xl">는 2025년 올해 참가팀 전원 글로벌</span>
        </p>
        <p className="text-white text-lg md:text-xl mb-2 text-center md:text-left whitespace-normal">
          <span className="font-bold text-lg md:text-xl">Top 100</span>
          을 목표로 합니다.
        </p>
        <p className="text-[#D1D5DB] text-base md:text-lg leading-relaxed text-center md:text-left whitespace-normal">
          세상을 향한, 세상을 위한 우리의 도전에 함께해주세요!
        </p>
      </div>
    </section>
  );
}