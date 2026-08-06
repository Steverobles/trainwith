import Link from "next/link";

export default function Header() {
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
          <Link
            href="/signup"
            className="rounded-full bg-gray-950 px-4 py-2 text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
