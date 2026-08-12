"use client";

import { AVAILABILITY_OPTIONS } from "@/lib/types";

export default function AvailabilityPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(option: string) {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        When are you usually free?{" "}
        <span className="font-normal text-gray-400">(optional)</span>
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {AVAILABILITY_OPTIONS.map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
