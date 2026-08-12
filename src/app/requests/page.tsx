"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { getMyProfile, getProfilesByIds } from "@/lib/profiles";
import { listMyRequests, respondToRequest, RequestListItem } from "@/lib/requests";
import { Profile } from "@/lib/types";

interface EnrichedRequest extends RequestListItem {
  counterpart: Profile | undefined;
}

export default function Requests() {
  const { session, loading: sessionLoading } = useSession();
  const router = useRouter();
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

  async function onAccept(requestId: string) {
    setRespondingId(requestId);
    try {
      await respondToRequest(requestId, "accepted");
      router.push(`/messages/${requestId}`);
    } finally {
      setRespondingId(null);
    }
  }

  async function onDecline(requestId: string) {
    setRespondingId(requestId);
    try {
      await respondToRequest(requestId, "declined");
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "declined" } : r)));
    } finally {
      setRespondingId(null);
    }
  }

  // Accepted requests become conversations and live on the Messages tab instead.
  const visible = requests.filter((r) => r.status !== "accepted");
  const incoming = visible.filter((r) => r.direction === "incoming");
  const outgoing = visible.filter((r) => r.direction === "outgoing");

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">Requests</h1>
        <p className="mt-1 text-sm text-gray-600">
          Accepted requests move to{" "}
          <Link href="/messages" className="font-medium text-blue-600 hover:underline">
            Messages
          </Link>
          .
        </p>

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
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-gray-900">Incoming</h2>
                {incoming.length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                    {incoming.length}
                  </span>
                )}
              </div>
              {incoming.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-6 text-center text-sm text-gray-400">
                  No incoming requests yet.
                </div>
              )}
              <div className="space-y-3">
                {incoming.map((r) => (
                  <RequestRow
                    key={r.id}
                    request={r}
                    onAccept={() => onAccept(r.id)}
                    onDecline={() => onDecline(r.id)}
                    responding={respondingId === r.id}
                  />
                ))}
              </div>
            </section>

            <section className="mt-8">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-gray-900">Sent</h2>
                {outgoing.length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                    {outgoing.length}
                  </span>
                )}
              </div>
              {outgoing.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-6 text-center text-sm text-gray-400">
                  You haven&apos;t sent any requests yet.
                </div>
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

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {profile && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
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
              <p className="text-xs text-gray-500">
                {profile?.city}, {profile?.state}
              </p>
            </div>
          </div>

          {onAccept && onDecline && request.status === "pending" ? (
            <div className="flex shrink-0 gap-2">
              <button
                onClick={onAccept}
                disabled={responding}
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition-transform hover:shadow-md active:scale-[0.97] disabled:opacity-60"
              >
                Accept
              </button>
              <button
                onClick={onDecline}
                disabled={responding}
                className="rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Decline
              </button>
            </div>
          ) : (
            <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
              {request.status === "declined" ? "Declined" : "Pending"}
            </span>
          )}
        </div>

        {request.message && (
          <p className="min-w-0 break-words rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
            “{request.message}”
          </p>
        )}
      </div>
    </div>
  );
}
