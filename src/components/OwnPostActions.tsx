"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { getMyProfile } from "@/lib/profiles";
import { deletePost } from "@/lib/posts";

export default function OwnPostActions({ profileId, postId }: { profileId: string; postId: string }) {
  const { session } = useSession();
  const router = useRouter();
  const [isMine, setIsMine] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!session) return;
    getMyProfile().then((p) => setIsMine(p?.id === profileId));
  }, [session, profileId]);

  if (!isMine) return null;

  async function onDelete() {
    if (!confirm("Delete this listing?")) return;
    setDeleting(true);
    try {
      await deletePost(postId);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-3 border-t border-gray-100 px-4 py-2.5">
      <Link href="/listings" className="text-xs font-medium text-gray-400 hover:text-blue-600">
        Edit
      </Link>
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="text-xs font-medium text-gray-400 hover:text-red-600 disabled:opacity-60"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
