import { createHash, randomInt } from "crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAdminDatabase } from "@/services/firebaseAdmin";

const CODE_TTL_MS = 2 * 60 * 1000;

function getEmailKey(email: string) {
  return Buffer.from(email.trim().toLowerCase()).toString("base64url");
}

function hashCode(email: string, code: string) {
  const pepper = process.env.EMAIL_CODE_PEPPER || "success-hub-2026";
  return createHash("sha256").update(`${email.trim().toLowerCase()}:${code}:${pepper}`).digest("hex");
}

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM);
}

async function sendCodeEmail(email: string, code: string) {
  if (!hasSmtpConfig()) {
    if (process.env.NODE_ENV !== "production") {
      return { developmentCode: code };
    }

    throw new Error("Email delivery is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Success Hub verification code",
    text: `Your Success Hub verification code is ${code}. This code expires in 2 minutes.`,
    html: `<p>Your Success Hub verification code is <strong>${code}</strong>.</p><p>This code expires in 2 minutes.</p>`
  });

  return {};
}

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    const code = randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + CODE_TTL_MS;
    const mailResult = await sendCodeEmail(normalizedEmail, code);

    await getAdminDatabase().ref(`emailVerificationCodes/${getEmailKey(normalizedEmail)}`).set({
      codeHash: hashCode(normalizedEmail, code),
      expiresAt,
      createdAt: Date.now(),
      attempts: 0
    });

    return NextResponse.json({
      message: "Verification code sent.",
      expiresInSeconds: CODE_TTL_MS / 1000,
      ...mailResult
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not send verification code." },
      { status: 500 }
    );
  }
}
