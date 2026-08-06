import { supabase } from "./supabase";
import { AgeBand, Profile, Sport } from "./types";

const SELECT_COLUMNS =
  "id, name, age_band, sport, focus, skill_level, city, state, bio, guardian_verified, user_id";

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
  user_id: string | null;
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
    userId: row.user_id,
  };
}

export async function listProfiles(filters: { sport?: Sport; pool?: string }): Promise<Profile[]> {
  let query = supabase.from("profiles").select(SELECT_COLUMNS).order("created_at", { ascending: false });

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
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToProfile(data) : null;
}

export async function getProfilesByIds(ids: string[]): Promise<Profile[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from("profiles").select(SELECT_COLUMNS).in("id", ids);
  if (error) throw error;
  return (data ?? []).map(rowToProfile);
}

export async function getMyProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(SELECT_COLUMNS)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToProfile(data) : null;
}

export async function signUpAndCreateProfile(input: {
  email: string;
  password: string;
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
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });
  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) {
    throw new Error("Check your email to confirm your account before your profile can be created.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
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
