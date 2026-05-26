import { apiClient } from "@/lib/api/client";
import type {
  RespondedQuotationListItem,
  RespondedQuotationsResponse,
} from "../../types/quotations.types";
import type { FetchRespondedQuotationsParams } from "./responded.api";

export async function fetchAcceptedQuotations(
  params: FetchRespondedQuotationsParams,
): Promise<RespondedQuotationsResponse> {
  const response = await apiClient.get<{
    data: RespondedQuotationsResponse | [];
  }>("/quotations", {
    params: {
      "filter[status]": params["filter[status]"] ?? "ACCEPTED",
      ...(params.search ? { search: params.search } : {}),
      ...(params["filter[service]"]
        ? { "filter[service]": params["filter[service]"] }
        : {}),
      ...(params["filter[created_at]"]
        ? { "filter[created_at]": params["filter[created_at]"] }
        : {}),
      ...(params.client_type && params.client_type !== "ALL"
        ? { client_type: params.client_type }
        : {}),
      ...(params.perPage ? { per_page: params.perPage } : {}),
      ...(params.page ? { page: params.page } : {}),
    },
  });

  const payload = response.data.data;

  if (Array.isArray(payload)) {
    return {
      counts: {
        all_quotations: 0,
        old_user_quotations: 0,
        new_user_quotations: 0,
      },
      quotations: [] as RespondedQuotationListItem[],
      my_quotations: [],
      pagination: {
        count: 0,
        per_page: params.perPage ?? 10,
        total: 0,
        current_page: params.page ?? 1,
        total_pages: 1,
      },
    };
  }

  return {
    ...payload,
    quotations: payload.quotations.map((quotation) => ({
      ...quotation,
      qtn_status: quotation.qtn_status ?? "accepted",
    })),
    my_quotations: payload.my_quotations?.map((quotation) => ({
      ...quotation,
      qtn_status: quotation.qtn_status ?? "accepted",
    })),
  };
}
