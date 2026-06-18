import { apiClient } from "@/lib/api/client";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";

export interface QuotationEnumOptions {
  clients: Record<string, string>;
  autofill_details: {
    full_name: string;
    company: {
      name: string | null;
      address: string | null;
      position: string | null;
      contact_number: string;
      email: string;
      business_type: string | null;
    };
  } | null;
  business_types: string[];
  regulatory_assistance_types: string[];
  service_types: string[];
  transport_modes: string[];
  service_options: string[];
  cargo_type: string[];
  container_size: string[];
  document_checklist: string[];
}

interface StoreQuotationBasePayload {
  client?: string;
  full_name?: string;
  company: {
    name: string;
    address: string;
    contact_person?: string;
    contact_number: string;
    email: string;
    position?: string;
    business_type?: string;
    cp_contact_number?: string;
  };
  service: {
    type?: string;
    options: string[];
  };
  documents?: Array<{ file: File; type?: string }>;
}

export interface StoreLogisticsPayload extends StoreQuotationBasePayload {
  services: "LOGISTICS";
  service: {
    type?: string;
    transport_mode: "SEA" | "AIR"; // required
    options: string[];
  };
  commodity: {
    commodity?: string;
    cargo_type: "CONTAINERIZED" | "LCL"; // required
    container_size?: string;
  };
  shipment: {
    origin: string; // required
    destination: string; // required
  };
  remarks?: string;
}

export interface StoreRegulatoryPayload extends StoreQuotationBasePayload {
  services: "REGULATORY";
  type_of_regulatory_assistance: string[]; // required
  service_level: "NEW" | "RENEWAL"; // required
  message?: string;
  commodity?: {
    commodity?: string; // whole object optional, cargo_type not needed
  };
  shipment?: {
    origin?: string;
    destination?: string;
  };
}

export type StoreQuotationPayload =
  | StoreLogisticsPayload
  | StoreRegulatoryPayload;

export async function fetchQuotationEnumOptions(params: {
  service?: "LOGISTICS" | "REGULATORY";
  service_type?: string;
  client_id?: string;
  client_search?: string;
}): Promise<QuotationEnumOptions> {
  const response = await apiClient.get<{ data: QuotationEnumOptions }>(
    "/quotations/enum-options",
    { params },
  );
  return response.data.data;
}

export async function storeQuotation(
  payload: StoreQuotationPayload,
): Promise<QuotationResource> {
  const formData = new FormData();

  formData.append("services", payload.services);

  if (payload.client !== undefined) {
    formData.append("client", payload.client);
  }
  if (payload.full_name) {
    formData.append("full_name", payload.full_name);
  }

  formData.append("company[name]", payload.company.name);
  formData.append("company[address]", payload.company.address);
  formData.append("company[contact_number]", payload.company.contact_number);
  formData.append("company[email]", payload.company.email);
  if (payload.company.contact_person) {
    formData.append("company[contact_person]", payload.company.contact_person);
  }
  if (payload.company.position) {
    formData.append("company[position]", payload.company.position);
  }
  if (payload.company.business_type) {
    formData.append("company[business_type]", payload.company.business_type);
  }
  if (payload.company.cp_contact_number) {
    formData.append(
      "company[cp_contact_number]",
      payload.company.cp_contact_number,
    );
  }

  // service is always present — no guard needed
  if (payload.service.type) {
    formData.append("service[type]", payload.service.type);
  }
  // always send options unconditionally — backend requires it
  payload.service.options.forEach((opt) =>
    formData.append("service[options][]", opt),
  );

  if (payload.services === "LOGISTICS") {
    formData.append("service[transport_mode]", payload.service.transport_mode);

    if (payload.commodity.commodity) {
      formData.append("commodity[commodity]", payload.commodity.commodity);
    }
    formData.append("commodity[cargo_type]", payload.commodity.cargo_type);
    if (payload.commodity.container_size) {
      formData.append(
        "commodity[container_size]",
        payload.commodity.container_size,
      );
    }

    formData.append("shipment[origin]", payload.shipment.origin);
    formData.append("shipment[destination]", payload.shipment.destination);

    if (payload.remarks) {
      formData.append("remarks", payload.remarks);
    }
  } else {
    payload.type_of_regulatory_assistance.forEach((t) =>
      formData.append("type_of_regulatory_assistance[]", t),
    );
    formData.append("service_level", payload.service_level);

    if (payload.message) {
      formData.append("message", payload.message);
    }
    if (payload.commodity?.commodity) {
      formData.append("commodity[commodity]", payload.commodity.commodity);
    }
    if (payload.shipment?.origin) {
      formData.append("shipment[origin]", payload.shipment.origin);
    }
    if (payload.shipment?.destination) {
      formData.append("shipment[destination]", payload.shipment.destination);
    }
  }

  if (payload.documents && payload.documents.length > 0) {
    payload.documents.forEach((doc, i) => {
      formData.append(`documents[${i}][file]`, doc.file);
      formData.append(`documents[${i}][type]`, doc.type ?? "");
    });
  }

  const response = await apiClient.post<{ data: QuotationResource }>(
    "/quotations",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data;
}
