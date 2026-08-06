"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { useSession } from "@/lib/auth";
import { getMyProfile, getProfilesByIds } from "@/lib/profiles";
import { getRequestById } from "@/lib/requests";
import { listMessages, sendMessage, Message } from "@/lib/messages";
import { Profile } from "@/lib/types";
import { sportStyles } from "@/lib/sport-style";

const POLL_MS = 4000;

export default function MessageThread() {
  const { id } = useParams<{ id: string }>();
  const { session, loading: sessionLoading } = useSession();

  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [counterpart, setCounterpart] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState(false);
  const [notAllowed, setNotAllowed] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionLoading || !session) return;

    let cancelled = false;

    (async () => {
      const profile = await getMyProfile();
      if (cancelled) return;
      if (!profile) {
        setNotAllowed(true);
        setReady(true);
        return;
      }
      setMyProfileId(profile.id);

      const request = await getRequestById(id);
      if (cancelled) return;
      if (!request || request.status !== "accepted") {
        setNotAllowed(true);
        setReady(true);
        return;
      }

      const counterpartId = request.fromProfileId === profile.id ? request.toProfileId : request.fromProfileId;
      const counterparts = await getProfilesByIds([counterpartId]);
      if (cancelled) return;
      setCounterpart(counterparts[0] ?? null);

      const msgs = await listMessages(id);
      if (cancelled) return;
      setMessages(msgs);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [session, sessionLoading, id]);

  useEffect(() => {
    if (!ready || notAllowed) return;

    const interval = setInterval(() => {
      listMessages(id).then(setMessages);
    }, POLL_MS);

    return () => clearInterval(interval);
  }, [ready, notAllowed, id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!myProfileId || !body) return;
    setSending(true);
    try {
      await sendMessage(id, myProfileId, body);
      setText("");
      const msgs = await listMessages(id);
      setMessages(msgs);
    } finally {
      setSending(false);
    }
  }

  const style = counterpart ? sportStyles[counterpart.sport] : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
        <Link href="/requests" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-800">
          ← Back to requests
        </Link>

        {!sessionLoading && !session && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Log in
            </Link>{" "}
            to view this conversation.
          </div>
        )}

        {ready && notAllowed && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            You don&apos;t have access to this conversation.
          </div>
        )}

        {ready && !notAllowed && (
          <>
            {counterpart && style && (
              <div className="mt-4 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${style.avatar}`}
                >
                  {counterpart.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{counterpart.name}</p>
                  <p className="text-xs text-gray-500">
                    {counterpart.sport} · {counterpart.focus}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 flex min-h-80 flex-1 flex-col gap-2 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              {messages.length === 0 && (
                <p className="text-sm text-gray-400">Say hey and set up your first session.</p>
              )}
              {messages.map((m) => {
                const mine = m.senderProfileId === myProfileId;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                        mine ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {m.body}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={onSend} className="mt-3 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Message…"
                className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 disabled:opacity-60"
              >
                Send
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
