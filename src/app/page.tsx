import Link from "next/link";
import Header from "@/components/Header";
import SafetyBanner from "@/components/SafetyBanner";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="relative mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden"
        >
          <div className="h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="-ml-16 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        </div>

        <section className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Now matching in Austin, TX
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
            Find your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              training partner.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600">
            Long toss, bullpen sessions, shooting reps, baseline rallies — the best training
            happens with a partner. TrainWith matches you with people nearby who are working on
            the same thing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/browse"
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Browse training partners
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              Create a profile
            </Link>
          </div>
        </section>

        <section className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              1
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-900">
              Set what you&apos;re working on
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Your sport, the drill you want reps on, and your skill level — long toss, ball
              handling, whatever it is.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              2
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-900">Get matched nearby</p>
            <p className="mt-1 text-sm text-gray-600">
              Browse people close to you chasing the same goal, at a similar age and skill level.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
              3
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-900">Meet up and train</p>
            <p className="mt-1 text-sm text-gray-600">
              Head to a local field or court, get your reps in, and build a friendship out of it.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <SafetyBanner />
        </section>
      </main>
    </div>
  );
}
