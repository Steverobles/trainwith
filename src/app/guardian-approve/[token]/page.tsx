import { supabaseAdmin } from "@/lib/supabase-admin";
import ApproveButton from "./ApproveButton";

export default async function GuardianApprovePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: guardian } = await supabaseAdmin
    .from("guardian_contacts")
    .select("guardian_name, approved_at, profiles (name)")
    .eq("approval_token", token)
    .maybeSingle();

  const profileName = (guardian?.profiles as unknown as { name: string } | null)?.name;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
        {!guardian ? (
          <>
            <p className="text-2xl">⚠️</p>
            <h1 className="mt-2 text-lg font-bold text-gray-950">Link not found</h1>
            <p className="mt-2 text-sm text-gray-600">
              This approval link isn&apos;t valid. It may have been mistyped — check the email again.
            </p>
          </>
        ) : guardian.approved_at ? (
          <>
            <p className="text-2xl">✓</p>
            <h1 className="mt-2 text-lg font-bold text-gray-950">Already approved</h1>
            <p className="mt-2 text-sm text-gray-600">
              {profileName ?? "This profile"}&apos;s TrainWith profile has already been approved.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-bold text-gray-950">
              Approve {profileName ?? "this"}&apos;s profile
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Hi {guardian.guardian_name}, {profileName ?? "your teen"} signed up for TrainWith to find
              a local training partner. Confirm below to approve their profile.
            </p>
            <ApproveButton token={token} profileName={profileName} />
          </>
        )}
      </div>
    </div>
  );
}
