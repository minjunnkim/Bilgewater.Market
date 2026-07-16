import { NextResponse } from "next/server";
import { getResend, isSubscribeConfigured } from "@/lib/resend";

type Body = {
  email?: string;
  name?: string;
  website?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ message: "You're on the list." });
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  if (!isSubscribeConfigured()) {
    console.info("[subscribe] Audience not configured. Captured:", {
      email,
      name: body.name,
    });
    return NextResponse.json({
      message:
        "You're on the list (local capture). Resend Audience will sync once configured.",
    });
  }

  const resend = getResend();
  const audienceId = process.env.RESEND_AUDIENCE_ID!;

  try {
    await resend!.contacts.create({
      audienceId,
      email,
      firstName: body.name?.trim() || undefined,
      unsubscribed: false,
    });
    return NextResponse.json({
      message: "You're on the weekly inventory list.",
    });
  } catch (error) {
    console.error("[subscribe] Resend error", error);
    return NextResponse.json(
      { error: "Could not subscribe. Try again later." },
      { status: 502 },
    );
  }
}
