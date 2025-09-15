import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Users, Calendar, Shield, DollarSign, Award } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";




interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How does MentorHub connect me with the right interview trainer?",
    answer: "Our intelligent matching system analyzes your industry, experience level, target roles, and specific needs to connect you with qualified trainers who specialize in your field. You can browse trainer profiles, read reviews, and select the one that best fits your requirements.",
    icon: <Users className="w-5 h-5" />,
    category: "Getting Started"
  },
  {
    id: 2,
    question: "What happens during a mock interview session?",
    answer: "Each session is conducted via secure video call and typically lasts 45-60 minutes. Your trainer will conduct a realistic interview based on your target role, provide real-time feedback, help you improve your responses, and offer personalized strategies to boost your confidence and performance.",
    icon: <Calendar className="w-5 h-5" />,
    category: "Sessions"
  },
  {
    id: 3,
    question: "How do I book and schedule my interview training sessions?",
    answer: "Simply browse available trainers, select your preferred one, choose from their available time slots, and book instantly. You can schedule sessions up to 2 weeks in advance and reschedule with at least 24 hours notice.",
    icon: <Calendar className="w-5 h-5" />,
    category: "Booking"
  },
  {
    id: 4,
    question: "Is my personal information and session data secure?",
    answer: "Absolutely. We use enterprise-grade encryption for all communications and data storage. Your personal information, session recordings (if enabled), and payment details are protected with bank-level security protocols. We never share your data with third parties.",
    icon: <Shield className="w-5 h-5" />,
    category: "Security"
  },
  {
    id: 5,
    question: "What are the pricing options for interview training?",
    answer: "We offer flexible pricing starting from $49 for a single session. Package deals include 3 sessions for $129 or 5 sessions for $199. Premium trainers may have different rates based on their expertise and industry specialization.",
    icon: <DollarSign className="w-5 h-5" />,
    category: "Pricing"
  },
  {
    id: 6,
    question: "What qualifications do your interview trainers have?",
    answer: "All our trainers are verified professionals with extensive industry experience. They include HR managers, senior executives, recruiting specialists, and career coaches with proven track records. Each trainer undergoes a rigorous vetting process and maintains high rating scores.",
    icon: <Award className="w-5 h-5" />,
    category: "Trainers"
  },
  {
    id: 7,
    question: "Can I get a refund if I'm not satisfied with my session?",
    answer: "Yes, we offer a satisfaction guarantee. If you're not completely satisfied with your first session, we'll provide a full refund within 48 hours. For subsequent sessions, we'll work with you to address any concerns or provide alternative solutions.",
    icon: <HelpCircle className="w-5 h-5" />,
    category: "Support"
  },
  {
    id: 8,
    question: "Do you offer training for specific industries or roles?",
    answer: "Yes! Our trainers specialize in various industries including tech, finance, healthcare, marketing, consulting, and more. Whether you're applying for entry-level positions or executive roles, we have experienced trainers who understand your specific field's interview requirements.",
    icon: <Users className="w-5 h-5" />,
    category: "Specialization"
  }
];

interface FAQItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  isDark: boolean;
}

const FAQItemComponent: React.FC<FAQItemProps> = ({ item, isOpen, onToggle, isDark }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const cardBgClass = isDark ? "border-gray-600" : "border-gray-200";
  const textClass = isDark ? "text-gray-200" : "text-gray-800";

  return (
    <div 
      className={`${cardBgClass} rounded-2xl border-2 shadow-lg backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group ${
        isOpen ? 'ring-2 ring-cyan-400 ring-opacity-50' : ''
      }`}
      style={{
        backgroundColor: isDark ? "#06171c" : "#96FBF1",
        backgroundImage: isOpen 
          ? `linear-gradient(135deg, ${isDark ? 'rgba(150, 251, 241, 0.05)' : 'rgba(255, 255, 255, 0.3)'} 0%, transparent 100%)`
          : 'none'
      }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left focus:outline-none rounded-2xl transition-all duration-200 relative overflow-hidden"
        aria-expanded={isOpen}
      >
        {/* Gradient overlay for hover effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          style={{
            background: `linear-gradient(45deg, ${isDark ? 'rgba(150, 251, 241, 0.03)' : 'rgba(10, 20, 25, 0.03)'} 0%, transparent 100%)`
          }}
        />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Icon with animated background */}
              <div 
                className={`relative p-3 rounded-xl transition-all duration-500 group-hover:scale-110 ${
                  isOpen ? 'scale-110 rotate-12' : ''
                }`}
                style={{
                  backgroundColor: isDark ? "rgba(150, 251, 241, 0.1)" : "rgba(255, 255, 255, 0.8)",
                  border: `2px solid ${isDark ? 'rgba(150, 251, 241, 0.2)' : 'rgba(10, 20, 25, 0.1)'}`,
                  boxShadow: isOpen ? (isDark ? '0 0 20px rgba(150, 251, 241, 0.2)' : '0 0 20px rgba(10, 20, 25, 0.1)') : 'none'
                }}
              >
                <div style={{ color: isDark ? "#96FBF1" : "#0a1419" }}>
                  {item.icon}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                    isOpen ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: isDark ? "rgba(150, 251, 241, 0.15)" : "rgba(255, 255, 255, 0.9)",
                    color: isDark ? "#96FBF1" : "#0a1419",
                    border: `1px solid ${isDark ? 'rgba(150, 251, 241, 0.3)' : 'rgba(10, 20, 25, 0.2)'}`
                  }}>
                    {item.category}
                  </span>
                </div>
                <h3 className={`font-bold text-lg leading-tight transition-all duration-300 group-hover:translate-x-1 ${textClass}`}>
                  {item.question}
                </h3>
              </div>
            </div>
            
            {/* Animated chevron with circular background */}
            <div 
              className={`relative p-3 rounded-full transition-all duration-500 group-hover:scale-110 ${
                isOpen ? 'rotate-180 bg-opacity-100' : 'bg-opacity-70'
              }`}
              style={{
                backgroundColor: isDark ? "rgba(150, 251, 241, 0.1)" : "rgba(255, 255, 255, 0.8)",
                border: `2px solid ${isDark ? 'rgba(150, 251, 241, 0.2)' : 'rgba(10, 20, 25, 0.1)'}`,
              }}
            >
              <ChevronDown 
                className="w-5 h-5 transition-all duration-300" 
                style={{ color: isDark ? "#96FBF1" : "#0a1419" }}
              />
            </div>
          </div>
        </div>
      </button>
      
      {/* Answer section with enhanced styling */}
      <div
        style={{ height: `${height}px` }}
        className="overflow-hidden transition-all duration-700 ease-out"
      >
        <div ref={contentRef}>
          <div className="px-6 pb-6">
            <div 
              className="ml-16 p-5 rounded-xl border-l-4 transition-all duration-500"
              style={{
                backgroundColor: isDark ? "rgba(150, 251, 241, 0.05)" : "rgba(255, 255, 255, 0.6)",
                borderLeftColor: isDark ? "#96FBF1" : "#0a1419",
                borderColor: isDark ? "rgba(150, 251, 241, 0.2)" : "rgba(10, 20, 25, 0.1)"
              }}
            >
              <p className={`text-base leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const { isDark } = useTheme();
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([1])); // First item open by default
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const textClass = isDark ? "text-gray-200" : "text-gray-800";

  const toggleItem = (id: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setOpenItems(new Set(faqData.map(item => item.id)));
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.getAttribute('data-faq-id') || '0');
            setVisibleItems(prev => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll('[data-faq-id]');
    items.forEach(item => {
      if (observerRef.current) {
        observerRef.current.observe(item);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <section
      className={`py-16 transition-colors duration-300 ${
        isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--primary-green-light)]"
      }`}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div 
              className="relative p-6 rounded-2xl shadow-lg"
              style={{
                backgroundColor: isDark ? "#06171c" : "#96FBF1",
                border: `3px solid ${isDark ? 'rgba(150, 251, 241, 0.3)' : 'rgba(255, 255, 255, 0.8)'}`,
                boxShadow: isDark 
                  ? '0 0 30px rgba(150, 251, 241, 0.2), inset 0 0 30px rgba(150, 251, 241, 0.1)' 
                  : '0 10px 30px rgba(10, 20, 25, 0.1), inset 0 0 30px rgba(255, 255, 255, 0.5)'
              }}
            >
              <div className="absolute inset-0 rounded-2xl animate-pulse"
                style={{
                  background: `conic-gradient(from 0deg, transparent, ${isDark ? 'rgba(150, 251, 241, 0.1)' : 'rgba(10, 20, 25, 0.05)'}, transparent)`,
                }}
              />
              <HelpCircle 
                className="w-12 h-12 relative z-10" 
                style={{ color: isDark ? "#96FBF1" : "#0a1419" }}
              />
            </div>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${textClass} leading-tight`}>
            Frequently Asked
            <span 
              className="block bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: isDark 
                  ? 'linear-gradient(45deg, #96FBF1, #67e8f9)' 
                  : 'linear-gradient(45deg, #0a1419, #164e63)'
              }}
            >
              Questions
            </span>
          </h2>
          <p className={`${
            isDark ? "text-gray-300" : "text-gray-600"
          } text-xl max-w-3xl mx-auto mb-10 leading-relaxed`}>
            Get answers to common questions about MentorHub's interview training platform
          </p>
          
          {/* Expand/Collapse Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={expandAll}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg transform`}
              style={{
                backgroundColor: isDark ? "rgba(150, 251, 241, 0.1)" : "rgba(255, 255, 255, 0.8)",
                color: isDark ? "#96FBF1" : "#0a1419",
                border: `2px solid ${isDark ? 'rgba(150, 251, 241, 0.3)' : 'rgba(10, 20, 25, 0.2)'}`,
              }}
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg transform`}
              style={{
                backgroundColor: isDark ? "rgba(150, 251, 241, 0.1)" : "rgba(255, 255, 255, 0.8)",
                color: isDark ? "#96FBF1" : "#0a1419",
                border: `2px solid ${isDark ? 'rgba(150, 251, 241, 0.3)' : 'rgba(10, 20, 25, 0.2)'}`,
              }}
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={item.id}
              data-faq-id={item.id}
              className={`transform transition-all duration-700 ${
                visibleItems.has(item.id)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <FAQItemComponent
                item={item}
                isOpen={openItems.has(item.id)}
                onToggle={() => toggleItem(item.id)}
                isDark={isDark}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div 
            className="rounded-2xl p-8 border-2 relative overflow-hidden group shadow-xl"
            style={{
              backgroundColor: isDark ? "#06171c" : "#96FBF1",
              borderColor: isDark ? "rgba(150, 251, 241, 0.3)" : "rgba(255, 255, 255, 0.8)",
              backgroundImage: `linear-gradient(135deg, ${isDark ? 'rgba(150, 251, 241, 0.05)' : 'rgba(255, 255, 255, 0.3)'} 0%, transparent 100%)`
            }}
          >
            {/* Animated background */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at center, ${isDark ? 'rgba(150, 251, 241, 0.1)' : 'rgba(10, 20, 25, 0.05)'} 0%, transparent 70%)`
              }}
            />
            
            <div className="relative z-10">
              <h3 className={`text-2xl font-bold mb-4 ${textClass}`}>
                Still have questions?
              </h3>
              <p className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}>
                Our support team is here to help you get started with your interview preparation journey.
              </p>
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl transform group-hover:animate-pulse"
                style={{
                  backgroundColor: isDark ? "#96FBF1" : "#0a1419",
                  color: isDark ? "#0a1419" : "#96FBF1",
                  boxShadow: isDark 
                    ? '0 10px 30px rgba(150, 251, 241, 0.3)' 
                    : '0 10px 30px rgba(10, 20, 25, 0.3)'
                }}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;