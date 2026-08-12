"use client";

import { useEffect, useState } from "react";
import { sendTrainingRequest } from "@/lib/requests";

export default function RequestModal({
  myProfileId,
  toProfileId,
  toProfileName,
  onClose,
  onSent,
}: {
  myProfileId: string;
  toProfileId: string;
  toProfileName: string;
  onClose: () => void;
  onSent: () => void;
}) {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function onSend() {
    setSending(true);
    setError(null);
    try {
      await sendTrainingRequest(myProfileId, toProfileId, note);
      onSent();
    } catch {
      setError("Couldn't send that request. Please try again.");
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-bold text-gray-950">Request to train with {toProfileName}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <textarea
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional) — e.g. “want to hit this week?”"
          rows={3}
          className="mt-4 w-full resize-none rounded-2xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
        <button
          onClick={onSend}
          disabled={sending}
          className="mt-3 w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-transform active:scale-[0.97] disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send request"}
        </button>
      </div>
    </div>
  );
}
