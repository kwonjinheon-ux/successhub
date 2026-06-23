import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { getAdminDatabase } from "@/services/firebaseAdmin";

function getEmailKey(email: string) {
  return Buffer.from(email.trim().toLowerCase()).toString("base64url");
}

function hashCode(email: string, code: string) {
  const pepper = process.env.EMAIL_CODE_PEPPER || "success-hub-2026";
  return createHash("sha256").update(`${email.trim().toLowerCase()}:${code}:${pepper}`).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { email, code } = (await request.json()) as { email?: string; code?: string };
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedCode = code?.trim();

    if (!normalizedEmail || !normalizedCode) {
      return NextResponse.json({ message: "Email and verification code are required." }, { status: 400 });
    }

    const codeRef = getAdminDatabase().ref(`emailVerificationCodes/${getEmailKey(normalizedEmail)}`);
    const snapshot = await codeRef.get();
    const savedCode = snapshot.val() as { codeHash?: string; expiresAt?: number; attempts?: number } | null;

    if (!savedCode) {
      return NextResponse.json({ message: "Send a verification code first." }, { status: 400 });
    }

    if (!savedCode.expiresAt || savedCode.expiresAt < Date.now()) {
      await codeRef.remove();
      return NextResponse.json({ message: "Verification code expired. Send a new code." }, { status: 400 });
    }

    if ((savedCode.attempts || 0) >= 5) {
      await codeRef.remove();
      return NextResponse.json({ message: "Too many attempts. Send a new code." }, { status: 429 });
    }

    if (savedCode.codeHash !== hashCode(normalizedEmail, normalizedCode)) {
      await codeRef.update({ attempts: (savedCode.attempts || 0) + 1 });
      return NextResponse.json({ message: "Verification code does not match." }, { status: 400 });
    }

    await codeRef.remove();
    return NextResponse.json({ verified: true, message: "Email verified." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not verify code." },
      { status: 500 }
    );
  }
}
