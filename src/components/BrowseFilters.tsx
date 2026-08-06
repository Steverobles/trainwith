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

const selectClass =
  "rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";

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
        className={selectClass}
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
        className={selectClass}
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
          className="rounded-full px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-gray-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
