import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Star,
  Users,
  Share2,
} from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";
import type { Mentor } from "../../types/types";
import BookingModal from "./BookingModal";
import defaultprofileimage from "../../assets/avatar-profile.png";
import { FormattedDateComponent } from "../common/FormattedDateComponent";
import ToSend from '../../components/Chatting/iconsToSend'
import { useNavigate } from "react-router-dom";
import mentorService from '../../Services/mentorService';

const MentorsGrid = () => {
  console.log('🔍 DEBUG: MentorsGrid component initialized');

  const navigate = useNavigate();
  const [allMentors, setAllMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5; // API returns 5 mentors per page

  // Get current page mentors - API will return only current page data
  const mentors = useMemo(() => {
    // In backend pagination, mentors come directly from API for current page
    // No need to slice - API already returns only current page data
    console.log('🔍 DEBUG: Current page mentors from API:', {
      currentPage,
      pageSize,
      mentorsLength: allMentors.length,
      mentorNames: allMentors.map(m => m.name)
    });

    return allMentors;
  }, [allMentors, currentPage, pageSize]);

  const handleSendIconClick = (userName: string, mentorId: number, imageLink: string) => {
    localStorage.setItem("MessageIdUser", mentorId.toString());
    localStorage.setItem("MessageUserName", userName);
    localStorage.setItem("imageUser", imageLink);
    navigate("/mentee/chatting");
  };

  const onBookSession = useCallback((mentor: Mentor) => {
    setModalBook({ mentor, show: true });
  }, []);

  const onCloseModal = useCallback(() => {
    setModalBook((prev) => ({ ...prev, show: false }));
  }, []);

  const getMentors = useCallback(async (pageNumber: number, pageSize: number, retryCount = 0) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    if (!token) {
      console.error('❌ No authentication token found');
      setError('Authentication required. Please log in again.');
      setLoading(false);
      return;
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`🔍 [${requestId}] Starting to fetch mentors...`, { pageNumber, pageSize, retryCount });

    setLoading(true);
    setError(null);

    try {
      console.log(`🔧 [${requestId}] Using mentorService with backend pagination...`);

      // API call with pagination parameters
      const result = await mentorService.getMentors(pageNumber, pageSize, token);

      if (!result.success) {
        console.error(`❌ [${requestId}] API call failed:`, result.error);
        throw new Error(result.error || 'Failed to fetch mentors');
      }

      console.log(`✅ [${requestId}] API returned:`, {
        mentorsCount: result.mentors?.length || 0,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        currentPage: pageNumber,
        itemsFrom: result.itemsFrom,
        itemsTo: result.itemsTo
      });

      const mentors = result.mentors || [];

      // Transform the mentors data to match our interface
      const transformedMentors = mentors.map((mentor: any) => ({
        ...mentor,
        experience: mentor.experiences || mentor.experience || 0,
        userName: mentor.userName || mentor.email?.split('@')[0] || mentor.name,
        reviewCount: mentor.reviewCount || 0,
        availabilities: mentor.availabilities || [],
        imageLink: mentor.imageLink || null,
        companyName: mentor.companyName || ''
      }));

      console.log(`✅ [${requestId}] Transformed ${transformedMentors.length} mentors`);
      setAllMentors(transformedMentors);

      // Update pagination state from API response
      setTotalItems(result.totalItems || transformedMentors.length);
      setTotalPages(result.totalPages || Math.ceil((result.totalItems || transformedMentors.length) / pageSize));

    } catch (error: any) {
      console.error(`❌ [${requestId}] Error in getMentors:`, error);

      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        if (retryCount < MAX_RETRIES) {
          const retryIn = RETRY_DELAY * (retryCount + 1);
          setTimeout(() => {
            getMentors(pageNumber, pageSize, retryCount + 1);
          }, retryIn);
          return;
        }
      }

      const genericError = 'Failed to load mentors. ' + (error.message || 'Please try again later.');
      setError(genericError);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const testApiConnection = async () => {
      if (!token) {
        console.log('🔍 DEBUG: No token available for API test');
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      console.log('🔍 DEBUG: Testing API connection using mentorService...');
      try {
        const result = await mentorService.testApiConnection(token);

        if (result.success) {
          console.log('✅ API connection test successful');
        } else {
          console.error('❌ API connection test failed:', result.error);
          setError(result.error || 'API connection failed');
        }
      } catch (error: any) {
        console.error('❌ API connection test error:', error);
        setError('Failed to connect to API');
      }
    };

    testApiConnection();
  }, [token]);

  // Fetch mentors when component mounts or page changes
  useEffect(() => {
    console.log('🔍 DEBUG: useEffect triggered - token available:', !!token);

    if (token) {
      console.log('🔍 DEBUG: Calling getMentors with pagination');
      getMentors(currentPage, pageSize);
    } else {
      console.log('🔍 DEBUG: No token available, skipping mentor fetch');
      setLoading(false);
      setError('Please log in to view mentors');
    }
  }, [getMentors, currentPage, pageSize, token]);

  // Calculate pagination display values - for backend pagination
  const startIndex = totalItems > 0 ? ((currentPage - 1) * pageSize + 1) : 0;
  const endIndex = totalItems > 0 ? Math.min(currentPage * pageSize, totalItems) : 0;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    console.log('🔍 DEBUG: getPageNumbers called:', {
      totalPages,
      currentPage,
      maxVisiblePages
    });

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

    console.log('🔍 DEBUG: getPageNumbers result:', pages);
    return pages;
  };

  const handlePageChange = (page: number) => {
    console.log('🔍 DEBUG: handlePageChange called with:', {
      page,
      currentPage,
      totalPages,
      totalItems,
      allMentorsLength: allMentors.length
    });

    if (page < 1 || page > totalPages || page === currentPage) {
      console.log('🔍 DEBUG: Page change blocked:', {
        page,
        totalPages,
        currentPage,
        reason: page < 1 ? 'page < 1' : page > totalPages ? 'page > totalPages' : 'page === currentPage'
      });
      return;
    }

    console.log('🔍 DEBUG: Page change allowed:', { from: currentPage, to: page });
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
        onClose={onCloseModal}
      />

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg border ${
                isDark
                  ? "bg-red-900/20 border-red-800 text-red-400"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              <div className="flex items-center">
                <div className="ml-2">
                  <p className="font-medium">Error loading mentors</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results summary - only show if we have data and no error */}
          {!loading && !error && totalItems > 0 && (
            <div className="mb-6 flex justify-between items-center">
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Showing {startIndex}-{endIndex} of {totalItems} mentors
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
          )}

          {/* Loading state */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="flex justify-center items-center space-x-2">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                  isDark ? "border-blue-400" : "border-blue-600"
                }`}></div>
                <span className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Loading mentors...
                </span>
              </div>
            </motion.div>
          )}

          {/* Mentors Grid */}
          {!loading && !error && mentors.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={currentPage} // Re-trigger animation on page change
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {mentors.map((mentor) => (
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
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={mentor.imageLink || defaultprofileimage}
                            alt={mentor.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = defaultprofileimage;
                            }}
                          />
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
                          onClick={() => handleSendIconClick(
                            mentor.userName || mentor.email?.split('@')[0] || mentor.name,
                            mentor.id,
                            mentor.imageLink || defaultprofileimage
                          )}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? "hover:bg-gray-700 text-gray-400"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          <ToSend />
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
                            {mentor.reviewCount?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className={`text-lg font-semibold ${textClass}`}>
                          {mentor.experience || 0}
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Years Experience
                        </div>
                      </div>
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

                    {/* Specialties/Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {mentor.skills?.slice(0, 2).map((specialty, index) => (
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
                        {mentor.skills && mentor.skills.length > 2 && (
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

                    {/* Availability Section */}
                    {mentor.availabilities && mentor.availabilities.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 mr-2 text-green-500" />
                          <span className={`text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}>
                            Next Available
                          </span>
                        </div>
                        <div className="space-y-1">
                          {mentor.availabilities
                            .filter(availability => !availability.isBooked)
                            .slice(0, 2)
                            .map((availability, index) => (
                            <div key={availability.mentorAvailabilityId || index}
                                 className={`text-xs p-2 rounded-lg ${
                                   isDark
                                     ? "bg-gray-700 text-gray-300"
                                     : "bg-gray-50 text-gray-600"
                                 }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3" />
                                  <span className="font-medium">{availability.dayOfWeek}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <FormattedDateComponent
                                    isoDateString={availability.startTime}
                                    showDate={false}
                                    className="font-medium"
                                  />
                                  <span>-</span>
                                  <FormattedDateComponent
                                    isoDateString={availability.endTime}
                                    showDate={false}
                                    className="font-medium"
                                  />
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Duration: {availability.durationInMinutes} minutes
                              </div>
                            </div>
                          ))}
                          {mentor.availabilities.filter(a => !a.isBooked).length > 2 && (
                            <div className={`text-xs text-center py-1 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}>
                              +{mentor.availabilities.filter(a => !a.isBooked).length - 2} more slots
                            </div>
                          )}
                          {mentor.availabilities.filter(a => !a.isBooked).length === 0 && (
                            <div className={`text-xs text-center py-2 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}>
                              No available slots
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Member Since */}
                    <div className="mb-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Member since </span>
                        <FormattedDateComponent
                          isoDateString={mentor.createdAt}
                          showTime={false}
                          dateFormat="short"
                          className="ml-1 font-medium"
                        />
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
          )}

          {/* Pagination */}
          {!loading && !error && mentors.length > 0 && (
            console.log('🔍 DEBUG: Rendering pagination UI', {
              shouldShowPagination: totalPages > 1,
              currentPage,
              totalPages,
              mentorsLength: mentors.length
            }),
            <div className="flex items-center justify-center space-x-2">
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
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
          {!loading && !error && totalItems === 0 && (
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
                Try refreshing the page or contact support if the issue persists
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default MentorsGrid;
