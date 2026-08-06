import Link from "next/link";
import { Profile, isMinorAgeBand } from "@/lib/types";
import { sportStyles } from "@/lib/sport-style";

export default function ProfileCard({ profile }: { profile: Profile }) {
  const minor = isMinorAgeBand(profile.ageBand);
  const style = sportStyles[profile.sport];

  return (
    <Link
      href={`/profile/${profile.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${style.accent}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${style.avatar}`}
            >
              {profile.initials}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-white text-[11px] shadow-sm">
              {style.icon}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-semibold text-gray-900 group-hover:text-blue-600">
                {profile.name}
              </p>
              <span className="shrink-0 rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500">
                {profile.distanceMiles} mi
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Age {profile.ageBand} · {profile.city}, {profile.state}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
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

        <p className="mt-3 line-clamp-2 text-sm text-gray-600">{profile.bio}</p>

        {minor && (
          <p className="mt-3 text-xs font-medium text-amber-700">
            {profile.guardianVerified ? "✓ Guardian verified" : "Guardian verification pending"}
          </p>
        )}
      </div>
    </Link>
  );
}
