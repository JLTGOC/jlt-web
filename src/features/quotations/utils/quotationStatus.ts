import type { QuotationResource } from "../types/quotations.types";

export type QtnStatus = "requested" | "responded" | "accepted" | "unknown";

export function getQtnStatus(q?: QuotationResource | null): QtnStatus {
  if (!q) return "unknown";

  const raw = q.qtn_status;
  if (raw) {
    const s = raw.toLowerCase().trim();
    if (s === "requested" || s === "responded" || s === "accepted") return s as QtnStatus;
  }

  // Infer from available fields when qtn_status is not provided by backend
  // Rules (priority order):
  // - If there's an accepted timestamp -> `accepted`
  // - If there's a created timestamp -> `responded` (a created quotation means it's been responded)
  // - If there's an issued quotation id -> `responded`
  // - If neither created nor accepted exist -> default to `requested`
  if (q.qtn_accepted_at) return "accepted";
  if (q.qtn_created_at) return "responded";
  if (q.issued_quotation_id != null) return "responded";

  // Default: no created/accepted data means still requested
  return "requested";
}

export function isRequested(q?: QuotationResource | null) {
  return getQtnStatus(q) === "requested";
}

export function isResponded(q?: QuotationResource | null) {
  return getQtnStatus(q) === "responded";
}

export function isAccepted(q?: QuotationResource | null) {
  return getQtnStatus(q) === "accepted";
}
