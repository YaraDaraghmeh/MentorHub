import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown } from "lucide-react";
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
    "Marketing ",
    "Behavioral Interviews",
  ];
  const { isDark } = useTheme();

  return (
    <div
      className={`py-8 rounded-[12px] ${
        isDark ? "bg-[#06171c] border-gray-700" : "bg-white border-gray-200"
      } border`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                className={`text-2xl font-bold  ${
                  isDark ? "!text-gray-300" : "!text-[var(--primary)]"
                }`}
              >
                Browse Mentors
              </h2>
              <p
                className={`mt-1 text-start text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {filteredCount} mentors available
              </p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors, companies, or skills..."
                value={filters.searchTerm}
                onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors text-base ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              />
            </div>

            <button
              onClick={onToggleFilters}
              className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-colors ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                  : "bg-white text-[var(--primary)] border-gray-300 hover:bg-gray-50"
              } lg:w-auto w-full`}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Filter Options */}
          <motion.div
            initial={false}
            animate={{
              height: showFilters ? "auto" : 0,
              opacity: showFilters ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Specialty
                </label>
                <select
                  value={filters.selectedSpecialty}
                  onChange={(e) =>
                    onFilterChange({ selectedSpecialty: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors text-base ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-black"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                >
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty === "all" ? "All Specialties" : specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Experience
                </label>
                <select
                  value={filters.selectedExperience}
                  onChange={(e) =>
                    onFilterChange({ selectedExperience: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors text-base ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-black"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                >
                  <option value="all">All Experience Levels</option>
                  <option value="2+">2+ Years</option>
                  <option value="5+">5+ Years</option>
                  <option value="8+">8+ Years</option>
                  <option value="10+">10+ Years</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Minimum Rating
                </label>
                <select
                  value={filters.selectedRating}
                  onChange={(e) =>
                    onFilterChange({ selectedRating: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors text-base ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-black"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            {/* 🔹 Clear Filters Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() =>
                  onFilterChange({
                    searchTerm: "",
                    selectedSpecialty: "all",
                    selectedExperience: "all",
                    selectedRating: "all",
                  })
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
