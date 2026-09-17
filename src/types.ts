export interface Department {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tagline: string;
  description: string;
  headOfDepartment: string;
  bedCapacity: number;
  featuredProcedures: string[];
  technologies: string[];
  imageUrl: string;
  colorTheme: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string; // e.g. "Senior Consultant & Interventional Cardiologist"
  departmentId: string;
  departmentName: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  avatarUrl: string;
  bio: string;
  awards: string[];
  consultationDays: string[];
  consultationTimings: string;
  room: string;
  availableToday?: boolean;
  languages: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  emergencyContact?: string;
  address?: string;
  createdAt: string;
  role?: 'admin' | 'patient';
}

export type AppointmentStatus = 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  userId?: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  doctorAvatar: string;
  departmentId: string;
  departmentName: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  date: string;
  timeSlot: string;
  reason: string;
  appointmentType: 'In-Person Consultation' | 'Video Follow-up' | 'Second Opinion';
  status: AppointmentStatus;
  createdAt: string;
  tokenNumber: string;
  room: string;
}

export type NavPage = 'home' | 'about' | 'departments' | 'doctors' | 'book' | 'my-appointments' | 'admin';
