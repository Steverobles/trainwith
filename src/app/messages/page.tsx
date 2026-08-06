"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useSession } from "@/lib/auth";
import { getMyProfile, getProfilesByIds } from "@/lib/profiles";
import { listMyRequests } from "@/lib/requests";
import { listUnreadByRequest } from "@/lib/messages";
import { Profile } from "@/lib/types";
import { sportStyles } from "@/lib/sport-style";

interface Thread {
  requestId: string;
  counterpart: Profile | undefined;
  unread: number;
}

export default function MessagesList() {
  const { session, loading: sessionLoading } = useSession();
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

      const allRequests = await listMyRequests(profile.id);
      const accepted = allRequests.filter((r) => r.status === "accepted");
      const acceptedIds = accepted.map((r) => r.id);
      const counterpartIds = accepted.map((r) => r.counterpartProfileId);

      const [counterparts, unreadMap] = await Promise.all([
        getProfilesByIds(counterpartIds),
        listUnreadByRequest(profile.id, acceptedIds),
      ]);
      const byId = new Map(counterparts.map((p) => [p.id, p]));

      setThreads(
        accepted.map((r) => ({
          requestId: r.id,
          counterpart: byId.get(r.counterpartProfileId),
          unread: unreadMap[r.id] ?? 0,
        }))
      );
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
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            No conversations yet. Accept a training request to start one.
          </div>
        )}

        <div className="mt-6 space-y-3">
          {threads.map((t) => {
            const style = t.counterpart ? sportStyles[t.counterpart.sport] : undefined;
            return (
              <Link
                key={t.requestId}
                href={`/messages/${t.requestId}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {t.counterpart && style && (
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${style.avatar}`}
                    >
                      {t.counterpart.initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {t.counterpart?.name ?? "Unknown athlete"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t.counterpart?.sport} · {t.counterpart?.focus}
                    </p>
                  </div>
                </div>
                {t.unread > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {t.unread}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
