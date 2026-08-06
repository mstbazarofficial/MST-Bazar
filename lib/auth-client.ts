import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, adminRole, customerRole, moderatorRole } from "./access-control";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
    adminClient({
      ac,
      roles: {
        ADMIN: adminRole,
        MODERATOR: moderatorRole,
        CUSTOMER: customerRole,
      },
    }),
  ],
});
