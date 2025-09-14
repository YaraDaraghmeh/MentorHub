import React from 'react';
import HeroSection from '../../components/AboutUsComponents/HeroSection';
import CompanyLogosSection from '../../components/HomePageComponents/CompanyLogosSection';
import AboutSectionCards from '../../components/AboutUsComponents/AboutSectionCards';
import OurTeam from '../../components/AboutUsComponents/OurTeam';

const AboutUsPage: React.FC = () => {
  

  return (
    <>
    <HeroSection  />
    <AboutSectionCards />
    <OurTeam  />
    <CompanyLogosSection />
   </>
      
  
  );
};

export default AboutUsPage;
