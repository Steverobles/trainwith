"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth";
import { getMyProfile } from "@/lib/profiles";
import { getRequestBetween, sendTrainingRequest, RequestListItem } from "@/lib/requests";

const buttonClass =
  "mt-6 w-full rounded-full px-5 py-3 text-center text-sm font-semibold shadow-sm transition-transform active:scale-[0.97]";

export default function RequestButton({
  toProfileId,
  toProfileHasOwner,
}: {
  toProfileId: string;
  toProfileHasOwner: boolean;
}) {
  const { session, loading: sessionLoading } = useSession();
  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [existing, setExisting] = useState<RequestListItem | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (sessionLoading || !session) return;

    (async () => {
      const profile = await getMyProfile();
      setMyProfileId(profile?.id ?? null);

      if (profile && profile.id !== toProfileId) {
        const request = await getRequestBetween(profile.id, toProfileId);
        setExisting(request);
      }
      setProfileLoading(false);
    })();
  }, [session, sessionLoading, toProfileId]);

  const ready = !sessionLoading && (!session || !profileLoading);
  const status = existing?.status ?? null;

  async function onRequest() {
    if (!myProfileId) return;
    setSending(true);
    setError(null);
    try {
      await sendTrainingRequest(myProfileId, toProfileId, note);
      setExisting({
        id: "",
        status: "pending",
        createdAt: new Date().toISOString(),
        direction: "outgoing",
        counterpartProfileId: toProfileId,
        message: note.trim() || null,
      });
    } catch {
      setError("Couldn't send that request. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (!ready) return null;

  if (!session) {
    return (
      <Link href="/login" className={`${buttonClass} block bg-gray-950 text-white hover:bg-gray-800`}>
        Log in to send a request
      </Link>
    );
  }

  if (!toProfileHasOwner) {
    return (
      <p className={`${buttonClass} cursor-default bg-gray-100 text-gray-500`}>
        Demo profile — can&apos;t send requests
      </p>
    );
  }

  if (myProfileId === toProfileId) {
    return (
      <Link href="/profile/edit" className={`${buttonClass} block bg-gray-950 text-white hover:bg-gray-800`}>
        Edit profile
      </Link>
    );
  }

  if (status === "pending") {
    return <p className={`${buttonClass} cursor-default bg-amber-50 text-amber-700`}>Request sent</p>;
  }
  if (status === "accepted" && existing) {
    return (
      <Link
        href={`/messages/${existing.id}`}
        className={`${buttonClass} block bg-emerald-600 text-white hover:bg-emerald-700`}
      >
        ✓ Connected — Message
      </Link>
    );
  }
  if (status === "declined") {
    return <p className={`${buttonClass} cursor-default bg-gray-100 text-gray-500`}>Request declined</p>;
  }

  return (
    <div className="mt-6">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note (optional) — e.g. “saw you're also working on baseline rallying, want to hit this week?”"
        rows={2}
        className="w-full resize-none rounded-2xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
      <button
        type="button"
        onClick={onRequest}
        disabled={sending}
        className="mt-2 w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-transform hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97] disabled:opacity-60"
      >
        {sending ? "Sending…" : "Request to train together"}
      </button>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
