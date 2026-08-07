"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { useSession } from "@/lib/auth";
import { getMyProfile, updateProfile } from "@/lib/profiles";
import { AgeBand } from "@/lib/types";

const ageBands: AgeBand[] = ["13-15", "16-17", "18-24", "25-34", "35+"];

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
const labelClass = "block text-sm font-medium text-gray-700";

export default function EditProfile() {
  const { session, loading: sessionLoading } = useSession();
  const router = useRouter();

  const [profileId, setProfileId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [ageBand, setAgeBand] = useState<AgeBand>("18-24");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [bio, setBio] = useState("");
  const [originalCity, setOriginalCity] = useState("");
  const [originalState, setOriginalState] = useState("");
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoading || !session) return;

    getMyProfile().then((profile) => {
      if (!profile) {
        setReady(true);
        return;
      }
      setProfileId(profile.id);
      setName(profile.name);
      setAgeBand(profile.ageBand);
      setCity(profile.city);
      setState(profile.state);
      setBio(profile.bio);
      setOriginalCity(profile.city);
      setOriginalState(profile.state);
      setReady(true);
    });
  }, [session, sessionLoading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profileId) return;
    setSubmitting(true);
    setError(null);
    try {
      const regeocode = city !== originalCity || state !== originalState;
      await updateProfile(profileId, { name, ageBand, city, state, bio, regeocode });
      router.push(`/profile/${profileId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-md px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-950">Edit profile</h1>
        </div>

        {!sessionLoading && !session && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Log in
            </Link>{" "}
            to edit your profile.
          </div>
        )}

        {session && ready && !profileId && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            You don&apos;t have a profile yet.
          </div>
        )}

        {profileId && (
          <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div>
              <label className={labelClass}>Your name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0">
              <div>
                <label className={labelClass}>Age range</label>
                <select
                  value={ageBand}
                  onChange={(e) => setAgeBand(e.target.value as AgeBand)}
                  className={inputClass}
                >
                  {ageBands.map((a) => (
                    <option key={a} value={a}>
                      {a}
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
                  />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={inputClass}
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
                placeholder="What sports do you play, and what are you working toward?"
              />
            </div>

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 disabled:opacity-60"
              >
                {submitting ? "Saving…" : "Save changes"}
              </button>
              <Link
                href={`/profile/${profileId}`}
                className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
