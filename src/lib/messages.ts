import { supabase } from "./supabase";

export interface Message {
  id: string;
  requestId: string;
  senderProfileId: string;
  body: string;
  createdAt: string;
}

export async function listMessages(requestId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, request_id, sender_profile_id, body, created_at")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((m) => ({
    id: m.id,
    requestId: m.request_id,
    senderProfileId: m.sender_profile_id,
    body: m.body,
    createdAt: m.created_at,
  }));
}

export async function sendMessage(requestId: string, senderProfileId: string, body: string): Promise<void> {
  const { error } = await supabase.from("messages").insert({
    request_id: requestId,
    sender_profile_id: senderProfileId,
    body,
  });
  if (error) throw error;
}

export async function markMessagesRead(requestId: string, myProfileId: string): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("request_id", requestId)
    .neq("sender_profile_id", myProfileId)
    .is("read_at", null);
  if (error) throw error;
}

export async function countUnreadMessages(myProfileId: string, acceptedRequestIds: string[]): Promise<number> {
  if (acceptedRequestIds.length === 0) return 0;

  const { count, error } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .in("request_id", acceptedRequestIds)
    .neq("sender_profile_id", myProfileId)
    .is("read_at", null);

  if (error) throw error;
  return count ?? 0;
}

export async function listLastMessagesByRequest(requestIds: string[]): Promise<Record<string, Message>> {
  if (requestIds.length === 0) return {};

  const { data, error } = await supabase
    .from("messages")
    .select("id, request_id, sender_profile_id, body, created_at")
    .in("request_id", requestIds)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const latest: Record<string, Message> = {};
  for (const row of data ?? []) {
    if (!latest[row.request_id]) {
      latest[row.request_id] = {
        id: row.id,
        requestId: row.request_id,
        senderProfileId: row.sender_profile_id,
        body: row.body,
        createdAt: row.created_at,
      };
    }
  }
  return latest;
}

export async function listUnreadByRequest(
  myProfileId: string,
  acceptedRequestIds: string[]
): Promise<Record<string, number>> {
  if (acceptedRequestIds.length === 0) return {};

  const { data, error } = await supabase
    .from("messages")
    .select("request_id")
    .in("request_id", acceptedRequestIds)
    .neq("sender_profile_id", myProfileId)
    .is("read_at", null);

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.request_id] = (counts[row.request_id] ?? 0) + 1;
  }
  return counts;
}
