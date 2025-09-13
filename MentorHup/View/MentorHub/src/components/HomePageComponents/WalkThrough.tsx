import React, { useState } from 'react';
import { FiPlay, FiUsers, FiSearch, FiFilter, FiBriefcase, FiStar, FiMoreHorizontal, FiDownload } from 'react-icons/fi';
import { useTheme } from "../../Context/ThemeContext";

interface WalkthroughCardProps {
  videoUrl?: string | null;
}

interface PlatformWalkthroughProps {
  
  videoUrl?: string | null;
}



const WalkthroughCard: React.FC<WalkthroughCardProps> = ({  videoUrl = null }) => {
  const { isDark } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoUrl) {
      setIsLoading(true);
      setShowVideo(true);
      setIsPlaying(true);
      setIsLoading(false);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowVideo(false);
  };

  const handleCloseVideo = () => {
    setIsPlaying(false);
    setShowVideo(false);
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setShowVideo(false);
    setIsPlaying(false);
  };

  return (
    <div className={`
      relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl
      transition-all duration-500 hover:shadow-3xl
      ${isDark ? 'bg-[#1b2a30]' : 'bg-[#1b2a30]'}
    `}>
      <div className={`
        flex items-center justify-between p-4 border-b
        ${isDark ? 'border-gray-700 bg-[#1b2a30]' : 'border-gray-200 bg-white'}
      `}>
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            MentorHub Platform
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${isDark ? 'bg-[#00a896] text-white hover:bg-[#27b467]' : 'bg-[#00a896] text-white hover:bg-[#27b467]'}
          `}>
            Sign Up
          </button>
        </div>
      </div>

      <div className={`
        p-3 md:p-6 min-h-[300px] md:min-h-[400px] relative
        ${isDark ? 'bg-[#1b2a30]' : 'bg-white'}
      `}>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/4 mb-4 lg:mb-0 lg:space-y-3">
            <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              <div className={`flex items-center space-x-3 p-3 rounded-lg flex-shrink-0 ${isDark ? 'bg-[#06171c] text-white' : 'bg-gray-50 text-gray-700'}`}>
                <FiUsers className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">Mentors</span>
              </div>
              <div className={`flex items-center space-x-3 p-3 rounded-lg flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <FiBriefcase className="w-5 h-5" />
                <span className="text-sm whitespace-nowrap">Programs</span>
              </div>
              <div className={`flex items-center space-x-3 p-3 rounded-lg flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <FiStar className="w-5 h-5" />
                <span className="text-sm whitespace-nowrap">Reviews</span>
              </div>
            </div>
          </div>

          <div className="flex-1 lg:ml-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                <div className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg border w-full sm:w-auto
                  ${isDark ? 'border-gray-600 bg-[#06171c] text-white' : 'border-gray-300 bg-white text-gray-700'}
                `}>
                  <FiSearch className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Search mentors...</span>
                </div>
                <button className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg w-full sm:w-auto justify-center sm:justify-start
                  ${isDark ? 'bg-[#06171c] text-white' : 'bg-gray-100 text-gray-700'}
                `}>
                  <FiFilter className="w-4 h-4" />
                  <span className="text-sm">Filter</span>
                </button>
              </div>
              <button className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg w-full md:w-auto justify-center md:justify-start
                ${isDark ? 'bg-[#00a896] text-white' : 'bg-[#00a896] text-white'}
              `}>
                <FiDownload className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className={`
                grid grid-cols-5 gap-2 md:gap-4 p-2 md:p-4 rounded-t-lg border-b text-xs md:text-sm font-medium min-w-[500px]
                ${isDark ? 'bg-[#06171c] border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}
              `}>
                <div>Name</div>
                <div>Expertise</div>
                <div>Rating</div>
                <div>Sessions</div>
                <div>Actions</div>
              </div>

              <div className="space-y-2 min-w-[500px]">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className={`
                    grid grid-cols-5 gap-2 md:gap-4 p-2 md:p-4 rounded-lg transition-colors
                    ${isDark ? 'bg-[#06171c] hover:bg-[#1b2a30] text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}
                    border ${isDark ? 'border-gray-600' : 'border-gray-200'}
                  `}>
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-[#00a896] to-[#56e39f] flex-shrink-0"></div>
                      <span className="text-xs md:text-sm font-medium truncate">Mentor {item}</span>
                    </div>
                    <div className="text-xs md:text-sm opacity-75 truncate">React Development</div>
                    <div className="flex items-center space-x-1">
                      <FiStar className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current flex-shrink-0" />
                      <span className="text-xs md:text-sm">4.{8 + item}</span>
                    </div>
                    <div className="text-xs md:text-sm">2{item} completed</div>
                    <div>
                      <button className="p-1 md:p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <FiMoreHorizontal className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showVideo && videoUrl && (
          <div className="absolute inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 rounded-2xl">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-[#00a896] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white text-sm">Loading video...</p>
                  </div>
                </div>
              )}
              {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                <iframe
                  src={videoUrl}
                  className={`w-full h-full max-w-4xl max-h-[80vh] rounded-lg shadow-2xl transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={handleVideoLoad}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className={`w-full h-full max-w-4xl max-h-[80vh] rounded-lg shadow-2xl transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  controls
                  autoPlay
                  onLoadedData={handleVideoLoad}
                  onError={handleVideoError}
                  onEnded={handleVideoEnd}
                />
              )}
              <button
                onClick={handleCloseVideo}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black bg-opacity-70 text-white hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center text-lg font-bold z-10"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <button
              onClick={handlePlayClick}
              disabled={!videoUrl || isLoading}
              className={`
                w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 transform
                ${isPlaying && showVideo ? 'scale-110 opacity-80' : 'scale-100 opacity-90'}
                ${!videoUrl ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-500'}
                shadow-2xl hover:shadow-3xl mb-4
                ${videoUrl ? '' : 'bg-gray-500'}
              `}
            >
              {isLoading ? (
                <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiPlay className={`w-6 h-6 md:w-8 md:h-8 text-white ml-1 transition-transform duration-300 ${isPlaying && showVideo ? 'scale-125' : 'scale-100'}`} />
              )}
            </button>
            
            <div className="space-y-2">
              {videoUrl ? (
                <p className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Click to play video
                </p>
              ) : (
                <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No video URL provided
                </p>
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-[#00a896] border-t-transparent rounded-full animate-spin opacity-20"></div>
          </div>
        )}
      </div>

      <div className={`
        p-4 text-center text-xs md:text-sm
        ${isDark ? 'bg-[#06171c] text-gray-400' : 'bg-gray-50 text-gray-600'}
      `}>
        3-minute overview of the complete platform
      </div>
    </div>
  );
};

const PlatformWalkthrough: React.FC<PlatformWalkthroughProps> = ({  videoUrl = null }) => {
  const { isDark } = useTheme();
  return (
    <div 
      className={`
        min-h-screen py-8 md:py-16 px-4 transition-all duration-500
        ${isDark ? '!bg-[#06171c]' : 'bg-[#96fbf1]'}
      `}
      style={isDark ? { 
        backgroundColor: 'rgba(6, 23, 28, 0.8)'
      } : {}}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h1 className={`
            text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 transition-colors duration-500
            ${isDark ? 'text-white' : 'text-[#06171c]'}
          `}>
            Platform Walkthrough
          </h1>
          <p className={`
            text-base md:text-lg lg:text-xl max-w-2xl mx-auto transition-colors duration-500 px-4
            ${isDark ? 'text-gray-300' : 'text-[#06171c]'}
          `}>
            Take a guided tour through our intuitive interface and see how MentorHub transforms your hiring process
          </p>
        </div>

        <div className="mb-8 md:mb-16">
          <WalkthroughCard 
            
            videoUrl={videoUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default PlatformWalkthrough;