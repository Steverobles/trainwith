import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SafetyBanner from "@/components/SafetyBanner";
import { mockProfiles } from "@/lib/mock-profiles";
import { isMinorAgeBand } from "@/lib/types";

export default async function ProfileDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = mockProfiles.find((p) => p.id === id);
  if (!profile) notFound();

  const minor = isMinorAgeBand(profile.ageBand);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/browse" className="text-sm text-gray-500 hover:text-gray-800">
          ← Back to browse
        </Link>

        <div className="mt-4 rounded-2xl border bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
              {profile.initials}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-gray-950">{profile.name}</h1>
              <p className="text-sm text-gray-500">
                Age {profile.ageBand} · {profile.city}, {profile.state} · {profile.distanceMiles}{" "}
                mi away
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
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              {profile.sport}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              {profile.focus}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              {profile.skillLevel}
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-700">{profile.bio}</p>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-gray-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Request to train together
          </button>
        </div>

        <div className="mt-6">
          <SafetyBanner compact={minor} />
        </div>
      </main>
    </div>
  );
}
