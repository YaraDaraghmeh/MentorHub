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
  responseTime?: string;
  location?: string;
  badge?: string;
  description?: string;
  availabilities?: Availability[];
}

// API Types for backend integration - Updated to match real API schema
export interface ApiMentor {
  id: number;
  name: string;
  email: string;
  companyName: string;
  description: string;
  price: number;
  experiences: number;
  field: string;
  reviewCount: number;
  createdAt: string;
  imageLink: string;
  cvLink: string;
  skills: string[];
  availabilities: Availability[];
}

export interface Availability {
  mentorAvailabilityId: number;
  dayOfWeek: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  durationInMinutes: number;
  isBooked: boolean;
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


