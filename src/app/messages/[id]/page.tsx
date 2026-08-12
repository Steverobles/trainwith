"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "@/lib/auth";
import { getMyProfile, getProfilesByIds } from "@/lib/profiles";
import { getRequestById } from "@/lib/requests";
import { listMessages, sendMessage, markMessagesRead, Message } from "@/lib/messages";
import { Profile } from "@/lib/types";
import ReportBlockButton from "@/components/ReportBlockButton";

const POLL_MS = 4000;

export default function MessageThread() {
  const { id } = useParams<{ id: string }>();
  const { session, loading: sessionLoading } = useSession();

  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [counterpart, setCounterpart] = useState<Profile | null>(null);
  const [requestNote, setRequestNote] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState(false);
  const [notAllowed, setNotAllowed] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setRequestNote(request.message);

      const msgs = await listMessages(id);
      if (cancelled) return;
      setMessages(msgs);
      setReady(true);
      markMessagesRead(id, profile.id);
    })();

    return () => {
      cancelled = true;
    };
  }, [session, sessionLoading, id]);

  useEffect(() => {
    if (!ready || notAllowed || !myProfileId) return;

    const interval = setInterval(() => {
      listMessages(id).then((msgs) => {
        setMessages(msgs);
        markMessagesRead(id, myProfileId);
      });
    }, POLL_MS);

    return () => clearInterval(interval);
  }, [ready, notAllowed, id, myProfileId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [text]);

  async function handleSend() {
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSend();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
        <Link href="/messages" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-800">
          ← Back to messages
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
            <div className="mt-4 flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />

              {counterpart && (
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4">
                  <Link
                    href={`/profile/${counterpart.id}`}
                    className="flex min-w-0 items-center gap-3 transition-colors hover:opacity-80"
                  >
                    {counterpart.avatarUrl ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <Image src={counterpart.avatarUrl} alt="" fill sizes="40px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                        {counterpart.initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">{counterpart.name}</p>
                      <p className="text-xs text-gray-500">
                        {counterpart.city}, {counterpart.state}
                      </p>
                    </div>
                  </Link>
                  <div className="shrink-0">
                    <ReportBlockButton toProfileId={counterpart.id} />
                  </div>
                </div>
              )}

              <div className="flex min-h-80 flex-1 flex-col gap-2 overflow-y-auto p-4">
                {requestNote && (
                  <div className="mb-1 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-900">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                      Original request
                    </p>
                    <p className="mt-0.5 min-w-0 break-words">“{requestNote}”</p>
                  </div>
                )}
                {messages.length === 0 && (
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-sm text-gray-400">Say hey and set up your first session.</p>
                  </div>
                )}
                {messages.map((m) => {
                  const mine = m.senderProfileId === myProfileId;
                  return (
                    <div key={m.id} className={`flex min-w-0 ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        title={new Date(m.createdAt).toLocaleString()}
                        className={`max-w-[75%] break-words rounded-2xl px-3.5 py-2 text-sm ${
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
            </div>

            <form onSubmit={onSubmit} className="mt-3 flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Message…"
                rows={1}
                className="max-h-32 flex-1 resize-none break-words rounded-2xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                className="shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-transform active:scale-[0.97] disabled:opacity-60"
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
