"use client";

import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { useSession } from "@/lib/auth";
import { getMyProfile } from "@/lib/profiles";
import { Profile } from "@/lib/types";

export default function ProfileGrid({ profiles }: { profiles: Profile[] }) {
  const { session, loading } = useSession();
  const [myProfileId, setMyProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !session) return;
    getMyProfile().then((profile) => setMyProfileId(profile?.id ?? null));
  }, [session, loading]);

  const visible = profiles.filter((p) => p.id !== myProfileId);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((p) => (
        <ProfileCard key={p.id} profile={p} />
      ))}
    </div>
  );
}
