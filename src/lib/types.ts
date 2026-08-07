export type AgeBand = "13-15" | "16-17" | "18-24" | "25-34" | "35+";

export type Sport =
  | "Baseball"
  | "Softball"
  | "Basketball"
  | "Football"
  | "Soccer"
  | "Tennis"
  | "Track & Field";

export type SkillLevel = "Just starting" | "Rec / casual" | "Competitive" | "Varsity+";

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
}

export interface TrainingPost {
  id: string;
  profileId: string;
  sport: Sport;
  focus: string; // e.g. "Long toss", "Bullpen sessions", "Ball handling"
  skillLevel: SkillLevel;
  createdAt: string;
}
