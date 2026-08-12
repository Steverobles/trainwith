export type AgeBand = "13-15" | "16-17" | "18-24" | "25-34" | "35+";

export type Sport =
  | "Baseball"
  | "Basketball"
  | "Cycling"
  | "Football"
  | "Golf"
  | "Pickleball"
  | "Running"
  | "Soccer"
  | "Softball"
  | "Swimming"
  | "Tennis"
  | "Track & Field"
  | "Volleyball"
  | "Weightlifting";

export type SkillLevel = "Just starting" | "Rec / casual" | "Competitive" | "Varsity+";

export const AVAILABILITY_OPTIONS = ["Weekday mornings", "Weekday evenings", "Weekends"] as const;
export type Availability = (typeof AVAILABILITY_OPTIONS)[number];

export const isMinorAgeBand = (band: AgeBand) => band === "13-15" || band === "16-17";

export function ageBandFromBirthYear(birthYear: number, referenceYear = new Date().getFullYear()): AgeBand {
  const age = referenceYear - birthYear;
  if (age <= 15) return "13-15";
  if (age <= 17) return "16-17";
  if (age <= 24) return "18-24";
  if (age <= 34) return "25-34";
  return "35+";
}

export interface Profile {
  id: string;
  name: string;
  ageBand: AgeBand;
  birthYear: number;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  bio: string;
  initials: string;
  guardianVerified?: boolean; // only meaningful for minor age bands
  userId: string | null; // null for unclaimed seed/demo profiles
  avatarUrl: string | null; // always null for minor age bands
  availability: string[];
}

export interface TrainingPost {
  id: string;
  profileId: string;
  sport: Sport;
  focus: string; // e.g. "Long toss", "Bullpen sessions", "Ball handling"
  skillLevel: SkillLevel;
  createdAt: string;
}
