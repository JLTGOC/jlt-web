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
			"filter[status]": "ACCEPTED",
			...(params.search ? { search: params.search } : {}),
			...(params.perPage ? { perPage: params.perPage } : {}),
		},
	});

	if (Array.isArray(response.data.data)) {
		return {
			quotations: [] as RespondedQuotationListItem[],
			pagination: {
				count: 0,
				per_page: params.perPage ?? 10,
				total: 0,
			},
		};
	}

	return response.data.data;
}
