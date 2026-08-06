import Header from "@/components/Header";
import SignupForm from "@/components/SignupForm";

export default function Signup() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-md px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create your profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Tell us what you&apos;re training for and we&apos;ll help you find a partner nearby.
          </p>
        </div>

        <SignupForm />
      </main>
    </div>
  );
}
