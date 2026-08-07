"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useSession } from "@/lib/auth";
import { getMyProfile, getProfilesByIds } from "@/lib/profiles";
import { listMyRequests } from "@/lib/requests";
import { listUnreadByRequest, listLastMessagesByRequest, Message } from "@/lib/messages";
import { Profile } from "@/lib/types";
import { sportStyles } from "@/lib/sport-style";
import { formatRelativeTime } from "@/lib/format";

interface Thread {
  requestId: string;
  requestCreatedAt: string;
  counterpart: Profile | undefined;
  unread: number;
  lastMessage: Message | undefined;
}

export default function MessagesList() {
  const { session, loading: sessionLoading } = useSession();
  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (sessionLoading || !session) return;

    (async () => {
      const profile = await getMyProfile();
      if (!profile) {
        setReady(true);
        return;
      }
      setMyProfileId(profile.id);

      const allRequests = await listMyRequests(profile.id);
      const accepted = allRequests.filter((r) => r.status === "accepted");
      const acceptedIds = accepted.map((r) => r.id);
      const counterpartIds = accepted.map((r) => r.counterpartProfileId);

      const [counterparts, unreadMap, lastMessageMap] = await Promise.all([
        getProfilesByIds(counterpartIds),
        listUnreadByRequest(profile.id, acceptedIds),
        listLastMessagesByRequest(acceptedIds),
      ]);
      const byId = new Map(counterparts.map((p) => [p.id, p]));

      const enriched = accepted.map((r) => ({
        requestId: r.id,
        requestCreatedAt: r.createdAt,
        counterpart: byId.get(r.counterpartProfileId),
        unread: unreadMap[r.id] ?? 0,
        lastMessage: lastMessageMap[r.id],
      }));

      enriched.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt ?? a.requestCreatedAt;
        const bTime = b.lastMessage?.createdAt ?? b.requestCreatedAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      setThreads(enriched);
      setReady(true);
    })();
  }, [session, sessionLoading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">Messages</h1>

        {!sessionLoading && !session && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Log in
            </Link>{" "}
            to see your conversations.
          </div>
        )}

        {ready && session && threads.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8 text-center">
            <p className="text-2xl">💬</p>
            <p className="mt-2 text-sm text-gray-500">
              No conversations yet. Accept a training request to start one.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {threads.map((t) => {
            const style = t.counterpart ? sportStyles[t.counterpart.sport] : undefined;
            const time = t.lastMessage?.createdAt ?? t.requestCreatedAt;
            return (
              <Link
                key={t.requestId}
                href={`/messages/${t.requestId}`}
                className="block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {style && <div className={`h-1 w-full bg-gradient-to-r ${style.accent}`} />}
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {t.counterpart && style && (
                      <div className="relative shrink-0">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${style.avatar}`}
                        >
                          {t.counterpart.initials}
                        </div>
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-white text-[9px] shadow-sm">
                          {style.icon}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
                        {t.counterpart?.name ?? "Unknown athlete"}
                      </p>
                      {t.lastMessage ? (
                        <p className="truncate text-sm text-gray-500">
                          {t.lastMessage.senderProfileId === myProfileId && (
                            <span className="text-gray-400">You: </span>
                          )}
                          {t.lastMessage.body}
                        </p>
                      ) : (
                        <p className="truncate text-xs text-gray-500">
                          {t.counterpart?.sport} · {t.counterpart?.focus}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-xs text-gray-400">{formatRelativeTime(time)}</span>
                    {t.unread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                        {t.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
