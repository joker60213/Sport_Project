// User type definition
export type User = {
  name: string;
  role: 'client' | 'trainer';
  trial?: boolean;
  specialty?: string;
  about?: string;
  img?: string;
  rating?: number;
  education?: string;
  experience?: string;
  extraInfo?: string;
  services?: {id: number; name: string; price: number}[];
  gallery?: string[];
  certificates?: string[];
  reviews?: {id: number; author: string; text: string; rating: number; date: string; specialization?: string; price?: number}[];
}

// Client account interfaces
export interface Training {
  type: string
  date: string
  progress: number
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
  notes?: string
}

export interface WorkoutSession {
  id: string
  date: string
  title: string
  exercises: Exercise[]
  notes?: string
}

export interface BodyMeasurement {
  date: string
  weight: number
  chest?: number
  waist?: number
  hips?: number
  thighs?: number
  arms?: number
  shoulders?: number
  neck?: number
  calves?: number
}

export interface Client {
  id: number
  name: string
  age: number
  height: number
  weight: number
  trainings: Training[]
  workouts?: WorkoutSession[]
  bodyMeasurements?: BodyMeasurement[]
  notes?: string[]
  goals?: string
  medicalInfo?: string
  contactInfo?: string
  dietInfo?: string
}

export interface Trainer {
  id: number
  name: string
  specialty: string
  img?: string
  rating: number
  experience: string
  about: string
  contacts: string
}

// Chat interfaces
export interface Message {
  id: number
  author: 'trainer' | 'client'
  text: string
  time: string
}

export interface ClientAccountChatProps {
  onClose: () => void
  onCloseChat: () => void
  activeChats: Trainer[]
  currentChatIndex: number
  setCurrentChatIndex: (index: number) => void
}

export interface ClientAccountPageProps {
  user: {
    name: string
    role: 'client' | 'trainer'
    id?: number
  } | null
  setUser: (user: User | null) => void
  isAuthLoading?: boolean
} 