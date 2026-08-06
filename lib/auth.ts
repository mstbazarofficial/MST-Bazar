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
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 1 * 60, // Cache duration in seconds
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
