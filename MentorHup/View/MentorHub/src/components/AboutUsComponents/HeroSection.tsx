import React, { useRef, useEffect } from 'react';

interface MentorHubHeroProps {
  isDark?: boolean;
}

const MentorHubHero: React.FC<MentorHubHeroProps> = ({ isDark = true }) => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);

      hero.style.setProperty('--x', `${x}%`);
      hero.style.setProperty('--y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const themeStyles = {
    backgroundColor: isDark ? '#06171c' : '#96fbf1',
    color: isDark ? '#ffffff' : '#071b21'
  };

  const secondaryHeroStyles = {
    background: isDark 
      ? 'linear-gradient(45deg, #482EF4, #5FF4C2, #ffffff)'
      : 'linear-gradient(45deg, #071b21, #1b2a30, #6b7280)',
    color: isDark ? 'rgb(9, 14, 23)' : '#ffffff'
  };

  return (
    <div 
      className="h-96 md:h-[500px] lg:h-[600px] relative font-bold"
      style={{
        fontFamily: 'Montserrat, sans-serif',
        ...themeStyles
      }}
    >
      <div className="relative">
        {/* Main hero */}
        <div className="h-96 md:h-[500px] lg:h-[600px] p-4 sm:p-8 lg:p-20 flex items-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl uppercase m-0 max-w-fit mx-auto font-bold tracking-tight">
            Mentor Hub
          </h1>
        </div>

        
        <div
          ref={heroRef}
          className="absolute top-0 left-0 w-full h-full p-4 sm:p-8 lg:p-20 flex items-center transition-all duration-300 ease-out"
          style={{
            ...secondaryHeroStyles,
            WebkitMaskImage: 'radial-gradient(circle at var(--x, 70%) var(--y, 50%), black 25%, transparent 0)',
            maskImage: 'radial-gradient(circle at var(--x, 70%) var(--y, 50%), black 25%, transparent 0)',
            '--x': '70%',
            '--y': '50%'
          } as React.CSSProperties}
          aria-hidden="true"
        >
          <p className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl uppercase m-0 max-w-fit mx-auto font-bold tracking-tight">
            Mock Your Interview
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorHubHero;