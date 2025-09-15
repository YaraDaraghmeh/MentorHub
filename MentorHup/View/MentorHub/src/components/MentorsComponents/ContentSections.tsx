import React from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Target, Star, TrendingUp } from "lucide-react";
import type { Testimonial } from "../../types/types";
import { useTheme } from "../../Context/ThemeContext";

const ContentSections: React.FC = () => {
  const { isDark } = useTheme();
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Alex Rivera",
      role: "Software Engineer at Amazon",
      content:
        "Sarah's technical interview coaching was incredible. She helped me crack the system design round that I was struggling with for months.",
      rating: 5,
      avatar: "AR",
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Product Manager at Uber",
      content:
        "Michael's insights into product case studies were game-changing. I landed my dream PM role thanks to his guidance.",
      rating: 5,
      avatar: "PP",
    },
    {
      id: 3,
      name: "Jordan Lee",
      role: "UX Designer at Airbnb",
      content:
        "Emily helped me restructure my portfolio and ace the design challenge. Her feedback was spot-on and actionable.",
      rating: 5,
      avatar: "JL",
    },
  ];

  return (
    <>
      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`py-16 ${
          isDark ? "bg-[var(--primary-rgba)]" : "bg-[#96fbf1]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-600"
              } max-w-2xl mx-auto`}
            >
              Get interview-ready in three simple steps with our expert mentors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                1. Find Your Mentor
              </h3>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Browse through our curated list of expert mentors from top
                companies and find the perfect match for your needs.
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Book a Session</h3>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Schedule a personalized mock interview session at your
                convenience. Choose from various interview types and difficulty
                levels.
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                3. Ace Your Interview
              </h3>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Get detailed feedback, practice with real interview scenarios,
                and build confidence to land your dream job.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`py-16 ${
          isDark ? "bg-[var(--primary-rgba)]" : "bg-[#96fbf1]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-600"
              } max-w-2xl mx-auto`}
            >
              Hear from professionals who landed their dream jobs with our
              mentors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                whileHover={{ scale: 1.05 }}
                className={`rounded-2xl p-6 ${
                  isDark ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p
                  className={`mb-6 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`py-16 ${
          isDark ? "bg-[var(--primary-rgba)]" : "bg-[#96fbf1]"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl lg:text-4xl font-bold mb-6 ${
              isDark ? "text-white" : "text-[var(--primary)]"
            }`}
          >
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-[#27B467] mb-8">
            Join thousands of professionals who have successfully aced their
            interviews with our expert mentors
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#071b21] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center"
            >
              Start Your Journey
              <TrendingUp className="ml-2 h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Learn More
            </motion.button>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default ContentSections;
