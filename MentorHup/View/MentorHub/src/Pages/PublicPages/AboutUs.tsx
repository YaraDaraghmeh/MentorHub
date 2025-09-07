import React from 'react';
import HeroSection from '../../components/AboutUsComponents/HeroSection';
import CompanyLogosSection from '../../components/HomePageComponents/CompanyLogosSection';
import AboutSectionCards from '../../components/AboutUsComponents/AboutSectionCards';
import OurTeam from '../../components/AboutUsComponents/OurTeam';
interface HomePageProps {
  isDark?: boolean;
}

const AboutUsPage: React.FC<HomePageProps> = ({ isDark = false }) => {

  return (
    <>
    <HeroSection isDark={isDark} />
    <AboutSectionCards isDark={isDark} />
    <OurTeam isDark={isDark} />
    <CompanyLogosSection isDark={isDark} />
   </>
      
  
  );
};

export default AboutUsPage;
