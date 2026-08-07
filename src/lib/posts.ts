import { supabase } from "./supabase";
import { getInitials } from "./profiles";
import { Sport, SkillLevel, TrainingPost, Profile } from "./types";

const POST_COLUMNS = "id, profile_id, sport, focus, skill_level, created_at";

interface PostRow {
  id: string;
  profile_id: string;
  sport: Sport;
  focus: string;
  skill_level: SkillLevel;
  created_at: string;
}

function rowToPost(row: PostRow): TrainingPost {
  return {
    id: row.id,
    profileId: row.profile_id,
    sport: row.sport,
    focus: row.focus,
    skillLevel: row.skill_level,
    createdAt: row.created_at,
  };
}

export interface PostWithProfile extends TrainingPost {
  profile: Profile;
}

interface PostWithProfileRow extends PostRow {
  profiles: {
    id: string;
    name: string;
    age_band: Profile["ageBand"];
    birth_year: number;
    city: string;
    state: string;
    lat: number | null;
    lng: number | null;
    bio: string;
    guardian_verified: boolean;
    user_id: string | null;
  };
}

export async function listPostsWithProfiles(filters: {
  sport?: Sport;
  pool?: string;
}): Promise<PostWithProfile[]> {
  let query = supabase
    .from("training_posts")
    .select(
      `${POST_COLUMNS}, profiles!inner (id, name, age_band, birth_year, city, state, lat, lng, bio, guardian_verified, user_id)`
    )
    .order("created_at", { ascending: false });

  if (filters.sport) {
    query = query.eq("sport", filters.sport);
  }
  if (filters.pool === "teen") {
    query = query.in("profiles.age_band", ["13-15", "16-17"]);
  } else if (filters.pool === "adult") {
    query = query.in("profiles.age_band", ["18-24", "25-34", "35+"]);
  }

  const { data, error } = await query;
  if (error) throw error;

  return ((data ?? []) as unknown as PostWithProfileRow[]).map((row) => ({
    ...rowToPost(row),
    profile: {
      id: row.profiles.id,
      name: row.profiles.name,
      ageBand: row.profiles.age_band,
      birthYear: row.profiles.birth_year,
      city: row.profiles.city,
      state: row.profiles.state,
      lat: row.profiles.lat,
      lng: row.profiles.lng,
      bio: row.profiles.bio,
      initials: getInitials(row.profiles.name),
      guardianVerified: row.profiles.guardian_verified,
      userId: row.profiles.user_id,
    },
  }));
}

export async function listPostsByProfile(profileId: string): Promise<TrainingPost[]> {
  const { data, error } = await supabase
    .from("training_posts")
    .select(POST_COLUMNS)
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(rowToPost);
}

export async function createPost(input: {
  profileId: string;
  sport: Sport;
  focus: string;
  skillLevel: SkillLevel;
}): Promise<void> {
  const { error } = await supabase.from("training_posts").insert({
    profile_id: input.profileId,
    sport: input.sport,
    focus: input.focus,
    skill_level: input.skillLevel,
  });
  if (error) throw error;
}

export async function updatePost(
  postId: string,
  input: { sport: Sport; focus: string; skillLevel: SkillLevel }
): Promise<void> {
  const { error } = await supabase
    .from("training_posts")
    .update({ sport: input.sport, focus: input.focus, skill_level: input.skillLevel })
    .eq("id", postId);
  if (error) throw error;
}

export async function deletePost(postId: string): Promise<void> {
  const { error } = await supabase.from("training_posts").delete().eq("id", postId);
  if (error) throw error;
}

export async function countActivePosts(): Promise<number> {
  const { count, error } = await supabase.from("training_posts").select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}
