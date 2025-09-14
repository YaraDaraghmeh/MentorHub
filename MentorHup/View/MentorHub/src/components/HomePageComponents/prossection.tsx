import React from 'react';
import { Mic, Users, MessageSquare } from 'lucide-react';
import FeatureCard from './FeatureCard';
import SectionHeader from './SectionHeader';
import { useTheme } from "../../Context/ThemeContext";


const LiveSessionsLanding = () => {
  const [mounted, setMounted] = React.useState(false);
  const { isDark } = useTheme();
  React.useEffect(() => {
    setMounted(true);
  }, []);


  const features = [
    {
      icon: <Mic className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />,
      title: "Live Video Interviews",
      description: "Conduct natural video interviews loaded by experts. Our technology ensures fluid conversations and accurate responses for efficient remote hiring.",
      videoTitle: "Real-time voice processing with advanced AI models",
      reverse: false
    },
    {
      icon: <Users className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />,
      title: "Experts in different fields",
      description: "Pick the best interviewers for the position you want to interview in. Get insights into soft skills in addition to technical skills.",
      videoTitle: "Interactive dashboard with live metrics",
      reverse: true
    },
    {
      icon: <MessageSquare className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />,
      title: "Real feedback",
      description: "Make decisions with instant interview metrics. Track performance, engagement, and competencies from your mentor.",
      videoTitle: "Interactive dashboard with live metrics",
      reverse: false
    }
  ];

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-cyan-100 to-green-100" />;
  }

  return (
          <div className={`min-h-screen transition-all duration-2000 ${
        isDark 
          ? 'bg-[#06171c]' 
          : 'bg-[#96FBF1]'
      }`}>
     
      
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-20 max-w-7xl">
          <SectionHeader  />
        
        <div className="space-y-8 sm:space-y-12 lg:space-y-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              videoTitle={feature.videoTitle}
              reverse={feature.reverse}
              
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveSessionsLanding;