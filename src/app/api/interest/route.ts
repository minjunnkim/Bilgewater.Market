import { NextResponse } from "next/server";
import { getResend, isEmailConfigured } from "@/lib/resend";

type Body = {
  name?: string;
  email?: string;
  budget?: string;
  message?: string;
  cardName?: string;
  cardId?: string;
  website?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot
  if (body.website) {
    return NextResponse.json({ message: "Message sent." });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!isEmailConfigured()) {
    console.info("[interest] Email not configured. Captured inquiry:", {
      name,
      email,
      cardName: body.cardName,
      budget: body.budget,
      message,
    });
    return NextResponse.json({
      message:
        "Thanks — your interest was recorded. Email delivery will go live once Resend is connected.",
    });
  }

  const resend = getResend();
  const to = process.env.INQUIRY_TO_EMAIL!;
  const from = process.env.INQUIRY_FROM_EMAIL!;

  const subject = body.cardName
    ? `Interest: ${body.cardName}`
    : "New inquiry — Bilgewater Market";

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    body.cardName ? `Card: ${body.cardName}` : null,
    body.cardId ? `Card ID: ${body.cardId}` : null,
    body.budget ? `Budget: ${body.budget}` : null,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await resend!.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
    });
    return NextResponse.json({
      message: "Message sent. We'll be in touch soon.",
    });
  } catch (error) {
    console.error("[interest] Resend error", error);
    return NextResponse.json(
      { error: "Could not send message. Try again later." },
      { status: 502 },
    );
  }
}
