"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth";

export default function NewListingButton() {
  const { session, loading } = useSession();

  if (loading) return null;

  return (
    <Link
      href={session ? "/listings?new=1" : "/login"}
      className="inline-flex shrink-0 items-center gap-1 self-start rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-transform hover:shadow-md active:scale-[0.97]"
    >
      + New listing
    </Link>
  );
}
