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
export interface JoinUsPageProps {
  isDark?: boolean;
}