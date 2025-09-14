// src/types/types.ts
export interface Mentor {
  id: number;
  name: string;
  title: string;
  company: string;
  rating: number;
  reviews: number;
  experience: string;
  location: string;
  hourlyRate: number;
  specialties: string[];
  avatar: string;
  isOnline: boolean;
  responseTime: string;
  totalSessions: number;
  successRate: number;
  badge?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface FilterState {
  searchTerm: string;
  selectedSpecialty: string;
  selectedExperience: string;
  selectedRating: string;
}

export interface Position {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor | null;
  isDark: boolean;
}

export interface MentorsGridProps {
  mentors: Mentor[];
  onBookSession?: (mentor: Mentor) => void;
}

export interface SessionType {
  value: string;
  label: string;
  price: number;
}

export interface BookingData {
  mentorId: number;
  date: string;
  time: string;
  sessionType: string;
  duration: string;
  total: number;
  notes: string;
}