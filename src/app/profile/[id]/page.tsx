import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SafetyBanner from "@/components/SafetyBanner";
import { mockProfiles } from "@/lib/mock-profiles";
import { isMinorAgeBand } from "@/lib/types";
import { sportStyles } from "@/lib/sport-style";

export default async function ProfileDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = mockProfiles.find((p) => p.id === id);
  if (!profile) notFound();

  const minor = isMinorAgeBand(profile.ageBand);
  const style = sportStyles[profile.sport];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/browse"
          className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          ← Back to browse
        </Link>

        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className={`h-2 w-full bg-gradient-to-r ${style.accent}`} />
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold ${style.avatar}`}
                >
                  {profile.initials}
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white text-xs shadow-sm">
                  {style.icon}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold tracking-tight text-gray-950">{profile.name}</h1>
                <p className="text-sm text-gray-500">
                  Age {profile.ageBand} · {profile.city}, {profile.state} ·{" "}
                  {profile.distanceMiles} mi away
                </p>
                {minor && (
                  <p className="mt-1 text-xs font-medium text-amber-700">
                    {profile.guardianVerified
                      ? "✓ Guardian verified"
                      : "Guardian verification pending"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}>
                <span>{style.icon}</span>
                {profile.sport}
              </span>
              <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                {profile.focus}
              </span>
              <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                {profile.skillLevel}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-700">{profile.bio}</p>

            <button
              type="button"
              className="mt-6 w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Request to train together
            </button>
          </div>
        </div>

        <div className="mt-6">
          <SafetyBanner compact={minor} />
        </div>
      </main>
    </div>
  );
}
