import { createContext, use } from "react";
import type { MakeQuotationContextValue } from "./types/make-quotation.types";

export const MakeQuotationContext =
  createContext<MakeQuotationContextValue | null>(null);

export function useMakeQuotationContext(): MakeQuotationContextValue {
  const ctx = use(MakeQuotationContext);
  if (!ctx) {
    throw new Error(
      "MakeQuotation components must be used within MakeQuotationProvider",
    );
  }
  return ctx;
}
