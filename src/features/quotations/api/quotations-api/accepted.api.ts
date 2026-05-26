import { apiClient } from "@/lib/api/client";
import type {
  RespondedQuotationListItem,
  RespondedQuotationsResponse,
} from "../../types/quotations.types";

import type {AcceptedFormEnumsResponse} from "../../types/acceptedForm.types";
import { type RequestBody } from "../../schemas/acceptedForm.schema";

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

export async function fetchAcceptedFormEnums(
  quotation_reference_number: string,
): Promise<AcceptedFormEnumsResponse> {
  const response = await apiClient.get<{ data: AcceptedFormEnumsResponse }>(
	`/job-orders/enums`,
	{ params: { quotation_reference_number} },
  );
  return response.data.data;
}

export async function registerJobOrder(
	requestBody: RequestBody,
	job_type: string,
	quotation_reference_number: string
): Promise<void> {
	const form = new FormData();
	form.append("job_type", job_type);
	form.append("quotation_reference_number", quotation_reference_number);

	form.append("subject[date]", requestBody.subject.date);
	form.append("subject[subject]", requestBody.subject.subject);
	form.append("subject[email_body]", requestBody.subject.email_body);

	form.append("client[client_type]", requestBody.client.client_type);
	form.append("client[accredited]", requestBody.client.accredited);
	form.append("client[remarks]", requestBody.client.remarks);

	form.append("service[service_level]", requestBody.service.service_level);
	form.append("service[bl_no]", requestBody.service.bl_no);
	form.append("service[eta]", requestBody.service.eta);
	form.append("service[etd]", requestBody.service.etd);

	form.append("shipment[hs_code]", requestBody.shipment.hs_code);
	form.append("shipment[rod]", requestBody.shipment.rod);
	form.append("shipment[permits]", requestBody.shipment.permits);
	form.append("shipment[if_coordinated]", requestBody.shipment.if_coordinated);
	form.append(
		"shipment[special_remarks]",
		requestBody.shipment.special_remarks,
	);

	form.append("target[delivery_date]", requestBody.target.delivery_date);
	form.append("target[completion_date]", requestBody.target.completion_date);
	form.append("target[special_remarks]", requestBody.target.special_remarks);

	form.append("billing[terms_of_payment]", requestBody.billing.terms_of_payment);
	form.append("billing[billing_date]", requestBody.billing.billing_date);
	form.append("billing[shall_be_billed]", requestBody.billing.shall_be_billed);
	form.append("billing[listed_docs]", requestBody.billing.listed_docs);
	requestBody.billing.attached_docs.forEach((file) => {
		form.append("billing[attached_docs][]", file);
	});

	await apiClient.post("/job-orders", form, {
		headers: { "Content-Type": "multipart/form-data" },
	});
}
