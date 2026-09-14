import { prisma } from "@/lib/prisma";
import {
  sendEmailVerification,
  sendPasswordResetEmail,
} from "@/utils/mail-presets";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { ac, adminRole, customerRole, moderatorRole } from "./access-control";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://mstbazar.com",
  trustedOrigins: ["https://mstbazar.com", "https://www.mstbazar.com"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: ["CUSTOMER", "ADMIN", "MODERATOR"],
        required: true,
        defaultValue: "CUSTOMER",
      },
      phoneNumber: {
        type: "string",
        required: false,
      },
      whatsappNumber: {
        type: "string",
        required: false,
      },
      fullAddress: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Users must verify email to login
    autoSignIn: false, // Don't sign in automatically after signup
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      if (process.env.ENABLE_EMAILS === "true") {
        await sendPasswordResetEmail({
          email: user.email,
          url: url,
        }).catch((emailError) => {
          console.error("Password reset email failed:", emailError);
        });
      } else {
        console.log(`Password reset email sent to ${user.email}: ${url}`);
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Send verification email on signup
    autoSignInAfterVerification: true, // Auto sign in after verification
    sendVerificationEmail: async ({ user, url, token }, request) => {
      if (process.env.ENABLE_EMAILS === "true") {
        await sendEmailVerification({
          email: user.email,
          name: user.name || undefined,
          url,
        }).catch((emailError) => {
          console.error("Email verification email failed:", emailError);
        });
      } else {
        console.log(`Email verification email sent to ${user.email}: ${url}`);
      }
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  plugins: [
    admin({
      ac,
      roles: {
        ADMIN: adminRole,
        MODERATOR: moderatorRole,
        CUSTOMER: customerRole,
      },
      defaultRole: "CUSTOMER",
    }),

    nextCookies(),
  ],
});
