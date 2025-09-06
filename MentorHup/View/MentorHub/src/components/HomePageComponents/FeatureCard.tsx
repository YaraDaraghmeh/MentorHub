import React from 'react';
import VideoDisplay from '../HomePageComponents/VideoDisplay';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  videoTitle?: string;
  videoSubtitle?: string;
  reverse?: boolean;
  isDark?: boolean;
  index?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  videoTitle, 
  videoSubtitle,
  reverse = false,
  isDark = false,
  index = 0
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 1000);
    return () => clearTimeout(timer);
  }, [index]);

  const textContent = (
    <div className={`w-full lg:w-1/2 ${reverse ? 'lg:order-2 lg:pl-6 xl:pl-8' : 'lg:pr-6 xl:pr-8'} transform transition-all duration-1000 ${
      isVisible 
        ? 'translate-x-0 opacity-100' 
        : reverse 
          ? 'translate-x-8 opacity-0' 
          : '-translate-x-8 opacity-0'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-start mb-4 sm:mb-6">
        <div className={`${isDark ? 'bg-green-900/30 hover:bg-green-800/40' : 'bg-green-100 hover:bg-green-200'} p-2.5 sm:p-3 rounded-lg mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 self-start transition-all duration-300 hover:scale-110 transform ${
          isVisible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2 sm:mb-3 leading-tight transition-all duration-1000 hover:text-green-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {title}
          </h3>
        </div>
      </div>
      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed text-sm sm:text-base lg:text-lg transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}>
        {description}
      </p>
    </div>
  );

  const videoContent = (
    <div className={`w-full lg:w-1/2 ${reverse ? 'lg:order-1' : ''} mt-6 lg:mt-0 transform transition-all duration-1000 ${
      isVisible 
        ? 'translate-x-0 opacity-100' 
        : reverse 
          ? '-translate-x-8 opacity-0' 
          : 'translate-x-8 opacity-0'
    }`}>
      <VideoDisplay 
        title={videoTitle} 
        subtitle={videoSubtitle} 
        isDark={isDark}
        delay={index}
      />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 xl:gap-12 mb-12 sm:mb-16 lg:mb-20">
      {textContent}
      {videoContent}
    </div>
  );
};

export default FeatureCard;
