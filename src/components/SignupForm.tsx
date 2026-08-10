"use client";

import { useState } from "react";
import Link from "next/link";
import { ageBandFromBirthYear, isMinorAgeBand } from "@/lib/types";
import { signUpAndCreateProfile } from "@/lib/profiles";

const currentYear = new Date().getFullYear();
const birthYears = Array.from({ length: 90 - 13 + 1 }, (_, i) => currentYear - 13 - i);

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
const labelClass = "block text-sm font-medium text-gray-700";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState(currentYear - 16);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [bio, setBio] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minor = isMinorAgeBand(ageBandFromBirthYear(birthYear));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signUpAndCreateProfile({
        email,
        password,
        name,
        birthYear,
        city,
        state,
        bio,
        guardianName: minor ? guardianName : undefined,
        guardianEmail: minor ? guardianEmail : undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-950">
          You&apos;re on the list, {name || "athlete"}!
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {minor
            ? "Since you're under 18, we'll reach out to your parent or guardian to confirm details before your profile goes live."
            : "Your profile is ready."}
        </p>
        <Link
          href="/listings"
          className="mt-5 inline-block rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:shadow-lg"
        >
          Create your first listing
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Your name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="First name and last initial"
        />
      </div>

      <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0">
        <div>
          <label className={labelClass}>Birth year</label>
          <select
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
            className={inputClass}
          >
            {birthYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:col-span-2">
          <div className="col-span-2">
            <label className={labelClass}>City</label>
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
              placeholder="Round Rock"
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={inputClass}
              placeholder="TX"
              maxLength={2}
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>About you</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={`${inputClass} min-h-24 resize-none`}
          placeholder="What sports do you play, and what are you working toward? e.g. Varsity pitcher trying to add velocity before fall ball."
        />
      </div>

      {minor && (
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Parent / guardian info</p>
          <p className="mt-1 text-xs text-amber-800">
            Required for athletes under 18. We&apos;ll use this to verify your profile before it
            goes live.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-amber-900">Guardian name</label>
              <input
                required
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-amber-900">Guardian email</label>
              <input
                required
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-transform hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97] disabled:opacity-60"
      >
        {submitting ? "Creating profile…" : "Create profile"}
      </button>
    </form>
  );
}
