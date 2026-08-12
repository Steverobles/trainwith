"use client";

import { useState } from "react";

export default function ApproveButton({
  token,
  profileName,
}: {
  token: string;
  profileName?: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function onApprove() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/guardian/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="mt-4 text-sm font-medium text-emerald-700">
        ✓ Approved. {profileName ?? "Their"} profile is now visible on TrainWith.
      </p>
    );
  }

  return (
    <>
      <button
        onClick={onApprove}
        disabled={status === "submitting"}
        className="mt-4 w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-transform active:scale-[0.97] disabled:opacity-60"
      >
        {status === "submitting" ? "Approving…" : "I approve this profile"}
      </button>
      {status === "error" && (
        <p className="mt-2 text-xs font-medium text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
    </>
  );
}
