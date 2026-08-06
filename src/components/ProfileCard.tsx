import Link from "next/link";
import { Profile, isMinorAgeBand } from "@/lib/types";

export default function ProfileCard({ profile }: { profile: Profile }) {
  const minor = isMinorAgeBand(profile.ageBand);

  return (
    <Link
      href={`/profile/${profile.id}`}
      className="block rounded-2xl border bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {profile.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-gray-900">{profile.name}</p>
            <span className="shrink-0 text-xs text-gray-500">{profile.distanceMiles} mi</span>
          </div>
          <p className="text-xs text-gray-500">
            Age {profile.ageBand} · {profile.city}, {profile.state}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
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

      <p className="mt-3 line-clamp-2 text-sm text-gray-600">{profile.bio}</p>

      {minor && (
        <p className="mt-3 text-xs font-medium text-amber-700">
          {profile.guardianVerified ? "✓ Guardian verified" : "Guardian verification pending"}
        </p>
      )}
    </Link>
  );
}
