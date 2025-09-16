import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../Context/ThemeContext";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const MentorHubTeam: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { isDark } = useTheme();
  const teamMembers: TeamMember[] = [
    {
      name: "Sarah Ahmed",
      role: "Team Lead & Career Coach",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsJTIwcGVvcGxlfGVufDB8fDB8fHww",
    },
    {
      name: "Yara Daraghmeh",
      role: "Frontend Queen",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmVzc2lvbmFsJTIwcGVvcGxlfGVufDB8fDB8fHww",
    },
    {
      name: "Khaled Mazen",
      role: "Backend Engineer",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Amjad",
      role: "Backend Engineer",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Lisa Anderson",
      role: "Industry Relations",
      image:
        "https://images.unsplash.com/photo-1655249481446-25d575f1c054?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHByb2Zlc3Npb25hbCUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "James Wilson",
      role: "Technology Director",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const updateCarousel = useCallback(
    (newIndex: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex((newIndex + teamMembers.length) % teamMembers.length);

      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    },
    [isAnimating, teamMembers.length]
  );

  const getCardPosition = (cardIndex: number) => {
    const offset =
      (cardIndex - currentIndex + teamMembers.length) % teamMembers.length;

    if (offset === 0) return "center";
    if (offset === 1) return "right-1";
    if (offset === 2) return "right-2";
    if (offset === teamMembers.length - 1) return "left-1";
    if (offset === teamMembers.length - 2) return "left-2";
    return "hidden";
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) updateCarousel(currentIndex + 1);
    if (isRightSwipe) updateCarousel(currentIndex - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") updateCarousel(currentIndex - 1);
      if (e.key === "ArrowRight") updateCarousel(currentIndex + 1);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, updateCarousel]);

  const themeStyles = {
    backgroundColor: isDark ? "var(--primary-rgba)" : "#96fbf1",
    color: isDark ? "#ffffff" : "#071b21",
  };

  const cardStyle = {
    background: "#ffffff",
    boxShadow: isDark
      ? "0 10px 40px rgba(150, 251, 241, 0.3)"
      : "0 20px 40px rgba(6, 23, 28, 0.3)",
  };

  const accentColor = isDark ? "#96fbf1" : "#071b21";
  const gradientAccent = "linear-gradient(135deg, #482EF4, #5FF4C2)";

  return (
    <div className="w-full">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .carousel-container {
          perspective: 1000px;
        }
        
        .carousel-track {
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .team-card {
          position: absolute;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
          border-radius: 20px;
          overflow: hidden;
        }
        
        .team-card img {
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
        
        .team-card.center {
          z-index: 10;
          transform: scale(1.1) translateZ(0);
        }
        
        .team-card.center img {
          filter: none;
        }
        
        .team-card.left-1 {
          z-index: 5;
          transform: translateX(-200px) scale(0.9) translateZ(-100px);
          opacity: 0.9;
        }
        
        .team-card.left-1 img {
          filter: grayscale(100%);
        }
        
        .team-card.left-2 {
          z-index: 1;
          transform: translateX(-400px) scale(0.8) translateZ(-300px);
          opacity: 0.7;
        }
        
        .team-card.left-2 img {
          filter: grayscale(100%);
        }
        
        .team-card.right-1 {
          z-index: 5;
          transform: translateX(200px) scale(0.9) translateZ(-100px);
          opacity: 0.9;
        }
        
        .team-card.right-1 img {
          filter: grayscale(100%);
        }
        
        .team-card.right-2 {
          z-index: 1;
          transform: translateX(400px) scale(0.8) translateZ(-300px);
          opacity: 0.7;
        }
        
        .team-card.right-2 img {
          filter: grayscale(100%);
        }
        
        .team-card.hidden {
          opacity: 0;
          pointer-events: none;
          transform: scale(0.5) translateZ(-500px);
        }
        
        .member-info {
          animation: fadeInUp 0.6s ease-out;
          z-index: 20;
          position: relative;
        }
        
        .member-name {
          position: relative;
          display: inline-block;
        }
        
        .member-name::before,
        .member-name::after {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 2px;
          background: ${accentColor};
          transition: all 0.3s ease;
        }
        
        .member-name::before {
          left: -80px;
        }
        
        .member-name::after {
          right: -80px;
        }

        .title-text {
          color: ${isDark ? "#96fbf1" : "rgba(7, 27, 33, 0.6)"} !important;
        }
        
        @media (max-width: 768px) {
          .team-card.left-1 {
            transform: translateX(-120px) scale(0.9) translateZ(-100px);
          }
          
          .team-card.left-2 {
            transform: translateX(-250px) scale(0.8) translateZ(-300px);
          }
          
          .team-card.right-1 {
            transform: translateX(120px) scale(0.9) translateZ(-100px);
          }
          
          .team-card.right-2 {
            transform: translateX(250px) scale(0.8) translateZ(-300px);
          }
          
          .member-name::before,
          .member-name::after {
            width: 30px;
          }
          
          .member-name::before {
            left: -50px;
          }
          
          .member-name::after {
            right: -50px;
          }
        }
        
        @media (max-width: 480px) {
          .member-name::before,
          .member-name::after {
            display: none;
          }
        }
      `}</style>

      <section
        className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex flex-col justify-center items-center"
        style={{
          fontFamily: "Montserrat, sans-serif",
          ...themeStyles,
        }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-5"
            style={{
              background: gradientAccent,
              animation: "float 6s ease-in-out infinite",
            }}
          ></div>
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-5"
            style={{
              background: gradientAccent,
              animation: "float 6s ease-in-out infinite",
              animationDelay: "3s",
            }}
          ></div>
        </div>

        {/* Title */}
        <h1
          className="title-text text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight absolute top-12 left-1/2 transform -translate-x-1/2 pointer-events-none whitespace-nowrap"
          style={{
            fontFamily: "Arial Black, Arial Bold, Arial, sans-serif",
          }}
        >
          OUR TEAM
        </h1>

        {/* Carousel Container */}
        <div className="carousel-container w-full max-w-6xl h-96 lg:h-[450px] relative mt-20">
          {/* Left Arrow */}
          <button
            className="absolute top-1/2 left-4 lg:left-8 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold z-20 transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: `${accentColor}99`,
              paddingRight: "3px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? "rgba(0, 0, 0, 0.8)"
                : "rgba(7, 27, 33, 0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${accentColor}99`;
            }}
            onClick={() => updateCarousel(currentIndex - 1)}
          >
            ‹
          </button>

          {/* Carousel Track */}
          <div
            className="carousel-track w-full h-full flex justify-center items-center relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {teamMembers.map((member, index) => (
              <div
                key={`${member.name}-${index}`}
                className={`team-card w-64 lg:w-80 h-80 lg:h-96 ${getCardPosition(
                  index
                )}`}
                style={cardStyle}
                onClick={() => updateCarousel(index)}
              >
                <img
                  src={member.image}
                  alt={`${member.name} - ${member.role}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            className="absolute top-1/2 right-4 lg:right-8 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold z-20 transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: `${accentColor}99`,
              paddingLeft: "3px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? "rgba(0, 0, 0, 0.8)"
                : "rgba(7, 27, 33, 0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${accentColor}99`;
            }}
            onClick={() => updateCarousel(currentIndex + 1)}
          >
            ›
          </button>
        </div>

        {/* Member Info - Fixed and Always Visible */}
        <div className="member-info text-center mt-12 lg:mt-16 relative z-30">
          <h2
            key={`name-${currentIndex}`}
            className="member-name text-4xl lg:text-5xl font-bold mb-3 relative inline-block"
            style={{ color: accentColor }}
          >
            {teamMembers[currentIndex].name}
          </h2>
          <p
            key={`role-${currentIndex}`}
            className="member-role text-lg lg:text-xl font-medium opacity-80 uppercase tracking-wider"
            style={{
              color: isDark ? "#848696" : "#4a5568",
              marginTop: "8px",
            }}
          >
            {teamMembers[currentIndex].role}
          </p>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12 lg:mt-16 relative z-30">
          {teamMembers.map((_, index) => (
            <button
              key={`dot-${index}`}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "scale-125" : "hover:scale-110"
              }`}
              style={{
                backgroundColor:
                  index === currentIndex ? accentColor : `${accentColor}33`,
              }}
              onClick={() => updateCarousel(index)}
              aria-label={`Go to team member ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
export default MentorHubTeam;
