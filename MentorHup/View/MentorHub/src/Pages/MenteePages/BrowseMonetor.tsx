import MentorsGrid from "../../components/MenteeComponents/MentorsGrid"; 
import { useTheme } from "../../Context/ThemeContext";
import { useState, useMemo } from "react";
import type { FilterState, Mentor } from "../../types/types";
import SearchFilters from "../../components/MenteeComponents/Filter";
import BookingModal from "../../components/MenteeComponents/BookingModal";



const BrowseMentor = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedSpecialty: "all",
    selectedExperience: "all",
    selectedRating: "all",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const { isDark } = useTheme();



  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleBookSession = (mentor: Mentor) => {
    console.log(mentor);
    setSelectedMentor(mentor);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedMentor(null);
  };

  return (
    <div className={`browse-mentor ${isDark ? "dark" : "light"}`}>
      

      <MentorsGrid
      />
      
    
    </div>
  );
};

export default BrowseMentor;
