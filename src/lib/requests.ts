import { supabase } from "./supabase";

export type RequestStatus = "pending" | "accepted" | "declined";

export interface RequestListItem {
  id: string;
  status: RequestStatus;
  createdAt: string;
  direction: "incoming" | "outgoing";
  counterpartProfileId: string;
}

export async function sendTrainingRequest(fromProfileId: string, toProfileId: string): Promise<void> {
  const { error } = await supabase
    .from("training_requests")
    .insert({ from_profile_id: fromProfileId, to_profile_id: toProfileId });
  if (error) throw error;
}

export async function respondToRequest(requestId: string, status: "accepted" | "declined"): Promise<void> {
  const { error } = await supabase.from("training_requests").update({ status }).eq("id", requestId);
  if (error) throw error;
}

export async function getRequestBetween(
  fromProfileId: string,
  toProfileId: string
): Promise<RequestListItem | null> {
  const { data, error } = await supabase
    .from("training_requests")
    .select("id, status, created_at, from_profile_id, to_profile_id")
    .eq("from_profile_id", fromProfileId)
    .eq("to_profile_id", toProfileId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    status: data.status as RequestStatus,
    createdAt: data.created_at,
    direction: "outgoing",
    counterpartProfileId: data.to_profile_id,
  };
}

export async function countPendingIncoming(myProfileId: string): Promise<number> {
  const { count, error } = await supabase
    .from("training_requests")
    .select("id", { count: "exact", head: true })
    .eq("to_profile_id", myProfileId)
    .eq("status", "pending");

  if (error) throw error;
  return count ?? 0;
}

export async function listMyRequests(myProfileId: string): Promise<RequestListItem[]> {
  const { data, error } = await supabase
    .from("training_requests")
    .select("id, status, created_at, from_profile_id, to_profile_id")
    .or(`from_profile_id.eq.${myProfileId},to_profile_id.eq.${myProfileId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((r) => ({
    id: r.id,
    status: r.status as RequestStatus,
    createdAt: r.created_at,
    direction: r.from_profile_id === myProfileId ? ("outgoing" as const) : ("incoming" as const),
    counterpartProfileId: r.from_profile_id === myProfileId ? r.to_profile_id : r.from_profile_id,
  }));
}
