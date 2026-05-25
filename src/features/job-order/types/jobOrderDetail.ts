export type JobOrderDetail = {
  id: number | string;
  reference_number: string;
  quotation_id?: number | string | null;
  job_type?: string | null;
  service_type?: string | null;
  subject?: string | null;
  date?: string | null;
  email_body?: string | null;
  job_order?: {
    reference_number?: string | null;
    person_in_charge?: string | null;
  } | null;
  company?: {
    name?: string | null;
    address?: string | null;
    contact_person?: string | null;
    contact_number?: string | null;
    email?: string | null;
    position?: string | null;
    business_type?: string | null;
  } | null;
  client: {
    full_name?: string | null;
    company_name?: string | null;
    contact_number?: string | null;
    email?: string | null;
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
    origin?: string | null;
    destination?: string | null;
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
  documents?: JobOrderDocument[];
  history?: JobOrderHistoryItem[];
  histories?: JobOrderHistoryItem[];
  activity_logs?: JobOrderHistoryItem[];
  activities?: JobOrderHistoryItem[];
  timeline?: JobOrderHistoryItem[];
  events?: JobOrderHistoryItem[];
};

export type JobOrderHistoryItem = {
  id?: number | string;
  date_time?: string | null;
  datetime?: string | null;
  timestamp?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  date?: string | null;
  action?: string | null;
  event?: string | null;
  status?: string | null;
  description?: string | null;
  by?: string | null;
  user?: string | null;
  user_name?: string | null;
  actor?: string | null;
  actor_name?: string | null;
  performed_by?: string | null;
};

export type JobOrderDocument = {
  id: number | string;
  file_name: string;
  file_url?: string | null;
  uploadedBy?: "JLTCB" | "Client" | string | null;
  uploadedByUser?: string | null;
  uploadedDate?: string | null;
  uploaded_by?: number | null;
  file_type?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};
