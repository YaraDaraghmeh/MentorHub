import React from "react";
import HeroSection from "../../components/HomePageComponents/HeroSection";
import CompanyLogosSection from "../../components/HomePageComponents/CompanyLogosSection";
import LiveSessionsLanding from "../../components/HomePageComponents/prossection";
import WhatNumberssaySection from "../../components/HomePageComponents/WhatNumberssaySection";
import PlatformWalkthrough from "../../components/HomePageComponents/WalkThrough";
import TestimonialsSection from "../../components/HomePageComponents/Testemotional";
import { useTheme } from "../../Context/ThemeContext";
import FAQSection from "../../components/HomePageComponents/FAQSection";
import '../../components/HomePageComponents/FAQSection'

const HomePage: React.FC = () => {
  const { isDark: themeIsDark } = useTheme();
  return (
    <>
      <HeroSection  />
      <CompanyLogosSection />
      <WhatNumberssaySection />
      <LiveSessionsLanding  />
      <PlatformWalkthrough
      
        videoUrl={
          "https://www.youtube.com/embed/Y9-0Jj3avRg?si=A-35oqff_ahFSrqo"
        }
      />
      <FAQSection  />
      <TestimonialsSection />
    </>
  );
};

export default HomePage;
