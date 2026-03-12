import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { success } from "@/lib/api-helpers";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return success({ message: "If an account exists with that email, we've sent a password reset link." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

      if (resend) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "FrameOne <noreply@resend.dev>",
          to: user.email,
          subject: "Reset your FrameOne password",
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #131318; color: #f0efe6;">
              <h1 style="font-size: 24px; font-weight: 300; margin-bottom: 24px; color: #f0efe6;">Password Reset</h1>
              <p style="font-size: 14px; line-height: 1.6; color: #cdc9bc; margin-bottom: 24px;">
                Hi ${user.name || "there"},<br><br>
                We received a request to reset your FrameOne password. Click the button below to set a new password. This link expires in 1 hour.
              </p>
              <a href="${resetUrl}" style="display: inline-block; background: #9d7663; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 999px; font-size: 14px; font-weight: 500;">
                Reset Password
              </a>
              <p style="font-size: 12px; color: #9e9eab; margin-top: 32px; line-height: 1.5;">
                If you didn't request this, you can safely ignore this email.<br>
                — The FrameOne Team
              </p>
            </div>
          `,
        });
      } else {
        console.log(`[Password Reset] No email service configured. Reset link for ${user.email}: ${resetUrl}`);
      }
    }

    return success({ message: "If an account exists with that email, we've sent a password reset link." });
  } catch (e) {
    console.error("Forgot password error:", e);
    return success({ message: "If an account exists with that email, we've sent a password reset link." });
  }
}
