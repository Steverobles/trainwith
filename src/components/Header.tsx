"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth";
import { getMyProfile } from "@/lib/profiles";
import { countPendingIncoming } from "@/lib/requests";

export default function Header() {
  const { session, loading } = useSession();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (loading || !session) return;

    (async () => {
      const profile = await getMyProfile();
      if (!profile) return;
      const count = await countPendingIncoming(profile.id);
      setPendingCount(count);
    })();
  }, [session, loading]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm shadow-blue-600/30">
            T
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-950">
            Train<span className="text-blue-600">With</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/browse" className="transition-colors hover:text-gray-950">
            Browse
          </Link>

          {loading ? null : session ? (
            <>
              <Link href="/requests" className="relative flex items-center gap-1.5 transition-colors hover:text-gray-950">
                Requests
                {pendingCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {pendingCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="transition-colors hover:text-gray-950">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gray-950 px-4 py-2 text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
