"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth";
import { getMyProfile } from "@/lib/profiles";
import { listMyRequests } from "@/lib/requests";
import { countUnreadMessages } from "@/lib/messages";

function NavBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
      {count}
    </span>
  );
}

const navLinkClass =
  "rounded-full px-3 py-1.5 transition-colors hover:bg-gray-100 hover:text-gray-950";
const mobileNavLinkClass =
  "flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100";

export default function Header() {
  const { session, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (loading || !session) return;

    (async () => {
      const profile = await getMyProfile();
      if (!profile) return;

      const allRequests = await listMyRequests(profile.id);
      const pending = allRequests.filter(
        (r) => r.direction === "incoming" && r.status === "pending"
      ).length;
      const acceptedIds = allRequests.filter((r) => r.status === "accepted").map((r) => r.id);
      const unread = await countUnreadMessages(profile.id, acceptedIds);

      setPendingCount(pending);
      setUnreadCount(unread);
    })();
    // Header now lives in the persistent root layout (doesn't remount per
    // page), so refetch explicitly on route change to keep badges current —
    // this used to happen for free via remounting.
  }, [session, loading, pathname]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  const alertTotal = pendingCount + unreadCount;

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

        {/* Desktop nav — unchanged above the md breakpoint */}
        <nav className="hidden items-center gap-1 text-sm font-medium text-gray-600 md:flex">
          <Link href="/browse" className={navLinkClass}>
            Browse
          </Link>

          {loading ? null : session ? (
            <>
              <Link href="/profile/me" className={navLinkClass}>
                Profile
              </Link>
              <Link href="/listings" className={navLinkClass}>
                Listings
              </Link>
              <Link href="/requests" className={`relative flex items-center gap-1.5 ${navLinkClass}`}>
                Requests
                <NavBadge count={pendingCount} />
              </Link>
              <Link href="/messages" className={`relative flex items-center gap-1.5 ${navLinkClass}`}>
                Messages
                <NavBadge count={unreadCount} />
              </Link>
              <button
                onClick={handleSignOut}
                className="ml-2 rounded-full border border-gray-300 px-4 py-1.5 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={navLinkClass}>
                Log in
              </Link>
              <Link
                href="/signup"
                className="ml-2 rounded-full bg-gray-950 px-4 py-1.5 text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger — hidden at md and above */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          )}
          {!menuOpen && alertTotal > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            <Link href="/browse" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
              Browse
            </Link>

            {loading ? null : session ? (
              <>
                <Link href="/profile/me" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link href="/listings" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                  Listings
                </Link>
                <Link href="/requests" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                  Requests
                  <NavBadge count={pendingCount} />
                </Link>
                <Link href="/messages" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                  Messages
                  <NavBadge count={unreadCount} />
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleSignOut();
                  }}
                  className="mt-1 rounded-xl border border-gray-300 px-3 py-2.5 text-left text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="mt-1 rounded-xl bg-gray-950 px-3 py-2.5 text-center text-base font-medium text-white hover:bg-gray-800"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
