import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  const { data: guardian, error: guardianError } = await supabaseAdmin
    .from("guardian_contacts")
    .select("profile_id, approved_at")
    .eq("approval_token", token)
    .maybeSingle();

  if (guardianError) {
    return NextResponse.json({ error: guardianError.message }, { status: 500 });
  }
  if (!guardian) {
    return NextResponse.json({ error: "This approval link is invalid." }, { status: 404 });
  }
  if (guardian.approved_at) {
    return NextResponse.json({ ok: true, alreadyApproved: true });
  }

  const { error: approveError } = await supabaseAdmin
    .from("guardian_contacts")
    .update({ approved_at: new Date().toISOString() })
    .eq("approval_token", token);
  if (approveError) {
    return NextResponse.json({ error: approveError.message }, { status: 500 });
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({ guardian_verified: true })
    .eq("id", guardian.profile_id);
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, alreadyApproved: false });
}
