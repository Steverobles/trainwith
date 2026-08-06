"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth";
import { getMyProfile } from "@/lib/profiles";
import { getRequestBetween, sendTrainingRequest, RequestStatus } from "@/lib/requests";

const buttonClass =
  "mt-6 w-full rounded-full px-5 py-3 text-center text-sm font-semibold shadow-sm transition-transform";

export default function RequestButton({
  toProfileId,
  toProfileHasOwner,
}: {
  toProfileId: string;
  toProfileHasOwner: boolean;
}) {
  const { session, loading: sessionLoading } = useSession();
  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [status, setStatus] = useState<RequestStatus | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoading || !session) return;

    (async () => {
      const profile = await getMyProfile();
      setMyProfileId(profile?.id ?? null);

      if (profile && profile.id !== toProfileId) {
        const existing = await getRequestBetween(profile.id, toProfileId);
        setStatus(existing?.status ?? null);
      }
      setProfileLoading(false);
    })();
  }, [session, sessionLoading, toProfileId]);

  const ready = !sessionLoading && (!session || !profileLoading);

  async function onRequest() {
    if (!myProfileId) return;
    setSending(true);
    setError(null);
    try {
      await sendTrainingRequest(myProfileId, toProfileId);
      setStatus("pending");
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
    return <p className={`${buttonClass} cursor-default bg-gray-100 text-gray-500`}>This is your profile</p>;
  }

  if (status === "pending") {
    return <p className={`${buttonClass} cursor-default bg-amber-50 text-amber-700`}>Request sent</p>;
  }
  if (status === "accepted") {
    return <p className={`${buttonClass} cursor-default bg-emerald-50 text-emerald-700`}>✓ Connected</p>;
  }
  if (status === "declined") {
    return <p className={`${buttonClass} cursor-default bg-gray-100 text-gray-500`}>Request declined</p>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={onRequest}
        disabled={sending}
        className={`${buttonClass} w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/20 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60`}
      >
        {sending ? "Sending…" : "Request to train together"}
      </button>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
