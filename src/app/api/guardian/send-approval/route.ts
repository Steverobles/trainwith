import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const { profileId } = await request.json();
  if (!profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 });
  }

  const { data: guardian, error: guardianError } = await supabaseAdmin
    .from("guardian_contacts")
    .select("guardian_name, guardian_email")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (guardianError) {
    return NextResponse.json({ error: guardianError.message }, { status: 500 });
  }
  if (!guardian) {
    return NextResponse.json({ error: "No guardian contact found for this profile" }, { status: 404 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("name")
    .eq("id", profileId)
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const token = randomUUID();
  const { error: updateError } = await supabaseAdmin
    .from("guardian_contacts")
    .update({ approval_token: token })
    .eq("profile_id", profileId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const approvalUrl = `${request.nextUrl.origin}/guardian-approve/${token}`;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error: emailError } = await resend.emails.send({
    from: "TrainWith <onboarding@resend.dev>",
    to: guardian.guardian_email,
    subject: `Approve ${profile.name}'s TrainWith profile`,
    html: `
      <p>Hi ${guardian.guardian_name},</p>
      <p>${profile.name} signed up for TrainWith, an app for finding local training partners. Because they're under 18, we ask a parent or guardian to approve their profile before it's visible to others.</p>
      <p><a href="${approvalUrl}">Review and approve ${profile.name}'s profile</a></p>
      <p>If you didn't expect this email, you can ignore it — the profile will stay unapproved.</p>
    `,
  });

  if (emailError) {
    return NextResponse.json({ error: emailError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
