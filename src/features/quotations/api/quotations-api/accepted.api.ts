import { apiClient } from "@/lib/api/client";
import type {
  AcceptedQuotationsResponse,
  ClientCounts,
  QuotationListItem,
  QuotationsPagination,
  QuotationLogisticsService,
  QuotationRegulatoryService,
} from "../../types/quotations.types";

import type {AcceptedFormEnumsResponse} from "../../types/acceptedForm.types";
import { type RequestBody } from "../../schemas/acceptedForm.schema";

import type { FetchRespondedQuotationsParams } from "./responded.api";

export async function fetchAcceptedQuotations(
  params: FetchRespondedQuotationsParams,
): Promise<AcceptedQuotationsResponse> {
  type AcceptedQuotationApiItem = {
    id: string | number | null;
    reference_number: string;
    date: string;
    client_full_name: string;
    status?: string;
    assignment_status?: string | null;
    account_specialist?: string | null;
    assigned_at?: string | null;
    service: string;
    logistics_service: QuotationLogisticsService | null;
    regulatory_service?: QuotationRegulatoryService | null;
    client_type?: "NEW" | "OLD";
    job_order_created?: boolean | null;
  };

  const response = await apiClient.get<{
    data:
      | {
          counts: ClientCounts;
          quotations: AcceptedQuotationApiItem[];
          my_quotations?: AcceptedQuotationApiItem[];
          pagination: QuotationsPagination;
        }
      | [];
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
      quotations: [],
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

  const mapQuotation = (
    quotation: AcceptedQuotationApiItem,
  ): QuotationListItem => {
    const parsedId =
      typeof quotation.id === "number"
        ? quotation.id
        : typeof quotation.id === "string"
          ? Number(quotation.id)
          : null;
    const id = Number.isNaN(parsedId) ? null : parsedId;

    return {
      id,
      reference_number: quotation.reference_number,
      date: quotation.date,
      client_full_name: quotation.client_full_name,
      status: quotation.status ?? "ACCEPTED",
      assignment_status: quotation.assignment_status ?? null,
      account_specialist: quotation.account_specialist ?? null,
      assigned_at: quotation.assigned_at ?? null,
      requested_at: null,
      service: quotation.service,
      logistics_service: quotation.logistics_service ?? null,
      regulatory_service: quotation.regulatory_service ?? null,
      reassignment_request_id: null,
      reassignment_requested_at: null,
      conversation_id: null,
      prepared_by: null,
      issued_quotation_id: null,
      as_profile_image: null,
      client_type: quotation.client_type ?? "NEW",
      previously_assigned_to: null,
      job_order_created: quotation.job_order_created ?? null,
    };
  };

  return {
    ...payload,
    quotations: payload.quotations.map(mapQuotation),
    my_quotations: payload.my_quotations?.map(mapQuotation) ?? [],
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
