import { useQuery } from "@tanstack/react-query";
import { fetchQuotationEnumOptions } from "@/features/quotations/api/quotations.api";

export const makeQuotationEnumKeys = {
  base: () => ["make-quotation-enums"] as const,
  options: (params: {
    service?: "LOGISTICS" | "REGULATORY";
    service_type?: string;
    client_id?: string;
    client_search?: string;
  }) => [...makeQuotationEnumKeys.base(), params] as const,
};

export function useMakeQuotationEnums(params: {
  service?: "LOGISTICS" | "REGULATORY";
  service_type?: string;
  client_id?: string;
  client_search?: string;
}) {
  const cleanParams = { ...params };

  if (!cleanParams.client_search) {
    delete cleanParams.client_search;
  }

  return useQuery({
    queryKey: makeQuotationEnumKeys.options(cleanParams),
    queryFn: () => fetchQuotationEnumOptions(cleanParams),
    // enabled: Boolean(
    //   cleanParams.service || cleanParams.client_search || cleanParams.client_id,
    // ),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
