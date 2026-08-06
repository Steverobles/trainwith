import { Suspense } from "react";
import Header from "@/components/Header";
import BrowseFilters from "@/components/BrowseFilters";
import ProfileGrid from "@/components/ProfileGrid";
import SafetyBanner from "@/components/SafetyBanner";
import { listProfiles } from "@/lib/profiles";
import { Sport } from "@/lib/types";

export default async function Browse({
  searchParams,
}: {
  searchParams?: Promise<{ sport?: string; pool?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const sport = sp.sport as Sport | undefined;
  const pool = sp.pool;

  const results = await listProfiles({ sport, pool });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Training partners near you
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Browse athletes looking for a training partner. Filter by sport or age group.
          </p>
        </div>

        <Suspense fallback={null}>
          <BrowseFilters />
        </Suspense>

        <div className="mt-6">
          <ProfileGrid profiles={results} />
        </div>

        {results.length === 0 && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            No training partners match those filters yet. Try widening your search.
          </div>
        )}

        <div className="mt-10">
          <SafetyBanner />
        </div>
      </main>
    </div>
  );
}
