"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useSession } from "@/lib/auth";
import { getMyProfile } from "@/lib/profiles";

export default function MyProfile() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/login");
      return;
    }

    getMyProfile().then((profile) => {
      router.replace(profile ? `/profile/${profile.id}` : "/signup");
    });
  }, [session, loading, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8 text-sm text-gray-500">Loading your profile…</main>
    </div>
  );
}
