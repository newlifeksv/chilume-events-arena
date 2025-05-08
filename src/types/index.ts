
export type EventType = "sports" | "cultural";

export interface Event {
  id: string;
  name: string;
  type: EventType;
  description: string;
  fee: number;
  date: string;
  venue: string;
  maxParticipants: number;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
  rules?: string;
  teamSize: number;
  winners?: Participant[];
}

export interface Participant {
  id: string;
  name: string;
  college: string;
  phone: string;
  email?: string;
  eventIds: string[];
  registeredAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

export interface MatchPair {
  id: string;
  eventId: string;
  participant1: Participant;
  participant2?: Participant; // Optional for single-player games
  winner?: string; // ID of the winning participant
  round: number;
  completed: boolean;
  scheduledTime?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  addedBy: string;
}

export interface AuthContextType {
  currentUser: Admin | null;
  login: (authKey: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}
