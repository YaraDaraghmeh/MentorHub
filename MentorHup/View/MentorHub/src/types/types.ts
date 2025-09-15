export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  rating: number;
  reviews: number;
  experience: string;
  totalSessions: number;
  hourlyRate: number;
  successRate: number;
  specialties: string[];
  isOnline: boolean;
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

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor | null;
  isDark: boolean;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  email: string;
}


