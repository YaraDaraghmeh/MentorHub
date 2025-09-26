import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import type { FilterState } from "../../types/types";
import { useTheme } from "../../Context/ThemeContext";

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  filteredCount: number;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  showFilters,
  onToggleFilters,
  filteredCount,
}) => {
  const specialties = [
    "all",
    "Software Engineering",
    "Hardware Engineering",
    "Cybersecurity",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Science",
    "Frontend Development",
    "Backend Development",
    "Fullstack Development",
    "Business Management",
    "Technical Interviews",
    "Product Management",
    "Design Interviews",
    "Data Science",
    "Marketing",
    "Behavioral Interviews",
  ];
  const { isDark } = useTheme();

  // Check if any filters are active
  const hasActiveFilters = 
    filters.searchTerm !== '' ||
    filters.selectedSpecialty !== 'all' ||
    filters.selectedExperience !== 'all' ||
    filters.selectedRating !== 'all';

  const clearAllFilters = () => {
    onFilterChange({
      searchTerm: "",
      selectedSpecialty: "all",
      selectedExperience: "all",
      selectedRating: "all",
    });
  };

  return (
    <div
      className={`py-4 sm:py-6 lg:py-8 rounded-xl border transition-all duration-200 ${
        isDark ? "bg-[#06171c] border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="w-full px-3 sm:px-4 lg:px-8">
        <div className="flex flex-col space-y-4">
          {/* Header Section */}
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h2
                className={`text-xl sm:text-2xl font-bold leading-tight ${
                  isDark ? "!text-gray-300" : "!text-[var(--primary)]"
                }`}
              >
                Browse Mentors
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p
                  className={`text-xs sm:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {filteredCount} mentors available
                </p>
                {hasActiveFilters && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isDark 
                      ? "bg-blue-900/50 text-blue-300 border border-blue-800" 
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}>
                    Filters active
                  </span>
                )}
              </div>
            </div>
            
            {/* Mobile Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className={`sm:hidden flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </button>
            )}
          </div>

          {/* Search and Filter Toggle Bar */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3 lg:space-x-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search mentors, companies, or skills..."
                value={filters.searchTerm}
                onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                } focus:outline-none focus:ring-2`}
              />
              {/* Clear search button */}
              {filters.searchTerm && (
                <button
                  onClick={() => onFilterChange({ searchTerm: '' })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={onToggleFilters}
              className={`flex items-center justify-center px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 text-sm sm:text-base font-medium min-w-fit ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                  : "bg-white text-[var(--primary)] border-gray-300 hover:bg-gray-50"
              } ${showFilters ? 'ring-2 ring-blue-500 ring-opacity-20' : ''}`}
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              <span className="hidden xs:inline">Filters</span>
              <span className="xs:hidden">Filter</span>
              <ChevronDown
                className={`h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0 transition-transform duration-200 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
              {hasActiveFilters && (
                <span className={`ml-2 w-2 h-2 rounded-full flex-shrink-0 ${
                  isDark ? 'bg-blue-400' : 'bg-blue-500'
                }`} />
              )}
            </button>
          </div>

          {/* Filter Options - Collapsible */}
          <motion.div
            initial={false}
            animate={{
              height: showFilters ? "auto" : 0,
              opacity: showFilters ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Filter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Specialty Filter */}
                <div className="space-y-2">
                  <label
                    className={`block text-xs sm:text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Specialty
                    {filters.selectedSpecialty !== 'all' && (
                      <span className="ml-1 text-blue-500">•</span>
                    )}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.selectedSpecialty}
                      onChange={(e) =>
                        onFilterChange({ selectedSpecialty: e.target.value })
                      }
                      className={`w-full px-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 text-sm sm:text-base appearance-none cursor-pointer ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                      } focus:outline-none focus:ring-2`}
                    >
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty} className={isDark ? "bg-gray-700" : "bg-white"}>
                          {specialty === "all" ? "All Specialties" : specialty}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Experience Filter */}
                <div className="space-y-2">
                  <label
                    className={`block text-xs sm:text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Experience
                    {filters.selectedExperience !== 'all' && (
                      <span className="ml-1 text-blue-500">•</span>
                    )}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.selectedExperience}
                      onChange={(e) =>
                        onFilterChange({ selectedExperience: e.target.value })
                      }
                      className={`w-full px-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 text-sm sm:text-base appearance-none cursor-pointer ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                      } focus:outline-none focus:ring-2`}
                    >
                      <option value="all" className={isDark ? "bg-gray-700" : "bg-white"}>All Experience Levels</option>
                      <option value="2" className={isDark ? "bg-gray-700" : "bg-white"}>2+ Years</option>
                      <option value="5" className={isDark ? "bg-gray-700" : "bg-white"}>5+ Years</option>
                      <option value="8" className={isDark ? "bg-gray-700" : "bg-white"}>8+ Years</option>
                      <option value="10" className={isDark ? "bg-gray-700" : "bg-white"}>10+ Years</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <label
                    className={`block text-xs sm:text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Minimum Rating
                    {filters.selectedRating !== 'all' && (
                      <span className="ml-1 text-blue-500">•</span>
                    )}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.selectedRating}
                      onChange={(e) =>
                        onFilterChange({ selectedRating: e.target.value })
                      }
                      className={`w-full px-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 text-sm sm:text-base appearance-none cursor-pointer ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                      } focus:outline-none focus:ring-2`}
                    >
                      <option value="all" className={isDark ? "bg-gray-700" : "bg-white"}>All Ratings</option>
                      <option value="5" className={isDark ? "bg-gray-700" : "bg-white"}>5 Stars</option>
                      <option value="4" className={isDark ? "bg-gray-700" : "bg-white"}>4+ Stars</option>
                      <option value="3" className={isDark ? "bg-gray-700" : "bg-white"}>3+ Stars</option>
                      <option value="2" className={isDark ? "bg-gray-700" : "bg-white"}>2+ Stars</option>
                      <option value="1" className={isDark ? "bg-gray-700" : "bg-white"}>1+ Star</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Clear Filters Button - Desktop */}
              {hasActiveFilters && (
                <div className="flex justify-end mt-4 sm:mt-6">
                  <button
                    onClick={clearAllFilters}
                    className={`hidden sm:flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Active Filters Display - Mobile */}
              <div className="sm:hidden">
                {hasActiveFilters && (
                  <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Active Filters:
                      </span>
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.searchTerm && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                        }`}>
                          Search: "{filters.searchTerm.length > 15 ? filters.searchTerm.substring(0, 15) + '...' : filters.searchTerm}"
                        </span>
                      )}
                      {filters.selectedSpecialty !== 'all' && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {filters.selectedSpecialty}
                        </span>
                      )}
                      {filters.selectedExperience !== 'all' && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {filters.selectedExperience}+ Years
                        </span>
                      )}
                      {filters.selectedRating !== 'all' && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {filters.selectedRating}+ Stars
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;