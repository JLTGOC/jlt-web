// ─── Detail page type ─────────────────────────────────────────────────────────

export interface JobOrderDetail {
  id: string | number;
  reference_number: string;
  quotation_reference?: string;
  quotation_id?: string | number;

  jo_information: {
    subject: string;
    date: string; // ISO date string
    message: string;
  };

  client_information: {
    consignee: string;
    client_type: string;
    accredited?: string;
    shipper?: string;
    client_tone?: string;
    remarks_on_handling?: string;
  };

  service_information: {
    service_level: string;
    bl_no?: string;
    eta?: string; // ISO date string
    etd?: string; // ISO date string
  };

  shipment_information: {
    commodity?: string;
    volume_dimension?: string;
    hs_code?: string;
    rod?: string;
    permits_needed?: string;
    if_coordinated?: string;
    special_remarks?: string;
  };

  commitment_information: {
    target_delivery?: string;
    target_completion_period?: string;
    special_remarks?: string;
  };

  billing_information: {
    terms_of_payment?: string;
    when_to_bill?: string;
    shall_be_billed?: string;
    available_docs_attached?: string;
  };
}
