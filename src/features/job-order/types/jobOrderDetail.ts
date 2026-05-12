export type JobOrderDetail = {
  reference_number: string;
  quotation_id?: number | string | null;
  job_type?: string | null;
  service_type?: string | null;
  subject?: string | null;
  date?: string | null;
  email_body?: string | null;
  client: {
    consignee?: string | null;
    client_type?: string | null;
    accredited?: string | null;
    shipper?: string | null;
    tone_and_attitude?: string | null;
    remarks?: string | null;
  };
  service?: {
    service_type?: string | null;
    type?: string | null;
    regulatory_assistance?: string | null;
    application_type?: string | null;
    accredited?: string | null;
    remarks?: string | null;
    service_level?: string | null;
    bl_no?: string | null;
    eta?: string | null;
    etd?: string | null;
  } | null;
  shipment?: {
    commodity?: string | null;
    cargo_type?: string | null;
    container_size?: string | null;
    hs_code?: string | null;
    rod?: string | null;
    permits?: string | null;
    if_coordinated?: string | null;
    special_remarks?: string | null;
  } | null;
  target?: {
    target_delivery_date?: string | null;
    target_completion_date?: string | null;
    special_remarks?: string | null;
  } | null;
  billing_details?: {
    terms_of_payment?: string | null;
    billing_date?: string | null;
    shall_be_billed?: string | null;
  } | null;
};
