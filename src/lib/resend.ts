import { Resend } from "resend";

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function isEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.INQUIRY_TO_EMAIL &&
      process.env.INQUIRY_FROM_EMAIL,
  );
}

export function isSubscribeConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID);
}
