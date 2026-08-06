"use client";

import { useState } from "react";
import { AgeBand, Sport, SkillLevel, isMinorAgeBand } from "@/lib/types";

const ageBands: AgeBand[] = ["13-15", "16-17", "18-24", "25-34", "35+"];
const sports: Sport[] = [
  "Baseball",
  "Softball",
  "Basketball",
  "Football",
  "Soccer",
  "Tennis",
  "Track & Field",
];
const skillLevels: SkillLevel[] = ["Just starting", "Rec / casual", "Competitive", "Varsity+"];

export default function SignupForm() {
  const [name, setName] = useState("");
  const [ageBand, setAgeBand] = useState<AgeBand>("16-17");
  const [sport, setSport] = useState<Sport>("Baseball");
  const [focus, setFocus] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Rec / casual");
  const [city, setCity] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const minor = isMinorAgeBand(ageBand);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-center">
        <p className="text-lg font-semibold text-gray-950">You&apos;re on the list, {name || "athlete"}!</p>
        <p className="mt-2 text-sm text-gray-600">
          {minor
            ? "Since you're under 18, we'll reach out to your parent or guardian to confirm details before your profile goes live."
            : "Your profile is ready. Head over to Browse to find a training partner."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-gray-800">Your name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-gray-400"
          placeholder="First name and last initial"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800">Age range</label>
          <select
            value={ageBand}
            onChange={(e) => setAgeBand(e.target.value as AgeBand)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-gray-400"
          >
            {ageBands.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Sport</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value as Sport)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-gray-400"
          >
            {sports.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">What are you training?</label>
        <input
          required
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-gray-400"
          placeholder="e.g. Long toss, ball handling, baseline rallying"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800">Skill level</label>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-gray-400"
          >
            {skillLevels.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">City</label>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="Round Rock, TX"
          />
        </div>
      </div>

      {minor && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Parent / guardian info</p>
          <p className="mt-1 text-xs text-amber-800">
            Required for athletes under 18. We&apos;ll use this to verify your profile before it
            goes live.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-amber-900">Guardian name</label>
              <input
                required
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-amber-900">Guardian email</label>
              <input
                required
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full rounded-full bg-gray-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
      >
        Create profile
      </button>
    </form>
  );
}
