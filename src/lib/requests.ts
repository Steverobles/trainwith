import { supabase } from "./supabase";

export type RequestStatus = "pending" | "accepted" | "declined";

export interface RequestListItem {
  id: string;
  status: RequestStatus;
  createdAt: string;
  direction: "incoming" | "outgoing";
  counterpartProfileId: string;
  message: string | null;
}

export async function sendTrainingRequest(
  fromProfileId: string,
  toProfileId: string,
  message?: string
): Promise<void> {
  const { data, error } = await supabase
    .from("training_requests")
    .insert({ from_profile_id: fromProfileId, to_profile_id: toProfileId, message: message?.trim() || null })
    .select("id")
    .single();
  if (error) throw error;

  // Best-effort: the request still exists if this fails, just without an
  // email nudge. Don't block the UI on it.
  fetch("/api/notify/new-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId: data.id }),
  }).catch(() => {});
}

export async function respondToRequest(requestId: string, status: "accepted" | "declined"): Promise<void> {
  const { error } = await supabase.from("training_requests").update({ status }).eq("id", requestId);
  if (error) throw error;
}

export async function getRequestBetween(
  myProfileId: string,
  otherProfileId: string
): Promise<RequestListItem | null> {
  const { data, error } = await supabase
    .from("training_requests")
    .select("id, status, created_at, from_profile_id, to_profile_id, message")
    .or(
      `and(from_profile_id.eq.${myProfileId},to_profile_id.eq.${otherProfileId}),and(from_profile_id.eq.${otherProfileId},to_profile_id.eq.${myProfileId})`
    )
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    status: data.status as RequestStatus,
    createdAt: data.created_at,
    direction: data.from_profile_id === myProfileId ? "outgoing" : "incoming",
    counterpartProfileId: data.from_profile_id === myProfileId ? data.to_profile_id : data.from_profile_id,
    message: data.message,
  };
}

export async function getRequestsForProfiles(
  myProfileId: string,
  otherProfileIds: string[]
): Promise<Record<string, RequestListItem>> {
  if (otherProfileIds.length === 0) return {};

  const ids = otherProfileIds.join(",");
  const { data, error } = await supabase
    .from("training_requests")
    .select("id, status, created_at, from_profile_id, to_profile_id, message")
    .or(
      `and(from_profile_id.eq.${myProfileId},to_profile_id.in.(${ids})),and(to_profile_id.eq.${myProfileId},from_profile_id.in.(${ids}))`
    );

  if (error) throw error;

  const map: Record<string, RequestListItem> = {};
  for (const r of data ?? []) {
    const counterpartId = r.from_profile_id === myProfileId ? r.to_profile_id : r.from_profile_id;
    map[counterpartId] = {
      id: r.id,
      status: r.status as RequestStatus,
      createdAt: r.created_at,
      direction: r.from_profile_id === myProfileId ? "outgoing" : "incoming",
      counterpartProfileId: counterpartId,
      message: r.message,
    };
  }
  return map;
}

export interface RequestDetail {
  id: string;
  status: RequestStatus;
  fromProfileId: string;
  toProfileId: string;
  message: string | null;
}

export async function getRequestById(id: string): Promise<RequestDetail | null> {
  const { data, error } = await supabase
    .from("training_requests")
    .select("id, status, from_profile_id, to_profile_id, message")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    status: data.status as RequestStatus,
    fromProfileId: data.from_profile_id,
    toProfileId: data.to_profile_id,
    message: data.message,
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
    .select("id, status, created_at, from_profile_id, to_profile_id, message")
    .or(`from_profile_id.eq.${myProfileId},to_profile_id.eq.${myProfileId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((r) => ({
    id: r.id,
    status: r.status as RequestStatus,
    createdAt: r.created_at,
    direction: r.from_profile_id === myProfileId ? ("outgoing" as const) : ("incoming" as const),
    counterpartProfileId: r.from_profile_id === myProfileId ? r.to_profile_id : r.from_profile_id,
    message: r.message,
  }));
}
