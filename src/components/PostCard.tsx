import Image from "next/image";
import Link from "next/link";
import { isMinorAgeBand } from "@/lib/types";
import { PostWithProfile } from "@/lib/posts";
import { sportStyles } from "@/lib/sport-style";
import { RequestListItem } from "@/lib/requests";

export default function PostCard({
  post,
  distanceMiles,
  myProfileId,
  loggedIn,
  existingRequest,
  onRequestClick,
}: {
  post: PostWithProfile;
  distanceMiles?: number | null;
  myProfileId: string | null;
  loggedIn: boolean;
  existingRequest?: RequestListItem;
  onRequestClick: () => void;
}) {
  const { profile } = post;
  const minor = isMinorAgeBand(profile.ageBand);
  const style = sportStyles[post.sport];

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/profile/${profile.id}`} className="block">
        <div className="relative h-28 w-full overflow-hidden">
          <Image
            src={style.image}
            alt={post.sport}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className={`absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${style.accent}`} />
        </div>
        <div className="p-4 pb-0">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              {profile.avatarUrl ? (
                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image src={profile.avatarUrl} alt="" fill sizes="44px" className="object-cover" />
                </div>
              ) : (
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${style.avatar}`}
                >
                  {profile.initials}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-white text-[11px] shadow-sm">
                {style.icon}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-semibold text-gray-900 group-hover:text-blue-600">
                  {profile.name}
                </p>
                {distanceMiles != null && (
                  <span className="shrink-0 rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500">
                    {distanceMiles < 1 ? "<1 mi" : `${Math.round(distanceMiles)} mi`}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Age {profile.ageBand} · {profile.city}, {profile.state}
              </p>
            </div>
          </div>

          <div className="mt-3 flex min-w-0 flex-wrap gap-1.5">
            <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}>
              <span>{style.icon}</span>
              {post.sport}
            </span>
            <span className="min-w-0 break-words rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
              {post.focus}
            </span>
            <span className="shrink-0 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
              {post.skillLevel}
            </span>
          </div>

          {profile.availability.length > 0 && (
            <p className="mt-2 truncate text-xs text-gray-400">
              🕐 {profile.availability.join(" · ")}
            </p>
          )}

          {minor && (
            <p className="mt-3 text-xs font-medium text-amber-700">
              {profile.guardianVerified ? "✓ Guardian verified" : "Guardian verification pending"}
            </p>
          )}
        </div>
      </Link>

      <div className="p-4 pt-3">
        <RequestFooter
          profileHasOwner={profile.userId !== null}
          myProfileId={myProfileId}
          loggedIn={loggedIn}
          existingRequest={existingRequest}
          onRequestClick={onRequestClick}
        />
      </div>
    </div>
  );
}

function RequestFooter({
  profileHasOwner,
  myProfileId,
  loggedIn,
  existingRequest,
  onRequestClick,
}: {
  profileHasOwner: boolean;
  myProfileId: string | null;
  loggedIn: boolean;
  existingRequest?: RequestListItem;
  onRequestClick: () => void;
}) {
  const smallButtonClass =
    "block w-full rounded-full px-4 py-2 text-center text-xs font-semibold shadow-sm transition-transform active:scale-[0.97]";

  if (!profileHasOwner) {
    return <p className={`${smallButtonClass} cursor-default bg-gray-50 text-gray-400`}>Demo profile</p>;
  }

  if (!loggedIn) {
    return (
      <Link
        href="/login"
        className={`${smallButtonClass} bg-gray-950 text-white hover:bg-gray-800`}
      >
        Log in to request
      </Link>
    );
  }

  if (!myProfileId) return null;

  if (existingRequest?.status === "pending") {
    return <p className={`${smallButtonClass} cursor-default bg-amber-50 text-amber-700`}>Request sent</p>;
  }
  if (existingRequest?.status === "accepted") {
    return (
      <Link
        href={`/messages/${existingRequest.id}`}
        className={`${smallButtonClass} bg-emerald-600 text-white hover:bg-emerald-700`}
      >
        ✓ Connected — Message
      </Link>
    );
  }
  if (existingRequest?.status === "declined") {
    return <p className={`${smallButtonClass} cursor-default bg-gray-50 text-gray-400`}>Request declined</p>;
  }

  return (
    <button
      type="button"
      onClick={onRequestClick}
      className={`${smallButtonClass} bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/20 hover:shadow-md`}
    >
      Request to train
    </button>
  );
}
