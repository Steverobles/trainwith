"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { getMyProfile } from "@/lib/profiles";
import { blockProfile } from "@/lib/moderation";

export default function ReportBlockButton({ toProfileId }: { toProfileId: string }) {
  const { session } = useSession();
  const router = useRouter();
  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!session) return;
    getMyProfile().then((p) => setMyProfileId(p?.id ?? null));
  }, [session]);

  if (!session || !myProfileId || myProfileId === toProfileId) return null;

  async function onBlock() {
    if (!myProfileId) return;
    setSubmitting(true);
    setError(null);
    try {
      await blockProfile(myProfileId, toProfileId, reason);
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-gray-400 hover:text-red-600"
      >
        Report or block
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:pb-5"
            onClick={(e) => e.stopPropagation()}
          >
            {done ? (
              <>
                <p className="text-base font-bold text-gray-950">Blocked</p>
                <p className="mt-2 text-sm text-gray-600">
                  You won&apos;t see them in Browse, and neither of you can send new requests.
                </p>
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/browse");
                  }}
                  className="mt-4 w-full rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-bold text-gray-950">Report or block</h2>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="shrink-0 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Blocking hides them from your Browse and stops either of you from sending new requests.
                </p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="What happened? (optional, helps us review)"
                  rows={3}
                  className="mt-3 w-full resize-none rounded-2xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
                <button
                  onClick={onBlock}
                  disabled={submitting}
                  className="mt-3 w-full rounded-full bg-red-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.97] disabled:opacity-60"
                >
                  {submitting ? "Blocking…" : "Block this person"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
