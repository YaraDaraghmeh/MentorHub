import React from 'react';

interface SectionHeaderProps {
  isDark?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ isDark = false }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center mb-12 sm:mb-16 lg:mb-20">
      <h1 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold ${isDark ? 'text-white' : 'text-[#06171C]'} mb-3 sm:mb-4 leading-tight transition-all duration-2000 transform hover:scale-105 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
      }`}>
        Live Sessions
      </h1>
      <h2 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight transition-all duration-2000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
      }`} style={{ transitionDelay: '1000ms' }}>
        <span className={`${isDark ? 'text-white' : 'text-gray-800'}`}>that</span> <span className="text-[#27B467] hover:text-[#27B467] transition-colors duration-300 hover:scale-110 inline-block transform">transforms</span> <span className={`${isDark ? 'text-white' : 'text-gray-800'}`}>hiring</span>
      </h2>
      <p className={`${isDark ? 'text-[#00A896]' : 'text-gray-600'} text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-md lg:max-w-2xl mx-auto px-4 transition-all duration-2000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`} style={{ transitionDelay: '2000ms' }}>
        Discover how our platform revolutionizes preparing for interviews
      </p>
    </div>
  );
};

export default SectionHeader;
