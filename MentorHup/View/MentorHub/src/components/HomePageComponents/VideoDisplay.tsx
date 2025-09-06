import React from 'react';

interface VideoDisplayProps {
  title?: string;
  subtitle?: string;
  isDark?: boolean;
  delay?: number;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ 
  title, 
  subtitle, 
  isDark = false,
  delay = 0 
}) => {
  return (
    <div 
      className={`${isDark ? '!bg-[#2C313A]' : '!bg-[#1B2A30]'} rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] lg:min-h-[220px] relative overflow-hidden transition-all duration-500 hover:scale-105 shadow-lg transform`}
      style={{ 
        animationDelay: `${delay * 200}ms`,
        animationDuration: '1s',
        animationFillMode: 'both',
        animationName: 'fadeInScale'
      }}
    >
      {/* Green indicator dot */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-green-400 rounded-full"></div>
      
      {/* Audio visualization bars */}
      <div className="flex items-end space-x-0.5 sm:space-x-1 mb-3 sm:mb-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`bg-green-400 rounded-sm transition-all duration-300 hover:bg-green-300`}
            style={{
              width: window.innerWidth >= 640 ? '4px' : '3px',
              height: `${Math.random() * (window.innerWidth >= 640 ? 40 : 30) + (window.innerWidth >= 640 ? 10 : 8)}px`,
              animationDelay: `${i * 100}ms`,
              animationDuration: `${800 + Math.random() * 400}ms`
            }}
          ></div>
        ))}
      </div>
      
      {title && (
        <div className="text-center px-2 opacity-0 animate-fade-in" style={{ animationDelay: `${delay * 200 + 500}ms`, animationFillMode: 'forwards' }}>
          <p className="text-white text-xs sm:text-sm font-medium leading-tight">{title}</p>
          {subtitle && <p className={`${isDark ? 'text-gray-300' : 'text-gray-400'} text-xs mt-1`}>{subtitle}</p>}
        </div>
      )}
      
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VideoDisplay;
