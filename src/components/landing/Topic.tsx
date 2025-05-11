import React, { useState } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import { StaticImageData } from 'next/image';

import TopicCard from '@/components/ui/cards/TopicCard';
import agricultureImage from '/public/images/agriculture.jpg';
import healthcareImage from '/public/images/healthcare.jpg';
import tourismImage from '/public/images/tourism.jpg';
import sustainabilityImage from '/public/images/sustainability.jpg';

interface TopicType {
  key: string;
  label: string;
  koreanLabel: string;
  description: string;
  image: StaticImageData;
}

const TOPICS: TopicType[] = [
  {
    key: 'agriculture',
    label: '#Agriculture',
    koreanLabel: '농업',
    description: '기아 종식과 식량 안보, 지속 가능한 농업 발전을 통해 모두를 위한 건강한 삶을 지원합니다.',
    image: agricultureImage,
  },
  {
    key: 'tourism',
    label: '#Tourism',
    koreanLabel: '관광',
    description: '지속 가능한 관광은 경제 성장과 고용 창출, 문화 보존, 환경 보호에 기여합니다.',
    image: tourismImage,
  },
  {
    key: 'healthcare',
    label: '#Healthcare',
    koreanLabel: '보건',
    description: '모두를 위한 건강과 웰빙 보장, 양질의 의료 서비스 접근성 확대를 목표로 합니다.',
    image: healthcareImage,
  },
  {
    key: 'sustainability',
    label: '#Sustainability',
    koreanLabel: '지속가능성',
    description: '지속 가능한 개발과 환경 보호, 기후 변화 대응을 통해 미래 세대를 위한 지구를 지킵니다.',
    image: sustainabilityImage,
  },
];

// --- TopicGrid ---
function TopicGrid({ selected, setSelected, isMobile }: { selected: TopicType, setSelected: React.Dispatch<React.SetStateAction<TopicType>>, isMobile: boolean }) {
  return (
    <div className="w-full lg:w-7/12">
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-2 md:gap-4 h-[50vh] md:h-[60vh]">
        <TopicCard
          onClick={() => setSelected(TOPICS[0])}
          className="col-span-2 row-span-1 flex items-end text-black text-lg md:text-2xl font-semibold"
          imageLink={TOPICS[0].image}
          imageAlt="Agriculture"
          active={isMobile && selected.key === TOPICS[0].key}
        >
          <span className="whitespace-normal">{TOPICS[0].label}</span>
        </TopicCard>
        <TopicCard
          onClick={() => setSelected(TOPICS[1])}
          className="col-span-1 row-span-1 flex items-end text-black text-lg md:text-2xl font-semibold"
          imageLink={TOPICS[1].image}
          imageAlt="Tourism"
          active={isMobile && selected.key === TOPICS[1].key}
        >
          <span className="whitespace-normal">{TOPICS[1].label}</span>
        </TopicCard>
        <TopicCard
          onClick={() => setSelected(TOPICS[3])}
          className="col-span-1 row-span-1 md:row-span-2 flex items-end text-black text-lg md:text-2xl font-semibold"
          imageLink={TOPICS[3].image}
          imageAlt="Sustainability"
          active={isMobile && selected.key === TOPICS[3].key}
        >
          <span className="whitespace-normal">{TOPICS[3].label}</span>
        </TopicCard>
        <TopicCard
          onClick={() => setSelected(TOPICS[2])}
          className="col-span-2 md:col-span-3 row-span-1 flex items-end text-black text-lg md:text-2xl font-semibold"
          imageLink={TOPICS[2].image}
          imageAlt="Healthcare"
          active={isMobile && selected.key === TOPICS[2].key}
        >
          <span className="whitespace-normal">{TOPICS[2].label}</span>
        </TopicCard>
      </div>
    </div>
  );
}

// --- TopicDetail ---
function TopicDetail({ selected }: { selected: TopicType }) {
  return (
    <div className="w-full lg:w-5/12 flex flex-col text-center lg:text-left justify-center mt-8 lg:mt-0">
      <h2 className="text-white text-2xl md:text-3xl font-bold mb-2 whitespace-normal">{selected.koreanLabel}</h2>
      <p className="text-white text-base md:text-lg whitespace-normal">{selected.description}</p>
    </div>
  );
}

// --- Main Topic ---
export default function Topic() {
  const [selected, setSelected] = useState<TopicType>(TOPICS[0]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="w-full min-h-screen bg-[#202124] flex flex-col items-center pt-16 px-4 snap-start">
      <h1 className="text-white text-3xl md:text-5xl font-bold mb-12 md:mb-24 whitespace-normal">Topic</h1>
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 md:gap-16 px-4 md:pl-32">
        <TopicGrid selected={selected} setSelected={setSelected} isMobile={isMobile} />
        <TopicDetail selected={selected} />
      </div>
    </div>
  );
}