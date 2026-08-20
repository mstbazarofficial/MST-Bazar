import { prisma } from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { ac, adminRole, customerRole, moderatorRole } from "./access-control";

export const auth = betterAuth({
  trustedOrigins: async () => {
    if (process.env.NODE_ENV === "development") {
      return ["http://localhost:3000"];
    }
    return ["https://www.yourwebsite.com", "https://yourwebsite.com"];
  },
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
      console.log(`Password reset email sent to ${user.email}: ${url}`);
      /* void sendEmail({
				to: user.email,
				subject: "Reset your password",
				text: `Click the link to reset your password: ${url}`,
			});
		}, */
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password reset for ${user.email}`);
      // e.g., notify user, log security event, etc.
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Send verification email on signup
    sendOnSignIn: true, // Send verification email if user tries to login unverified
    autoSignInAfterVerification: true, // Auto sign in after verification
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // Send verification email using your email provider
      /* void sendEmail({
				to: user.email,
				subject: "Verify your email address",
				text: `Click the link to verify your email: ${url}`,
			}); */
      console.log(`Verification email sent to ${user.email}: ${url}`);
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
