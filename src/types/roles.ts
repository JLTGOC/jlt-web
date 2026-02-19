export const ROLES = {
  CLIENT: "Client",
  ACCOUNT_SPECIALIST: "Account Specialist",
  MARKETING: "Marketing",
  HUMAN_RESOURCE: "Human Resource",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
