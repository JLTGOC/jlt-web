export const ROLES = {
  CLIENT: "Client",
  ACCOUNT_SPECIALIST: "Account Specialist",
  LEAD_ACCOUNT_SPECIALIST: "Lead Account Specialist",
  LEAD_OPERATIONS: "Lead Operations",
  OPERATIONS: "Operations",
  MARKETING: "Marketing",
  FINANCE: "Finance",
  LEAD_FINANCE: "Lead Finance",
  HUMAN_RESOURCE: "Human Resource",
  IT: "IT",
} as const;

export const JOB_ORDER_ROLES: Role[] = [ROLES.OPERATIONS, ROLES.LEAD_OPERATIONS];

export type Role = (typeof ROLES)[keyof typeof ROLES];
