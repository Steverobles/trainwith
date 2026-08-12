import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SafetyBanner from "@/components/SafetyBanner";
import RequestButton from "@/components/RequestButton";
import { getProfile } from "@/lib/profiles";
import { listPostsByProfile } from "@/lib/posts";
import { isMinorAgeBand } from "@/lib/types";
import { sportStyles } from "@/lib/sport-style";

export default async function ProfileDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) notFound();

  const posts = await listPostsByProfile(id);
  const minor = isMinorAgeBand(profile.ageBand);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/browse"
          className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          ← Back to browse
        </Link>

        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
                {profile.initials}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold tracking-tight text-gray-950">{profile.name}</h1>
                <p className="text-sm text-gray-500">
                  Age {profile.ageBand} · {profile.city}, {profile.state}
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

            {profile.bio && (
              <p className="mt-4 break-words text-sm leading-relaxed text-gray-700">{profile.bio}</p>
            )}

            <RequestButton toProfileId={profile.id} toProfileHasOwner={profile.userId !== null} />
          </div>
        </div>

        {posts.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-sm font-semibold tracking-tight text-gray-900">
              Looking for a partner
            </h2>
            <div className="space-y-3">
              {posts.map((p) => {
                const style = sportStyles[p.sport];
                return (
                  <div key={p.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="relative h-24 w-full overflow-hidden">
                      <Image
                        src={style.image}
                        alt={p.sport}
                        fill
                        sizes="(max-width: 640px) 100vw, 640px"
                        className="object-cover"
                      />
                      <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${style.accent}`} />
                    </div>
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5 p-4">
                      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}>
                        <span>{style.icon}</span>
                        {p.sport}
                      </span>
                      <span className="min-w-0 break-words text-sm font-medium text-gray-900">{p.focus}</span>
                      <span className="shrink-0 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                        {p.skillLevel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6">
          <SafetyBanner compact={minor} />
        </div>
      </main>
    </div>
  );
}
