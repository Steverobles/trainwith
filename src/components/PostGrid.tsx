"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { useSession } from "@/lib/auth";
import { getMyProfile } from "@/lib/profiles";
import { PostWithProfile } from "@/lib/posts";

export default function PostGrid({ posts }: { posts: PostWithProfile[] }) {
  const { session, loading } = useSession();
  const [myProfileId, setMyProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !session) return;
    getMyProfile().then((profile) => setMyProfileId(profile?.id ?? null));
  }, [session, loading]);

  const visible = posts.filter((p) => p.profile.id !== myProfileId);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
