import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Star,
  Users
} from "lucide-react";
import { SiReaddotcv } from "react-icons/si";
import { useTheme } from "../../Context/ThemeContext";
import type { Mentor, FilterState } from "../../types/types";
import BookingModal from "./BookingModal";
import defaultprofileimage from "../../assets/avatar-profile.png";
import { FormattedDateComponent } from "../common/FormattedDateComponent";
import ToSend from '../../components/Chatting/iconsToSend';
import { useNavigate } from "react-router-dom";
import mentorService, { type MentorFilters } from '../../Services/mentorService';
import StarReview from '../Stars/StarReview';
import SearchFilters from './Filter';

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
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedSpecialty: 'all',
    selectedExperience: 'all',
    selectedRating: 'all'
  });


  const mentors = useMemo(() => {
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

  const getMentors = useCallback(async (pageNumber: number, pageSize: number, apiFilters: Partial<MentorFilters> = {}, retryCount = 0) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    if (!token) {
      console.error(' No authentication token found');
      setError('Authentication required. Please log in again.');
      setLoading(false);
      return;
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare filter params for API
    const filterParams: Record<string, any> = {};

    // Map UI filters to API filters
    if (apiFilters.skillName) filterParams.skillName = apiFilters.skillName;
    if (apiFilters.experiences) filterParams.experiences = apiFilters.experiences;
    if (apiFilters.field) filterParams.field = apiFilters.field;

    console.log(`🔍 [${requestId}] Starting to fetch mentors...`, {
      pageNumber,
      pageSize,
      retryCount,
      filters: filterParams
    });

    setLoading(true);
    setError(null);

    try {
      console.log(`🔧 [${requestId}] Using mentorService with backend pagination and filters...`);

      // API call with pagination and filter parameters
      const result = await mentorService.getMentors(pageNumber, pageSize, token, filterParams);

      if (!result.success) {
        console.error(` [${requestId}] API call failed:`, result.error);
        throw new Error(result.error || 'Failed to fetch mentors');
      }

      console.log(` [${requestId}] API returned:`, {
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
      console.error(` [${requestId}] Error in getMentors:`, error);

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
  }, [token, filters]);

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
          console.log('API connection test successful');
        } else {
          console.error(' API connection test failed:', result.error);
          setError(result.error || 'API connection failed');
        }
      } catch (error: any) {
        console.error('API connection test error:', error);
        setError('Failed to connect to API');
      }
    };

    testApiConnection();
  }, [token]);

  // Fetch mentors when component mounts or page changes
  useEffect(() => {
    console.log(' DEBUG: useEffect triggered - token available:', !!token);

    if (token) {
      console.log('DEBUG: Calling getMentors with pagination');
      getMentors(currentPage, pageSize);
    } else {
      console.log('DEBUG: No token available, skipping mentor fetch');
      setLoading(false);
      setError('Please log in to view mentors');
    }
  }, [getMentors, currentPage, pageSize, token]);

  // Calculate pagination indices
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers for pagination with first, last, and dots
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end of the middle section
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust if we're near the start or end
    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }
    
    // Add dots after first page if needed
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    // Add dots before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Handle filter changes from the Filter component
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => {
      const updatedFilters = { ...prev, ...newFilters };

      // Map the filter values to match the API expected format
      const apiFilters: Partial<MentorFilters> = {};

      if (updatedFilters.searchTerm) {
        apiFilters.skillName = updatedFilters.searchTerm;
      }

      if (updatedFilters.selectedExperience !== 'all') {
        const experience = parseInt(updatedFilters.selectedExperience);
        if (!isNaN(experience)) {
          apiFilters.experiences = experience;
        }
      }

      if (updatedFilters.selectedSpecialty !== 'all') {
        apiFilters.field = updatedFilters.selectedSpecialty;
      }

      // Update the filters and reset to first page
      setCurrentPage(1);

      // Make the API call with the mapped filters
      if (token) {
        getMentors(1, pageSize, apiFilters);
      }

      // Return the updated UI filter state
      return updatedFilters;
    });
  };

  // Fetch mentors when component mounts or page changes
  useEffect(() => {
    if (token) {
      console.log('🔍 Fetching mentors with filters:', filters);

      // Map the UI filters to API filters
      const apiFilters: Partial<MentorFilters> = {};

      if (filters.searchTerm) {
        apiFilters.skillName = filters.searchTerm;
      }

      if (filters.selectedExperience !== 'all') {
        const experience = parseInt(filters.selectedExperience);
        if (!isNaN(experience)) {
          apiFilters.experiences = experience;
        }
      }

      if (filters.selectedSpecialty !== 'all') {
        apiFilters.field = filters.selectedSpecialty;
      }

      // Use the mapped filters for the API call
      getMentors(currentPage, pageSize, apiFilters);
    }
  }, [currentPage, pageSize, token, getMentors]);

  const handlePageChange = (page: number) => {
    console.log('🔍 DEBUG: handlePageChange called with:', {
      page,
      currentPage,
      totalPages,
      totalItems,
      allMentorsLength: allMentors.length
    });

    if (page < 1 || page > totalPages || page === currentPage) {
      console.log(' DEBUG: Page change blocked:', {
        page,
        totalPages,
        currentPage,
        reason: page < 1 ? 'page < 1' : page > totalPages ? 'page > totalPages' : 'page === currentPage'
      });
      return;
    }

    console.log('DEBUG: Page change allowed:', { from: currentPage, to: page });
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
              className={`mb-6 p-4 rounded-lg border ${isDark
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
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  Showing {startIndex}-{endIndex} of {totalItems} mentors
                </p>
              </div>
              <div
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"
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
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? "border-blue-400" : "border-blue-600"
                  }`}></div>
                <span className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Loading mentors...
                </span>
              </div>
            </motion.div>
          )}

          {/* Search and Filter Component */}
          <div className="mb-3 w-full overflow-hidden">
            <div className="w-full max-w-[100vw] px-1 -mx-1 overflow-x-auto">
              <div className="min-w-[320px] px-1">
                <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  showFilters={showFilters}
                  onToggleFilters={() => setShowFilters(!showFilters)}
                  filteredCount={totalItems}
                />
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          {!loading && !error && mentors.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={currentPage}
              className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 px-1 sm:px-2 w-full max-w-[100vw] overflow-x-hidden"
            >
              {mentors.map((mentor) => (
                <motion.div
                  key={mentor.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl border transition-all duration-300 hover:shadow-xl relative flex flex-col h-full w-full min-w-0 max-w-full ${isDark
                      ? "bg-gray-800 border-gray-700 hover:shadow-blue-500/10"
                      : "bg-white border-gray-200 hover:shadow-blue-500/20"
                    }`}
                >
                    <div className="p-2.5 sm:p-3 flex-1 flex flex-col w-full h-full max-w-full overflow-hidden">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2 sm:mb-3 w-full">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
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
                            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"
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
                          className={`p-2 rounded-lg transition-colors ${isDark
                              ? "hover:bg-gray-700 text-gray-400"
                              : "hover:bg-gray-100 text-gray-600"
                            }`}
                        >
                          <ToSend onClick={() => handleSendIconClick(
                            mentor.name,
                            mentor.id,
                            mentor.imageLink || defaultprofileimage
                          )} />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-colors ${isDark
                              ? "hover:bg-gray-700 text-gray-400"
                              : "hover:bg-gray-100 text-gray-600"
                            }`}
                        >
                          <SiReaddotcv className="h-4 w-4" onClick={
                            mentor.cvLink ? () => window.open(mentor.cvLink, '_blank') : undefined
                          } />
                        </button>
                      </div>
                    </div>

                    {/* Company */}
                    <div className="mb-3 sm:mb-4">
                      <span
                        className={`text-sm font-medium ${isDark ? "text-blue-400" : "text-blue-600"
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
                            <StarReview rating={mentor.reviewCount || 0} />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
                      <div className="text-center">
                        <div className={`text-lg font-semibold ${textClass}`}>
                          {mentor.experience || 0}
                        </div>
                        <div
                          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"
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
                          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          Per Hour
                        </div>
                      </div>
                    </div>

                    {/* Specialties/Skills */}
                    <div className="mb-3 sm:mb-4">
                      <div className="flex flex-wrap gap-2">
                        {mentor.skills?.slice(0, 2).map((specialty, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${isDark
                                ? "bg-blue-900 text-blue-300"
                                : "bg-blue-100 text-blue-800"
                              }`}
                          >
                            {specialty}
                          </span>
                        ))}
                        {mentor.skills && mentor.skills.length > 2 && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${isDark
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
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center mb-1">
                          <Clock className="h-4 w-4 mr-1.5 text-green-500" />
                          <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"
                            }`}>
                            Next Available
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {mentor.availabilities
                            .filter(availability => !availability.isBooked)
                            .slice(0, 1)
                            .map((availability, index) => (
                              <div key={availability.mentorAvailabilityId || index}
                                className={`text-sm p-2.5 rounded-lg ${isDark
                                    ? "bg-gray-700/80 text-gray-200 border border-gray-600"
                                    : "bg-gray-50 text-gray-700 border border-gray-200"
                                  }`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span className="font-medium">{availability.dayOfWeek}</span>
                                  </div>
                                  <div className="flex items-center space-x-1.5">
                                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span className="font-medium">
                                      <FormattedDateComponent
                                        isoDateString={availability.startTime}
                                        showDate={false}
                                        className="font-medium"
                                      />
                                      <span className="mx-0.5">-</span>
                                      <FormattedDateComponent
                                        isoDateString={availability.endTime}
                                        showDate={false}
                                        className="font-medium"
                                      />
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1.5 flex items-center">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5"></span>
                                  {availability.durationInMinutes} min session • Available now
                                </div>
                              </div>
                            ))}
                          {mentor.availabilities.filter(a => !a.isBooked).length > 1 && (
                            <div className={`text-[11px] text-center pt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"
                              }`}>
                              +{mentor.availabilities.filter(a => !a.isBooked).length - 1} more slots
                            </div>
                          )}
                          {mentor.availabilities.filter(a => !a.isBooked).length === 0 && (
                            <div className={`text-[11px] text-center py-1 ${isDark ? "text-gray-400" : "text-gray-500"
                              }`}>
                              No available slots
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Fixed bottom section with member since and action buttons */}
                    <div className="mt-auto">
                      {/* Action buttons */}
                      <div className="px-1.5 sm:px-3 pb-1.5 pt-1.5 border-t border-gray-600 dark:border-gray-600">
                        <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1">
                          <div className="flex items-center">
                            <Calendar className="h-2 w-2 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              Member since{' '}
                              <span className="font-medium">
                                <FormattedDateComponent
                                  isoDateString={mentor.createdAt}
                                  showTime={false}
                                  dateFormat="short"
                                  className="text-[10px]"
                                />
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onBookSession(mentor)}
                            className="flex-1 bg-gradient-to-r from-teal-950 to-teal-500 hover:from-teal-500 hover:to-teal-950 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200"
                          >
                            Book Session
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/mentor/${mentor.id}`)}
                            className="flex-1 border border-gray-600 
                                       text-sm font-medium py-2 px-3 rounded-lg
                                       transition-all duration-200
                                       text-gray-500 hover:text-black dark:text-white dark:hover:text-white
                                      hover:bg-gray-100 dark:hover:bg-gray-700 
                                      dark:border-gray-600"
                          >
                            View Profile
                          </motion.button>
                        </div>
                      </div>
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
                className={`flex items-center px-3 py-2 rounded-lg border transition-all duration-200 ${currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-md"
                  } ${isDark
                    ? "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </motion.button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => {
                  const isActive = currentPage === page;
                  const isDots = page === '...';
                  const pageNum = typeof page === 'number' ? page : 0;
                  
                  return (
                    <div key={`${page}-${index}`} className="flex items-center">
                      {isDots ? (
                        <span className={`px-2 py-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          •••
                        </span>
                      ) : (
                        <motion.button
                          whileHover={!isActive ? { scale: 1.1 } : {}}
                          whileTap={!isActive ? { scale: 0.95 } : {}}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isActive}
                          className={`px-3 py-1.5 mx-0.5 rounded-md text-sm font-medium transition-all duration-200 min-w-[36px] border ${isActive ? 'border-transparent' : 'border'} ${isActive ? 'bg-teal-600 text-white shadow-md cursor-default' : isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        >
                          {page}
                        </motion.button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-2 rounded-lg border transition-all duration-200 ${currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-md"
                  } ${isDark
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
                className={`h-16 w-16 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-400"
                  }`}
              />
              <h3
                className={`text-xl font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-600"
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
