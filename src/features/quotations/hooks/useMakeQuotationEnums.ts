import { useQuery } from "@tanstack/react-query";
import { fetchQuotationEnumOptions } from "@/features/quotations/api/quotations.api";

export const makeQuotationEnumKeys = {
  base: () => ["make-quotation-enums"] as const,
  options: (params: {
    service?: "LOGISTICS" | "REGULATORY";
    service_type?: string;
    client_id?: string;
  }) => [...makeQuotationEnumKeys.base(), params] as const,
};

export function useMakeQuotationEnums(params: {
  service?: "LOGISTICS" | "REGULATORY";
  service_type?: string;
  client_id?: string;
}) {
  return useQuery({
    queryKey: makeQuotationEnumKeys.options(params),
    queryFn: () => fetchQuotationEnumOptions(params),
    enabled: Boolean(params.service),
    staleTime: 5 * 60 * 1000,
  });
}
