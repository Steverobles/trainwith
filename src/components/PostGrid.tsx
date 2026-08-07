"use client";

import { useEffect, useMemo, useState } from "react";
import PostCard from "./PostCard";
import { useSession } from "@/lib/auth";
import { getMyProfile } from "@/lib/profiles";
import { PostWithProfile } from "@/lib/posts";
import { milesBetween } from "@/lib/distance";

const distanceOptions = [
  { label: "Any distance", value: "" },
  { label: "Within 10 mi", value: "10" },
  { label: "Within 25 mi", value: "25" },
  { label: "Within 50 mi", value: "50" },
  { label: "Within 100 mi", value: "100" },
];

export default function PostGrid({ posts }: { posts: PostWithProfile[] }) {
  const { session, loading } = useSession();
  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [myCoords, setMyCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [maxDistance, setMaxDistance] = useState("");

  useEffect(() => {
    if (loading || !session) return;
    getMyProfile().then((profile) => {
      setMyProfileId(profile?.id ?? null);
      if (profile?.lat != null && profile?.lng != null) {
        setMyCoords({ lat: profile.lat, lng: profile.lng });
      }
    });
  }, [session, loading]);

  const results = useMemo(() => {
    const withDistance = posts
      .filter((p) => p.profile.id !== myProfileId)
      .map((p) => ({
        post: p,
        distanceMiles:
          myCoords && p.profile.lat != null && p.profile.lng != null
            ? milesBetween(myCoords.lat, myCoords.lng, p.profile.lat, p.profile.lng)
            : null,
      }));

    const filtered = maxDistance
      ? withDistance.filter((r) => r.distanceMiles !== null && r.distanceMiles <= Number(maxDistance))
      : withDistance;

    if (myCoords) {
      filtered.sort((a, b) => {
        if (a.distanceMiles === null) return 1;
        if (b.distanceMiles === null) return -1;
        return a.distanceMiles - b.distanceMiles;
      });
    }

    return filtered;
  }, [posts, myProfileId, myCoords, maxDistance]);

  return (
    <div>
      {myCoords && (
        <div className="mb-4">
          <select
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {distanceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <PostCard key={r.post.id} post={r.post} distanceMiles={r.distanceMiles} />
        ))}
      </div>

      {maxDistance && results.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white/60 p-6 text-center text-sm text-gray-400">
          No listings within {maxDistance} mi. Try widening your search.
        </div>
      )}
    </div>
  );
}
