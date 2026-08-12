import { supabase } from "./supabase";

export async function blockProfile(
  myProfileId: string,
  targetProfileId: string,
  reason?: string
): Promise<void> {
  const { error } = await supabase
    .from("blocks")
    .insert({ blocker_profile_id: myProfileId, blocked_profile_id: targetProfileId });
  if (error) throw error;

  const trimmedReason = reason?.trim();
  if (trimmedReason) {
    const { error: reportError } = await supabase
      .from("reports")
      .insert({ reporter_profile_id: myProfileId, reported_profile_id: targetProfileId, reason: trimmedReason });
    if (reportError) throw reportError;
  }
}

export async function getMyBlockedProfileIds(myProfileId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("blocks")
    .select("blocked_profile_id")
    .eq("blocker_profile_id", myProfileId);
  if (error) throw error;
  return (data ?? []).map((r) => r.blocked_profile_id);
}
