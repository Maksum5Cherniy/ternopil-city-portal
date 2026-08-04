import "server-only";

import { Resend } from "resend";
import { SITE } from "@/config/site.config";

type SendEmailResult =
  | { sent: true; id?: string }
  | { sent: false; reason: "provider-missing" | "send-failed"; error?: string };

let resendClient: Resend | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  resendClient ??= new Resend(apiKey);

  return resendClient;
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getEmailVerificationUrl(token: string) {
  return `${getBaseUrl()}/verify-email?token=${encodeURIComponent(token)}`;
}

export async function sendEmailVerification(input: {
  email: string;
  displayName: string;
  token: string;
}): Promise<SendEmailResult> {
  const verificationUrl = getEmailVerificationUrl(input.token);
  const resend = getResend();

  if (!resend) {
    console.info(`[email verification] ${input.email}: ${verificationUrl}`);
    return { sent: false, reason: "provider-missing" };
  }

  const from = process.env.EMAIL_FROM || `${SITE.title} <onboarding@resend.dev>`;
  const safeName = escapeHtml(input.displayName);
  const safeUrl = escapeHtml(verificationUrl);

  const { data, error } = await resend.emails.send({
    from,
    to: input.email,
    subject: "Підтвердіть email для Де Тернопіль",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0d1b3d">
        <h1 style="font-size:24px;margin:0 0 16px">Підтвердіть email</h1>
        <p>Вітаємо, ${safeName}.</p>
        <p>Щоб активувати профіль на порталі <strong>Де Тернопіль</strong>, перейдіть за посиланням:</p>
        <p><a href="${safeUrl}" style="display:inline-block;background:#1e3aba;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none">Підтвердити email</a></p>
        <p>Посилання дійсне 24 години. Якщо ви не створювали профіль, просто проігноруйте цей лист.</p>
      </div>
    `,
    text: `Підтвердіть email для Де Тернопіль: ${verificationUrl}`,
  });

  if (error) {
    console.error("[email verification] send failed", error);
    return { sent: false, reason: "send-failed", error: error.message };
  }

  return { sent: true, id: data?.id };
}
