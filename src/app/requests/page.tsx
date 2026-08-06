"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useSession } from "@/lib/auth";
import { getMyProfile, getProfilesByIds } from "@/lib/profiles";
import { listMyRequests, respondToRequest, RequestListItem } from "@/lib/requests";
import { Profile } from "@/lib/types";
import { sportStyles } from "@/lib/sport-style";

interface EnrichedRequest extends RequestListItem {
  counterpart: Profile | undefined;
}

export default function Requests() {
  const { session, loading: sessionLoading } = useSession();
  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [requests, setRequests] = useState<EnrichedRequest[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoading || !session) return;

    (async () => {
      const myProfile = await getMyProfile();
      setMyProfileId(myProfile?.id ?? null);
      if (!myProfile) {
        setProfileLoading(false);
        return;
      }

      const items = await listMyRequests(myProfile.id);
      const counterpartIds = items.map((r) => r.counterpartProfileId);
      const counterparts = await getProfilesByIds(counterpartIds);
      const byId = new Map(counterparts.map((p) => [p.id, p]));

      setRequests(items.map((r) => ({ ...r, counterpart: byId.get(r.counterpartProfileId) })));
      setProfileLoading(false);
    })();
  }, [session, sessionLoading]);

  async function onRespond(requestId: string, status: "accepted" | "declined") {
    setRespondingId(requestId);
    try {
      await respondToRequest(requestId, status);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status } : r)));
    } finally {
      setRespondingId(null);
    }
  }

  const incoming = requests.filter((r) => r.direction === "incoming");
  const outgoing = requests.filter((r) => r.direction === "outgoing");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">Requests</h1>

        {!sessionLoading && !session && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Log in
            </Link>{" "}
            to see your training requests.
          </div>
        )}

        {session && !profileLoading && !myProfileId && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            You don&apos;t have a profile yet.
          </div>
        )}

        {session && myProfileId && (
          <>
            <section className="mt-6">
              <h2 className="mb-3 text-sm font-semibold tracking-tight text-gray-900">Incoming</h2>
              {incoming.length === 0 && (
                <p className="text-sm text-gray-500">No incoming requests yet.</p>
              )}
              <div className="space-y-3">
                {incoming.map((r) => (
                  <RequestRow
                    key={r.id}
                    request={r}
                    onAccept={() => onRespond(r.id, "accepted")}
                    onDecline={() => onRespond(r.id, "declined")}
                    responding={respondingId === r.id}
                  />
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="mb-3 text-sm font-semibold tracking-tight text-gray-900">Sent</h2>
              {outgoing.length === 0 && (
                <p className="text-sm text-gray-500">You haven&apos;t sent any requests yet.</p>
              )}
              <div className="space-y-3">
                {outgoing.map((r) => (
                  <RequestRow key={r.id} request={r} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function RequestRow({
  request,
  onAccept,
  onDecline,
  responding,
}: {
  request: EnrichedRequest;
  onAccept?: () => void;
  onDecline?: () => void;
  responding?: boolean;
}) {
  const profile = request.counterpart;
  const style = profile ? sportStyles[profile.sport] : undefined;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        {profile && style && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${style.avatar}`}>
            {profile.initials}
          </div>
        )}
        <div className="min-w-0">
          <Link
            href={profile ? `/profile/${profile.id}` : "#"}
            className="truncate font-semibold text-gray-900 hover:text-blue-600"
          >
            {profile?.name ?? "Unknown athlete"}
          </Link>
          <p className="text-xs text-gray-500">{profile?.sport}</p>
        </div>
      </div>

      {onAccept && onDecline && request.status === "pending" ? (
        <div className="flex shrink-0 gap-2">
          <button
            onClick={onAccept}
            disabled={responding}
            className="rounded-full bg-gray-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            Accept
          </button>
          <button
            onClick={onDecline}
            disabled={responding}
            className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Decline
          </button>
        </div>
      ) : (
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            request.status === "accepted"
              ? "bg-emerald-50 text-emerald-700"
              : request.status === "declined"
                ? "bg-gray-100 text-gray-500"
                : "bg-amber-50 text-amber-700"
          }`}
        >
          {request.status === "accepted" ? "✓ Connected" : request.status === "declined" ? "Declined" : "Pending"}
        </span>
      )}
    </div>
  );
}
