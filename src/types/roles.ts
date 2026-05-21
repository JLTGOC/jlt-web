export const ROLES = {
  CLIENT: "Client",
  LEAD_ACCOUNT_SPECIALIST: "Lead Account Specialist",
  ACCOUNT_SPECIALIST: "Account Specialist",
  LEAD_OPERATIONS: "Lead Operations",
  OPERATIONS: "Operations",
  LEAD_CLIENT_SUCCESS: "",
  CLIENT_SUCCESS:"Client Success",
  MARKETING: "Marketing",
  LEAD_FINANCE: "Lead Finance",
  FINANCE: "Finance",
  HUMAN_RESOURCE: "Human Resource",
  IT: "IT",
} as const;


export type Role = (typeof ROLES)[keyof typeof ROLES];
