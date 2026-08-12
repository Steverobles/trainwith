import { supabase } from "./supabase";
import { geocodeCityState } from "./geocode";
import { AgeBand, Profile, ageBandFromBirthYear } from "./types";

const SELECT_COLUMNS =
  "id, name, age_band, birth_year, city, state, lat, lng, bio, guardian_verified, user_id, avatar_url, availability";

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
  birth_year: number;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  bio: string;
  guardian_verified: boolean;
  user_id: string | null;
  avatar_url: string | null;
  availability: string[] | null;
}

function rowToProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    name: row.name,
    ageBand: row.age_band,
    birthYear: row.birth_year,
    city: row.city,
    state: row.state,
    lat: row.lat,
    lng: row.lng,
    bio: row.bio,
    initials: getInitials(row.name),
    guardianVerified: row.guardian_verified,
    userId: row.user_id,
    avatarUrl: row.avatar_url,
    availability: row.availability ?? [],
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
  birthYear: number;
  city: string;
  state: string;
  bio: string;
  availability: string[];
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
      age_band: ageBandFromBirthYear(input.birthYear),
      birth_year: input.birthYear,
      city: input.city,
      state: input.state,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      bio: input.bio,
      availability: input.availability,
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

    // Best-effort: the profile still exists if this fails, just without an
    // approval email sent yet. Don't block signup on it.
    fetch("/api/guardian/send-approval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: data.id }),
    }).catch(() => {});
  }
}

export async function updateProfile(
  profileId: string,
  input: {
    name: string;
    birthYear: number;
    city: string;
    state: string;
    bio: string;
    availability: string[];
    regeocode: boolean;
  }
): Promise<void> {
  const updates: Record<string, unknown> = {
    name: input.name,
    age_band: ageBandFromBirthYear(input.birthYear),
    birth_year: input.birthYear,
    city: input.city,
    state: input.state,
    bio: input.bio,
    availability: input.availability,
  };

  if (input.regeocode) {
    const coords = await geocodeCityState(input.city, input.state);
    updates.lat = coords?.lat ?? null;
    updates.lng = coords?.lng ?? null;
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", profileId);
  if (error) throw error;
}

export async function uploadAvatar(file: File): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrlData.publicUrl })
    .eq("user_id", user.id);
  if (updateError) throw updateError;

  return publicUrlData.publicUrl;
}

export async function removeAvatar(profileId: string): Promise<void> {
  const { error } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", profileId);
  if (error) throw error;
}
