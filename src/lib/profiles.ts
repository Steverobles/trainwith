import { supabase } from "./supabase";
import { geocodeCityState } from "./geocode";
import { AgeBand, Profile } from "./types";

const SELECT_COLUMNS = "id, name, age_band, city, state, lat, lng, bio, guardian_verified, user_id";

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

interface ProfileRow {
  id: string;
  name: string;
  age_band: AgeBand;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  bio: string;
  guardian_verified: boolean;
  user_id: string | null;
}

function rowToProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    name: row.name,
    ageBand: row.age_band,
    city: row.city,
    state: row.state,
    lat: row.lat,
    lng: row.lng,
    bio: row.bio,
    initials: getInitials(row.name),
    guardianVerified: row.guardian_verified,
    userId: row.user_id,
  };
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
  city: string;
  state: string;
  bio: string;
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

  const coords = await geocodeCityState(input.city, input.state);

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      name: input.name,
      age_band: input.ageBand,
      city: input.city,
      state: input.state,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      bio: input.bio,
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

export async function updateProfile(
  profileId: string,
  input: {
    name: string;
    ageBand: AgeBand;
    city: string;
    state: string;
    bio: string;
    regeocode: boolean;
  }
): Promise<void> {
  const updates: Record<string, unknown> = {
    name: input.name,
    age_band: input.ageBand,
    city: input.city,
    state: input.state,
    bio: input.bio,
  };

  if (input.regeocode) {
    const coords = await geocodeCityState(input.city, input.state);
    updates.lat = coords?.lat ?? null;
    updates.lng = coords?.lng ?? null;
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", profileId);
  if (error) throw error;
}
