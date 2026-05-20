import type { JobOrderQuotationDetailsResponse } from "../types/jobOrder";
import type { JobOrderDetail } from "../types/jobOrderDetail";

function mapQuotationDocuments(
  documents: JobOrderQuotationDetailsResponse["documents"],
  uploadedBy: "Client" | "JLTCB",
): NonNullable<JobOrderDetail["documents"]> {
  return (documents ?? []).map((document) => ({
    id: document.id,
    file_name: document.file_name,
    file_url: document.file_url,
    file_type: document.file_type,
    created_at: document.created_at,
    updated_at: document.updated_at,
    uploadedBy,
  }));
}

export function mapQuotationToJobOrderDetail(
  quotation: JobOrderQuotationDetailsResponse,
): JobOrderDetail {
  const history =
    quotation.history ??
    quotation.histories ??
    quotation.activity_logs ??
    quotation.activities ??
    quotation.timeline ??
    quotation.events ??
    [];

  return {
    id: quotation.id,
    reference_number: quotation.reference_number,
    quotation_id: quotation.id,
    subject:
      quotation.job_order?.reference_number ?? quotation.reference_number,
    date: quotation.created_at,
    email_body: quotation.remarks ?? null,
    job_order: {
      reference_number: quotation.job_order?.reference_number ?? null,
      person_in_charge: quotation.job_order?.person_in_charge ?? null,
    },
    company: quotation.company
      ? {
          name: quotation.company.name,
          address: quotation.company.address,
          contact_person: quotation.company.contact_person,
          contact_number: quotation.company.contact_number,
          email: quotation.company.email,
          position: quotation.company.position,
          business_type: quotation.company.business_type,
        }
      : null,
    client: {
      full_name: quotation.client?.full_name ?? null,
      company_name: quotation.client?.company_name ?? null,
      contact_number: quotation.client?.contact_number ?? null,
      email: quotation.client?.email ?? null,
      consignee:
        quotation.client?.company_name ?? quotation.company?.name ?? null,
      client_type: null,
      accredited:
        quotation.client?.company_name ??
        quotation.company?.business_type ??
        null,
      shipper: quotation.client?.full_name ?? null,
      tone_and_attitude:
        quotation.client?.contact_number ?? quotation.company?.position ?? null,
      remarks:
        quotation.company?.address ??
        quotation.shipment?.remarks ??
        quotation.remarks ??
        null,
    },
    service: {
      service_type: quotation.service?.type ?? null,
      type: quotation.service?.transport_mode ?? null,
      regulatory_assistance: null,
      application_type:
        quotation.regulatory_service?.application_type?.toString() ?? null,
      accredited: null,
      remarks: quotation.shipment?.remarks ?? quotation.remarks ?? null,
      service_level: quotation.service?.options?.join(", ") ?? null,
      bl_no: null,
      eta: null,
      etd: null,
    },
    shipment: {
      commodity: quotation.commodity?.commodity ?? null,
      cargo_type: quotation.commodity?.cargo_type ?? null,
      container_size: quotation.commodity?.container_size ?? null,
      origin: quotation.shipment?.origin ?? null,
      destination: quotation.shipment?.destination ?? null,
      hs_code: null,
      rod: null,
      permits: null,
      if_coordinated: quotation.service?.options?.join(", ") ?? null,
      special_remarks: quotation.shipment?.remarks ?? quotation.remarks ?? null,
    },
    target: null,
    billing_details: null,
    documents: [
      ...mapQuotationDocuments(quotation.quotation_file, "JLTCB"),
      ...mapQuotationDocuments(quotation.documents, "Client"),
    ],
    history,
    histories: quotation.histories,
    activity_logs: quotation.activity_logs,
    activities: quotation.activities,
    timeline: quotation.timeline,
    events: quotation.events,
  };
}
