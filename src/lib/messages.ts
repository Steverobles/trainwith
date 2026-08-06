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
