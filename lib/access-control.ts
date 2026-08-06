import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

export const adminRole = ac.newRole({
  project: ["create", "update", "delete"],
  ...adminAc.statements,
});

export const moderatorRole = ac.newRole({
  project: ["create"],
  user: ["ban"],
});

export const customerRole = ac.newRole({
  project: ["create"],
});

export { ac };
