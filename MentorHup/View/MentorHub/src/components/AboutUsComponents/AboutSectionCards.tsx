import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from "../../Context/ThemeContext";

interface MentorHubAboutProps {
  isDark?: boolean;
}

const MentorHubAbout: React.FC<MentorHubAboutProps> = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = sectionRef.current?.querySelectorAll('[data-animate]');
    elements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const themeStyles = {
    backgroundColor: isDark ? '#06171c' : '#96fbf1',
    color: isDark ? '#ffffff' : '#071b21'
  };

  const cardStyles = {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(7, 27, 33, 0.03)',
    borderColor: isDark ? 'rgba(72, 46, 244, 0.15)' : 'rgba(7, 27, 33, 0.15)',
    backdropFilter: 'blur(20px)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(7, 27, 33, 0.1)'
  };

  const gradientTextStyle = {
    background: 'linear-gradient(135deg, #2a5a55, #05704cff, #062234ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    backgroundSize: '200% 200%',
    animation: 'gradient-shift 4s ease-in-out infinite'
  };

  const stats = [
    { number: '500+', label: 'Expert Trainers', delay: '0ms' },
    { number: '10K+', label: 'Success Stories', delay: '200ms' },
    { number: '25+', label: 'Industries', delay: '400ms' },
    { number: '98%', label: 'Success Rate', delay: '600ms' }
  ];

  const features = [
    {
      id: 'feature-1',
      icon: (
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: 'Industry Expertise',
      description: 'Connect with seasoned professionals who have mastered the art of interviewing across diverse sectors and career levels.',
      stats: '500+ Experts'
    },
    {
      id: 'feature-2',
      icon: (
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      ),
      title: 'Smart Scheduling',
      description: 'AI-powered scheduling system that adapts to your timezone and preferences, ensuring optimal learning conditions.',
      stats: '24/7 Available'
    },
    {
      id: 'feature-3',
      icon: (
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
        </svg>
      ),
      title: 'Enterprise Security',
      description: 'Bank-level encryption and privacy protocols ensure your sessions remain confidential and professionally secure.',
      stats: '99.9% Uptime'
    }
  ];

  return (
    <>
      <style >{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        .animate-in {
          animation: slideInUp 0.8s ease-out forwards;
        }
        
        .animate-delayed {
          opacity: 0;
          transform: translateY(30px);
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .card-hover-effect {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .card-hover-effect:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px  ;
        }
        
        .stats-counter {
          counter-reset: stats;
          animation: countUp 2s ease-out;
        }
        
        @keyframes countUp {
          from { counter-increment: stats 0; }
          to { counter-increment: stats var(--count); }
        }
      `}</style>

      <section 
        ref={sectionRef}
        className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          ...themeStyles
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-5 float-animation"
            style={{
              background: 'linear-gradient(45deg, #482EF4, #5FF4C2)',
              animationDelay: '0s'
            }}
          ></div>
          <div 
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-5 float-animation"
            style={{
              background: 'linear-gradient(135deg, #5FF4C2, #482EF4)',
              animationDelay: '2s'
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Enhanced Section Header */}
          <div className="text-center mb-20">
            <div 
              id="header"
              data-animate
              className={`${visibleElements.has('header') ? 'animate-in' : 'animate-delayed'}`}
            >
              <span className="inline-block text-sm font-semibold tracking-wider uppercase mb-4 opacity-80">
                Discover Excellence
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase tracking-tight mb-6">
                About{' '}
                <span style={gradientTextStyle}>
                  Mentor Hub
                </span>
              </h2>
              <div 
                className="w-32 h-1 mx-auto rounded-full mb-8"
                style={{
                  background: 'linear-gradient(45deg, #482EF4, #5FF4C2)'
                }}
              ></div>
              <p className="text-xl sm:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90 font-light">
                Transforming careers through expert-guided interview mastery
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div 
            id="stats"
            data-animate
            className={`grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24 ${visibleElements.has('stats') ? 'animate-in' : 'animate-delayed'}`}
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center group cursor-pointer"
                style={{ animationDelay: stat.delay }}
              >
                <div 
                  className="relative inline-block p-6 rounded-2xl backdrop-blur-sm border transition-all duration-500 group-hover:scale-110"
                  style={cardStyles}
                >
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(45deg, rgba(72, 46, 244, 0.1), rgba(95, 244, 194, 0.1))'
                    }}
                  ></div>
                  <div className="relative">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2" style={gradientTextStyle}>
                      {stat.number}
                    </div>
                    <div className="text-sm sm:text-base opacity-80 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
            {/* Enhanced Text Content */}
            <div 
              id="content"
              data-animate
              className={`space-y-8 ${visibleElements.has('content') ? 'animate-in' : 'animate-delayed'}`}
            >
              <div className="space-y-6">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Connecting Talent with{' '}
                  <span style={gradientTextStyle}>Excellence</span>
                </h3>
                <div 
                  className="w-20 h-1 rounded-full"
                  style={{ background: 'linear-gradient(45deg, #482EF4, #5FF4C2)' }}
                ></div>
              </div>
              
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="opacity-90">
                  Mentor Hub revolutionizes professional development by creating meaningful connections between ambitious job seekers and industry-leading interview experts. Our platform transcends traditional coaching boundaries.
                </p>
                <p className="opacity-80">
                  Through cutting-edge technology and personalized methodologies, we deliver transformative interview experiences that prepare you for career-defining moments with confidence and precision.
                </p>
              </div>

              <div 
                className="inline-flex items-center space-x-3 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 cursor-pointer group"
                style={cardStyles}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ background: 'linear-gradient(45deg, #482EF4, #5FF4C2)' }}
                ></div>
                <span className="font-semibold">Trusted by 10,000+ professionals worldwide</span>
              </div>
            </div>

            {/* Interactive Visual Element */}
            <div 
              id="visual"
              data-animate
              className={`relative ${visibleElements.has('visual') ? 'animate-in' : 'animate-delayed'}`}
            >
              <div 
                className="relative p-8 lg:p-12 rounded-3xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 group cursor-pointer"
                style={cardStyles}
                onMouseEnter={() => setHoveredCard('main')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${hoveredCard === 'main' ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(72, 46, 244, 0.1), rgba(95, 244, 194, 0.1))'
                  }}
                ></div>
                
                <div className="relative text-center space-y-8">
                  <div 
                    className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500"
                    style={{
                      background: 'linear-gradient(135deg, #482EF4, #5FF4C2)'
                    }}
                  >
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <div 
                      className="absolute inset-0 rounded-2xl border-4 border-white opacity-50"
                      style={{ animation: 'pulse-ring 2s infinite' }}
                    ></div>
                  </div>
                  
                  <div>
                    <h4 className="text-2xl lg:text-3xl font-bold mb-4">Professional Excellence</h4>
                    <p className="opacity-80 leading-relaxed">
                      Experience personalized coaching that adapts to your industry, role, and career aspirations with real-time feedback and actionable insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                id={feature.id}
                data-animate
                className={`card-hover-effect p-8 rounded-2xl border backdrop-blur-sm group cursor-pointer relative overflow-hidden ${visibleElements.has(feature.id) ? 'animate-in' : 'animate-delayed'}`}
                style={{ 
                  ...cardStyles,
                  animationDelay: `${index * 200}ms`
                }}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  className={`absolute inset-0 transition-opacity duration-500 ${hoveredCard === feature.id ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(72, 46, 244, 0.05), rgba(95, 244, 194, 0.05))'
                  }}
                ></div>
                
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #482EF4, #5FF4C2)'
                    }}
                  >
                    {feature.icon}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl lg:text-2xl font-bold">{feature.title}</h3>
                      <span 
                        className="text-xs font-semibold px-3 py-1 rounded-full border"
                        style={{
                          color: '#5FF4C2',
                          borderColor: '#5FF4C2'
                        }}
                      >
                        {feature.stats}
                      </span>
                    </div>
                    
                    <p className="opacity-80 leading-relaxed text-sm lg:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MentorHubAbout;