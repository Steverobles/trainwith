import Link from "next/link";
import Header from "@/components/Header";
import SafetyBanner from "@/components/SafetyBanner";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <section className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
            Find your training partner.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Long toss, bullpen sessions, shooting reps, baseline rallies — the best training
            happens with a partner. TrainWith matches you with people nearby who are working on
            the same thing.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/browse"
              className="rounded-full bg-gray-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Browse training partners
            </Link>
            <Link
              href="/signup"
              className="rounded-full border px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-white"
            >
              Create a profile
            </Link>
          </div>
        </section>

        <section className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm font-semibold text-gray-900">1. Set what you&apos;re working on</p>
            <p className="mt-1 text-sm text-gray-600">
              Your sport, the drill you want reps on, and your skill level — long toss, ball
              handling, whatever it is.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm font-semibold text-gray-900">2. Get matched nearby</p>
            <p className="mt-1 text-sm text-gray-600">
              Browse people close to you chasing the same goal, at a similar age and skill level.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm font-semibold text-gray-900">3. Meet up and train</p>
            <p className="mt-1 text-sm text-gray-600">
              Head to a local field or court, get your reps in, and build a friendship out of it.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <SafetyBanner />
        </section>
      </main>
    </div>
  );
}
