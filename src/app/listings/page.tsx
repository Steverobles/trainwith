"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useSession } from "@/lib/auth";
import { getMyProfile } from "@/lib/profiles";
import { listPostsByProfile, createPost, deletePost } from "@/lib/posts";
import { Sport, SkillLevel, TrainingPost } from "@/lib/types";
import { sportStyles } from "@/lib/sport-style";

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

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
const labelClass = "block text-sm font-medium text-gray-700";

export default function Listings() {
  const { session, loading: sessionLoading } = useSession();
  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [posts, setPosts] = useState<TrainingPost[]>([]);
  const [ready, setReady] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [sport, setSport] = useState<Sport>("Baseball");
  const [focus, setFocus] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Rec / casual");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (sessionLoading || !session) return;

    (async () => {
      const profile = await getMyProfile();
      setMyProfileId(profile?.id ?? null);
      if (profile) {
        const items = await listPostsByProfile(profile.id);
        setPosts(items);
      }
      setReady(true);
    })();
  }, [session, sessionLoading]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!myProfileId || !focus.trim()) return;
    setSubmitting(true);
    try {
      await createPost({ profileId: myProfileId, sport, focus: focus.trim(), skillLevel });
      const items = await listPostsByProfile(myProfileId);
      setPosts(items);
      setFocus("");
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(postId: string) {
    if (!confirm("Delete this listing?")) return;
    await deletePost(postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">My Listings</h1>
            <p className="mt-1 text-sm text-gray-600">
              What you&apos;re looking for right now. Browse shows these to everyone.
            </p>
          </div>
          {myProfileId && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="self-start rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:shadow-md sm:shrink-0"
            >
              + New listing
            </button>
          )}
        </div>

        {!sessionLoading && !session && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Log in
            </Link>{" "}
            to manage your listings.
          </div>
        )}

        {session && ready && !myProfileId && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            You don&apos;t have a profile yet.
          </div>
        )}

        {showForm && (
          <form onSubmit={onCreate} className="mt-6 space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Sport</label>
                <select value={sport} onChange={(e) => setSport(e.target.value as Sport)} className={inputClass}>
                  {sports.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Skill level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                  className={inputClass}
                >
                  {skillLevels.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>What are you training?</label>
              <input
                required
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className={inputClass}
                placeholder="e.g. Long toss, ball handling, baseline rallying"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 disabled:opacity-60"
              >
                {submitting ? "Posting…" : "Post listing"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {ready && myProfileId && posts.length === 0 && !showForm && (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8 text-center">
            <p className="text-2xl">📋</p>
            <p className="mt-2 text-sm text-gray-500">
              No listings yet. Post one to show up in Browse.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {posts.map((p) => {
            const style = sportStyles[p.sport];
            return (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className={`h-1 w-full bg-gradient-to-r ${style.accent}`} />
                <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}>
                      <span>{style.icon}</span>
                      {p.sport}
                    </span>
                    <p className="text-sm font-medium text-gray-900">{p.focus}</p>
                    <span className="shrink-0 rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-500 ring-1 ring-inset ring-gray-200">
                      {p.skillLevel}
                    </span>
                  </div>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="self-start text-xs font-medium text-gray-400 hover:text-red-600 sm:self-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
