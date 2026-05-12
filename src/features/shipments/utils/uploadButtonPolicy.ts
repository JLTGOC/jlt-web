// utils/uploadButtonPolicy.ts
import { ROLES } from "@/types/roles";

type Section = "Documents" | "Billing";

export function canShowUploadButton(
  role: string,
  section: Section,
  currentUserId: string,
  assigned: {
    clientId?: string;
    operationsId?: string;
    accountHandlerId?: string;
  }
): boolean {
  // Documents section: only assigned client, operations, or account specialist
  if (
    section === "Documents" &&
    (
      (role === ROLES.CLIENT && currentUserId === assigned.clientId) ||
      (role === ROLES.OPERATIONS && currentUserId === assigned.operationsId) ||
      (role === ROLES.ACCOUNT_SPECIALIST && currentUserId === assigned.accountHandlerId)
    )
  ) {
    return true;
  }

  // Billing section: any Finance role can upload
  if (
    section === "Billing" &&
    (role === ROLES.FINANCE || role === ROLES.LEAD_FINANCE)
  ) {
    return true;
  }

  return false;
}
