import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Train<span className="text-blue-600">With</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-gray-700">
          <Link href="/browse" className="hover:text-gray-950">
            Browse
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-gray-950 px-4 py-2 text-white hover:bg-gray-800"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
