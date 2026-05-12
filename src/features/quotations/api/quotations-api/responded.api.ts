import { apiClient } from "@/lib/api/client";
import type {
	RespondedQuotationsResponse,
} from "../../types/quotations.types";

export interface FetchRespondedQuotationsParams {
	search?: string;
	"filter[service]"?: string;
	"filter[created_at]"?: string;
	"filter[status]"?: string;
	"filter[as_full_name]"?: string;
	client_type?: "ALL" | "NEW" | "OLD";
	perPage?: number;
	page?: number;
}

export async function fetchRespondedQuotations(
	params: FetchRespondedQuotationsParams,
): Promise<RespondedQuotationsResponse> {
	const response = await apiClient.get<{
		data: RespondedQuotationsResponse;
	}>("/quotations", {
		params: {
			"filter[status]": params["filter[status]"] ?? "RESPONDED",
			...(params.search ? { search: params.search } : {}),
			...(params["filter[service]"] ? { "filter[service]": params["filter[service]"] } : {}),
			...(params["filter[created_at]"] ? { "filter[created_at]": params["filter[created_at]"] } : {}),
			...(params["filter[as_full_name]"] ? { "filter[as_full_name]": params["filter[as_full_name]"] } : {}),
			...(params.client_type && params.client_type !== "ALL" ? { client_type: params.client_type } : {}),
			...(params.perPage ? { perPage: params.perPage } : {}),
			...(params.page ? { page: params.page } : {}),
		},
	});

	const payload = response.data.data;

	return {
		...payload,
		quotations: payload.quotations.map((quotation) => ({
			...quotation,
			qtn_status: quotation.qtn_status ?? "responded",
		})),
		my_quotations: payload.my_quotations?.map((quotation) => ({
			...quotation,
			qtn_status: quotation.qtn_status ?? "responded",
		})),
	};
}
