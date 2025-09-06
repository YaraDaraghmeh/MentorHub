import React from 'react';
import HeroSection from '../../components/HomePageComponents/HeroSection';
import CompanyLogosSection from '../../components/HomePageComponents/CompanyLogosSection';
import LiveSessionsLanding from '../../components/HomePageComponents/prossection';
import WhatNumberssaySection from '../../components/HomePageComponents/WhatNumberssaySection';
import PlatformWalkthrough from '../../components/HomePageComponents/WalkThrough';
import TestimonialsSection from '../../components/HomePageComponents/Testemotional';

interface HomePageProps {
  isDark?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isDark = false }) => {

  return (
    <>
    <HeroSection isDark={isDark} />
    <CompanyLogosSection isDark={isDark} />
    <WhatNumberssaySection isDark={isDark} />
    <LiveSessionsLanding isDark={isDark} />
   <PlatformWalkthrough isDark={isDark} />
   <TestimonialsSection isDark={isDark} />
   </>
      
  
  );
};

export default HomePage;
