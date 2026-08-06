import { Suspense } from "react";
import Header from "@/components/Header";
import BrowseFilters from "@/components/BrowseFilters";
import ProfileCard from "@/components/ProfileCard";
import SafetyBanner from "@/components/SafetyBanner";
import { mockProfiles } from "@/lib/mock-profiles";
import { isMinorAgeBand, Sport } from "@/lib/types";

export default async function Browse({
  searchParams,
}: {
  searchParams?: Promise<{ sport?: string; pool?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const sport = sp.sport as Sport | undefined;
  const pool = sp.pool;

  const results = mockProfiles
    .filter((p) => (sport ? p.sport === sport : true))
    .filter((p) => {
      if (pool === "teen") return isMinorAgeBand(p.ageBand);
      if (pool === "adult") return !isMinorAgeBand(p.ageBand);
      return true;
    })
    .sort((a, b) => a.distanceMiles - b.distanceMiles);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Training partners near you</h1>
          <p className="mt-1 text-sm text-gray-600">
            Showing sample profiles around Austin, TX. Filter by sport or age group.
          </p>
        </div>

        <Suspense fallback={null}>
          <BrowseFilters />
        </Suspense>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="mt-6 rounded-2xl border bg-white p-6 text-sm text-gray-600">
            No training partners match those filters yet. Try widening your search.
          </div>
        )}

        <div className="mt-8">
          <SafetyBanner />
        </div>
      </main>
    </div>
  );
}
