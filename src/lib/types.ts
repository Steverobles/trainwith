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

export interface Profile {
  id: string;
  name: string;
  ageBand: AgeBand;
  city: string;
  state: string;
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
