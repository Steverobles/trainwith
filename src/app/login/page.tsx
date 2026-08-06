import Link from "next/link";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-md px-4 py-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-950">Log in</h1>
          <p className="mt-1 text-sm text-gray-600">
            No account yet?{" "}
            <Link href="/signup" className="font-medium text-blue-600 hover:underline">
              Create a profile
            </Link>
          </p>
        </div>

        <LoginForm />
      </main>
    </div>
  );
}
