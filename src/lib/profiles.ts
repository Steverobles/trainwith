import { supabase } from "./supabase";
import { AgeBand, Profile, Sport } from "./types";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

interface ProfileRow {
  id: string;
  name: string;
  age_band: AgeBand;
  sport: Sport;
  focus: string;
  skill_level: Profile["skillLevel"];
  city: string;
  state: string;
  bio: string;
  guardian_verified: boolean;
}

function rowToProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    name: row.name,
    ageBand: row.age_band,
    sport: row.sport,
    focus: row.focus,
    skillLevel: row.skill_level,
    city: row.city,
    state: row.state,
    bio: row.bio,
    initials: getInitials(row.name),
    guardianVerified: row.guardian_verified,
  };
}

export async function listProfiles(filters: { sport?: Sport; pool?: string }): Promise<Profile[]> {
  let query = supabase
    .from("profiles")
    .select("id, name, age_band, sport, focus, skill_level, city, state, bio, guardian_verified")
    .order("created_at", { ascending: false });

  if (filters.sport) {
    query = query.eq("sport", filters.sport);
  }
  if (filters.pool === "teen") {
    query = query.in("age_band", ["13-15", "16-17"]);
  } else if (filters.pool === "adult") {
    query = query.in("age_band", ["18-24", "25-34", "35+"]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(rowToProfile);
}

export async function getProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, age_band, sport, focus, skill_level, city, state, bio, guardian_verified")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToProfile(data) : null;
}

export async function createProfile(input: {
  name: string;
  ageBand: AgeBand;
  sport: Sport;
  focus: string;
  skillLevel: Profile["skillLevel"];
  city: string;
  state: string;
  guardianName?: string;
  guardianEmail?: string;
}): Promise<void> {
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      name: input.name,
      age_band: input.ageBand,
      sport: input.sport,
      focus: input.focus,
      skill_level: input.skillLevel,
      city: input.city,
      state: input.state,
      bio: "",
    })
    .select("id")
    .single();

  if (error) throw error;

  if (input.guardianName && input.guardianEmail) {
    const { error: guardianError } = await supabase.from("guardian_contacts").insert({
      profile_id: data.id,
      guardian_name: input.guardianName,
      guardian_email: input.guardianEmail,
    });
    if (guardianError) throw guardianError;
  }
}
