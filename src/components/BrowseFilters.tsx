"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Sport } from "@/lib/types";

const sports: Sport[] = [
  "Baseball",
  "Softball",
  "Basketball",
  "Football",
  "Soccer",
  "Tennis",
  "Track & Field",
];

const poolOptions = [
  { value: "teen", label: "Teens (13-17)" },
  { value: "adult", label: "Adults (18+)" },
];

export default function BrowseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sport = searchParams.get("sport") ?? "";
  const pool = searchParams.get("pool") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/browse?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={pool}
        onChange={(e) => updateParam("pool", e.target.value)}
        className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-700"
      >
        <option value="">All ages</option>
        {poolOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={sport}
        onChange={(e) => updateParam("sport", e.target.value)}
        className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-700"
      >
        <option value="">All sports</option>
        {sports.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {(sport || pool) && (
        <button
          onClick={() => router.push("/browse")}
          className="rounded-xl border px-3 py-2 text-sm text-gray-500 hover:text-gray-800"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
