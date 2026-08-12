import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const { requestId } = await request.json();
  if (!requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  const { data: trainingRequest, error: requestError } = await supabaseAdmin
    .from("training_requests")
    .select("from_profile_id, to_profile_id, message")
    .eq("id", requestId)
    .single();

  if (requestError) {
    return NextResponse.json({ error: requestError.message }, { status: 500 });
  }

  const { data: fromProfile, error: fromError } = await supabaseAdmin
    .from("profiles")
    .select("name")
    .eq("id", trainingRequest.from_profile_id)
    .single();
  if (fromError) {
    return NextResponse.json({ error: fromError.message }, { status: 500 });
  }

  const { data: toProfile, error: toError } = await supabaseAdmin
    .from("profiles")
    .select("user_id")
    .eq("id", trainingRequest.to_profile_id)
    .single();
  if (toError) {
    return NextResponse.json({ error: toError.message }, { status: 500 });
  }

  // Demo/unclaimed profiles have no real account behind them — nothing to email.
  if (!toProfile.user_id) {
    return NextResponse.json({ ok: true, skipped: "no owner" });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(toProfile.user_id);
  if (userError || !userData.user?.email) {
    return NextResponse.json({ error: userError?.message ?? "No email on file" }, { status: 500 });
  }

  const requestsUrl = `${request.nextUrl.origin}/requests`;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error: emailError } = await resend.emails.send({
    from: "TrainWith <onboarding@resend.dev>",
    to: userData.user.email,
    subject: `${fromProfile.name} wants to train with you`,
    html: `
      <p>${fromProfile.name} sent you a training request on TrainWith.</p>
      ${trainingRequest.message ? `<p>Their note: &ldquo;${trainingRequest.message}&rdquo;</p>` : ""}
      <p><a href="${requestsUrl}">View the request</a></p>
    `,
  });

  if (emailError) {
    return NextResponse.json({ error: emailError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
