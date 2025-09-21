import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Users,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";
import type { Mentor } from "../../types/types";
import axios from "axios";
import urlMentor from "../../Utilities/Mentor/urlMentor";
import BookingModal from "./BookingModal";

interface MentorsGridProps {
  mentors: Mentor[];
  onBookSession: (mentor: Mentor) => void;
}

// const mockMentors: Mentor[] = Array.from({ length: 25 }, (_, i) => ({
//   id: `mentor-${i + 1}`,
//   name: `Mentor ${i + 1}`,
//   title: `Senior ${
//     ["Engineer", "Designer", "Manager", "Analyst", "Developer"][i % 5]
//   }`,
//   company: ["Google", "Microsoft", "Apple", "Amazon", "Meta"][i % 5],
//   avatar: ["JD", "SM", "AB", "CD", "EF"][i % 5],
//   rating: 4.0 + Math.random(),
//   reviews: Math.floor(Math.random() * 200) + 50,
//   experience: `${Math.floor(Math.random() * 10) + 3} years`,
//   totalSessions: Math.floor(Math.random() * 500) + 100,
//   hourlyRate: Math.floor(Math.random() * 100) + 50,
//   successRate: Math.floor(Math.random() * 20) + 80,
//   specialties: [
//     "React",
//     "Node.js",
//     "Python",
//     "System Design",
//     "Leadership",
//   ].slice(0, Math.floor(Math.random() * 3) + 2),
//   isOnline: Math.random() > 0.5,
// }));

const MentorsGrid = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [modalBook, setModalBook] = useState<{
    mentor: Mentor | null;
    show: boolean;
  }>({
    mentor: null,
    show: false,
  });
  const token = localStorage.getItem("accessToken");
  const { isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const getMentors = async () => {
      try {
        const data = await axios.get(urlMentor.GET_ALL_MENTORS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMentors(data.data.items);
      } catch (error: any) {
        console.log("Error mentor", error);
      }
    };

    getMentors();
  }, []);

  const onBookSession = (mentor: Mentor) => {
    setModalBook({ mentor, show: true });
  };

  // Calculate pagination
  const totalPages = Math.ceil(mentors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMentors = mentors.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of mentors section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const textClass = isDark ? "text-gray-200" : "text-gray-800";

  return (
    <>
      {/* Modal Booking */}
      <BookingModal
        isDark={isDark}
        mentor={modalBook.mentor}
        isOpen={modalBook.show}
        onClose={() => setModalBook((prev) => ({ ...prev, show: false }))}
      />
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results summary */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Showing {startIndex + 1}-{Math.min(endIndex, mentors.length)} of{" "}
                {mentors.length} mentors
              </p>
            </div>
            <div
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Page {currentPage} of {totalPages}
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={currentPage} // Re-trigger animation on page change
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {currentMentors.map((mentor) => (
              <motion.div
                key={mentor.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl border transition-all duration-300 hover:shadow-xl relative ${
                  isDark
                    ? "bg-gray-800 border-gray-700 hover:shadow-blue-500/10"
                    : "bg-white border-gray-200 hover:shadow-blue-500/20"
                }`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white`}
                      >
                        {mentor.imageLink}
                      </div>
                      <div>
                        <h3 className={`font-semibold text-lg ${textClass}`}>
                          {mentor.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {mentor.field}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "hover:bg-gray-700 text-gray-400"
                            : "hover:bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "hover:bg-gray-700 text-gray-400"
                            : "hover:bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="mb-4">
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {mentor.companyName}
                    </span>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span
                          className={`ml-1 text-sm font-medium ${textClass}`}
                        >
                          {mentor.reviewCount.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${textClass}`}>
                        {mentor.experience}
                      </div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Experience
                      </div>
                    </div>
                    {/* <div className="text-center">
                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Sessions
                    </div>
                  </div> */}
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${textClass}`}>
                        ${mentor.price}
                      </div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Per Hour
                      </div>
                    </div>
                  </div>

                  {/* Success Rate */}
                  {/* <div className="mb-4"> */}
                  {/* <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Success Rate
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {mentor.successRate}%
                    </span>
                  </div> */}
                  {/* <div
                    className={`w-full bg-gray-200 rounded-full h-2 ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${mentor.successRate}%` }}
                    ></div>
                  </div>
                </div> */}

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {mentor.skills.slice(0, 2).map((specialty, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isDark
                              ? "bg-blue-900 text-blue-300"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {specialty}
                        </span>
                      ))}
                      {mentor.skills.length > 2 && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isDark
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          +{mentor.skills.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onBookSession(mentor)}
                      className="flex-1 bg-gradient-to-r from-teal-950 to-teal-500 hover:from-teal-500 hover:to-teal-950 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200"
                    >
                      Book Session
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4 py-3 rounded-xl border font-medium transition-colors ${
                        isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      View Profile
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-2 rounded-lg border transition-all duration-200 ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-md"
                } ${
                  isDark
                    ? "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </motion.button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === "..." ? (
                      <span
                        className={`px-3 py-2 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        ...
                      </span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(page as number)}
                        className={`px-3 py-2 rounded-lg border transition-all duration-200 min-w-[2.5rem] ${
                          currentPage === page
                            ? isDark
                              ? "bg-teal-600 border-teal-600 text-white shadow-lg"
                              : "bg-teal-500 border-teal-500 text-white shadow-lg"
                            : isDark
                            ? "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-2 rounded-lg border transition-all duration-200 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-md"
                } ${
                  isDark
                    ? "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </motion.button>
            </div>
          )}

          {/* No mentors found */}
          {mentors.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Users
                className={`h-16 w-16 mx-auto mb-4 ${
                  isDark ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <h3
                className={`text-xl font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                No mentors found
              </h3>
              <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Try adjusting your search criteria or filters
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default MentorsGrid;
