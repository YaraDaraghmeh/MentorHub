import { useState, useEffect, useRef } from "react";
import "./TestemotionalSection.css";
import { useTheme } from "../../Context/ThemeContext";

interface Testimonial {
  id: number;
  content: string;
  author: string;
  position: string;
  avatar: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content:
      "The mentorship program completely transformed my career trajectory. In just six months, I've gained skills that would have taken years to develop on my own.",
    author: "Sarah Johnson",
    position: "Software Engineer at Google",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5,
  },
  {
    id: 2,
    content:
      "Finding a mentor in my field was a game-changer. The personalized guidance helped me navigate complex industry challenges and opened doors I didn't know existed.",
    author: "Michael Chen",
    position: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/men/39.jpg",
    rating: 5,
  },
  {
    id: 3,
    content:
      "I was skeptical at first, but the structured approach to mentorship made all the difference. My mentor provided actionable feedback that directly improved my work.",
    author: "Priya Patel",
    position: "UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
  },
  {
    id: 4,
    content:
      "As someone transitioning careers, having an experienced mentor guide me through the process was invaluable. I'm now working in my dream role thanks to this program.",
    author: "James Wilson",
    position: "Data Scientist",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    id: 5,
    content:
      "The mentorship program exceeded my expectations. The matching process paired me with someone whose experience aligned perfectly with my goals.",
    author: "Emma Rodriguez",
    position: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 5,
  },
];

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  isActive,
}) => {
  const { isDark } = useTheme();
  const cardBgClass = isDark ? "border-gray-600" : "border-gray-200";

  const textClass = isDark ? "text-gray-200" : "text-gray-800";

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-2xl ${
          i < rating ? "text-yellow-400" : "text-gray-400"
        }`}
      >
        {i < rating ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <div
      className={`${cardBgClass} rounded-xl p-6 md:p-8 shadow-lg border transition-all duration-500 ${
        isActive ? "opacity-100 scale-100" : "opacity-40 scale-90"
      }`}
      style={{
        backgroundColor: isDark ? "#06171c" : "#96FBF1",
      }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-6 flex justify-start">
          {renderStars(testimonial.rating)}
        </div>

        <p className={`${textClass} text-lg mb-6 flex-grow italic`}>
          "{testimonial.content}"
        </p>

        <div className="flex items-center">
          <img
            src={testimonial.avatar}
            alt={testimonial.author}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className={`${textClass} font-bold`}>{testimonial.author}</h4>
            <p
              className={`${
                isDark ? "text-gray-400" : "text-gray-600"
              } text-sm`}
            >
              {testimonial.position}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const { isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const textClass = isDark ? "text-gray-200" : "text-gray-800";

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeIndex]);

  const handleMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  return (
    <section
      className={`py-16 transition-colors duration-300 ${
        isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--primary-green-light)]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textClass}`}>
            What Our Members Say
          </h2>
          <p
            className={`${
              isDark ? "text-gray-300" : "text-gray-600"
            } text-lg max-w-3xl mx-auto`}
          >
            Success stories from professionals who've transformed their careers
            through MentorHub
          </p>
        </div>

        <div className="hidden md:block relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-all duration-500"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 flex justify-center"
                >
                  <div
                    className="w-full max-w-2xl transition-all duration-500"
                    style={{
                      opacity: index === activeIndex ? 1 : 0.7,
                      scale: index === activeIndex ? 1 : 0.95,
                    }}
                  >
                    <TestimonialCard
                      testimonial={testimonial}
                      isActive={index === activeIndex}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prev / Next buttons */}
          <button
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-6 md:-translate-x-12 flex items-center justify-center w-10 h-10 rounded-full shadow-lg text-2xl z-10 transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: isDark ? "#1a2332" : "#ffffff",
              color: isDark ? "#ffffff" : "#0a1419",
            }}
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <span className="text-xl">‹</span>
          </button>

          <button
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-6 md:translate-x-12 flex items-center justify-center w-10 h-10 rounded-full shadow-lg text-2xl z-10 transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: isDark ? "#1a2332" : "#ffffff",
              color: isDark ? "#ffffff" : "#0a1419",
            }}
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <span className="text-xl">›</span>
          </button>
        </div>

        <div className="md:hidden">
          <TestimonialCard
            testimonial={testimonials[activeIndex]}
            isActive={true}
          />
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className="w-3 h-3 rounded-full transition-all duration-300 hover:scale-125"
              style={{
                backgroundColor:
                  index === activeIndex
                    ? isDark
                      ? "#ffffff"
                      : "#0a1419"
                    : isDark
                    ? "#4a5568"
                    : "#ffffff",
              }}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
