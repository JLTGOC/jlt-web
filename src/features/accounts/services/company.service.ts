import { GET, POST } from "@/lib/api/client";
import { getApiBaseUrl } from "@/lib/api/base-url";
import type { ApiResponse } from "@/types/api";
import type {
  CompanyListResponse,
  CompanyFullDetails,
  CompanyCreateRequest,
  CompanyDocumentPayload,
  CompanyUpdateRequest,
  CompanyTableRow,
} from "../types/company.types";

type CompanyListBackendItem = {
  id: string;
  name: string;
  clasification: string;
  consignee: string;
  account_handler?: { full_name: string; image_path?: string | null } | null;
};

type CompanySection =
  | "basic_info"
  | "address"
  | "contacts"
  | "registration"
  | "pricing"
  | "operation"
  | "monitoring"
  | "documents"
  | "insights";

const companyApiPath = `${getApiBaseUrl()}/companies`;

const isFileValue = (value: unknown): value is File => value instanceof File;

const objectToFormData = (
  obj: Record<string, unknown> | Array<unknown>,
  form: FormData = new FormData(),
  namespace = "",
): FormData => {
  if (Array.isArray(obj)) {
    obj.forEach((value, index) => {
      const formKey = namespace ? `${namespace}[${index}]` : String(index);
      if (typeof value === "object" && value !== null && !isFileValue(value)) {
        objectToFormData(value as Record<string, unknown>, form, formKey);
      } else if (value !== undefined && value !== null) {
        form.append(formKey, value as Blob | string);
      }
    });
    return form;
  }

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const formKey = namespace ? `${namespace}[${key}]` : key;

    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      objectToFormData(value, form, formKey);
      return;
    }

    if (isFileValue(value)) {
      form.append(formKey, value);
      return;
    }

    if (typeof value === "object") {
      objectToFormData(value as Record<string, unknown>, form, formKey);
      return;
    }

    form.append(formKey, String(value));
  });

  return form;
};

const containsFile = (payload: unknown): boolean => {
  if (isFileValue(payload)) return true;
  if (Array.isArray(payload)) return payload.some(containsFile);
  if (payload && typeof payload === "object") {
    return Object.values(payload).some(containsFile);
  }
  return false;
};

const cleanNulls = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) {
    return undefined;
  }
  if (isFileValue(obj)) {
    return obj;
  }
  if (Array.isArray(obj)) {
    const cleaned = obj.map(cleanNulls).filter((item) => item !== undefined);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  if (typeof obj === "object") {
    const cleanedObject: Record<string, unknown> = {};
    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      const cleanedValue = cleanNulls(value);
      if (cleanedValue !== undefined) {
        cleanedObject[key] = cleanedValue;
      }
    });
    return Object.keys(cleanedObject).length > 0 ? cleanedObject : undefined;
  }
  return obj;
};

const normalizeAddressPayload = (payload: Record<string, unknown>): Record<string, unknown> => {
  const normalized = { ...payload };

  if (normalized.address && typeof normalized.address === "object" && !Array.isArray(normalized.address)) {
    const address = normalized.address as Record<string, unknown>;
    const normalizeArray = (value: unknown) => {
      if (!Array.isArray(value)) {
        return value;
      }
      return value
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object" && "address" in item) {
            const nested = (item as Record<string, unknown>).address;
            return typeof nested === "string" ? nested : undefined;
          }
          return undefined;
        })
        .filter((item): item is string => typeof item === "string");
    };

    normalized.address = {
      ...address,
      warehouse_addresses: normalizeArray(address.warehouse_addresses),
      delivery_addresses: normalizeArray(address.delivery_addresses),
    };
  }

  return normalized;
};

// Backend response for a single section (API only returns one section at a time)
type CompanyBackendDetails = {
  // Common fields
  id?: number | string;
  
  // basic_info section
  name?: string;
  trade_name?: string | null;
  consignee_used?: string | null;
  account_handler_id?: number | string;
  business_registration_number?: string | null;
  website?: string | null;
  years_in_operation?: number | string | null;
  activation_date?: string | null;
  transaction_type?: string | null;
  transaction_type_other?: string | null;
  client_classification?: string | null;
  client_classification_other?: string | null;
  company_type?: string | null;
  company_type_other?: string | null;
  business_type?: string | null;
  business_type_other?: string | null;
  industry?: string[] | string | null;
  account_handler?: {
    id?: number | string;
    full_name?: string;
    username?: string;
    role?: string;
    image_path?: string | null;
  } | null;
  
  // address section
  registered_address?: string | null;
  office_address?: string | null;
  warehouse_addresses?: Array<{ id?: number; company_id?: number; address?: string }> | null;
  delivery_addresses?: Array<{ id?: number; company_id?: number; address?: string }> | null;
  usual_port?: string | null;
  origin_country?: string | null;
  destination_country?: string | null;
  
  // registration section
  tin?: string | null;
  bir_registration_number?: string | null;
  cprs_status?: string | null;
  importer_accreditation_number?: string | null;
  importer_accreditation_expiry?: string | null;
  exporter_accreditation_number?: string | null;
  exporter_accreditation_expiry?: string | null;
  representatives?: Array<{ full_name?: string }> | null;
  special_permits?: string | null;
  compliance_risk?: string | null;
  
  // pricing section (returned as array, take first item)
  service_rate?: string | null;
  special_discounts?: string | null;
  "3pl_profit_range"?: string | null;
  notes?: string | null;
  
  // operation/instructions section (returned as array, take first item)
  preferred_communication_style?: string | null;
  response_time_expectation?: string | null;
  client_specific_sop?: string | null;
  approval_workflow?: string | null;
  pre_alert_details?: string | null;
  special_instructions?: string | null;
  
  // monitoring section (returned as array, take first item)
  past_issues?: string | null;
  penalties?: string | null;
  custom_flags?: string | null;
  payment_delays?: string | null;
  claims?: string | null;
  monitoring_notes?: string | null;
  
  // documents section (returned as array)
  documents?: Array<{ id?: number; file_name?: string; file_url?: string; file_type?: string; created_at?: string; updated_at?: string }> | null;
  
  // contacts section
  primary_contact?: { full_name?: string | null; position?: string | null; contact_number?: string | null; email?: string | null } | null;
  secondary_contact?: { full_name?: string | null; position?: string | null; contact_number?: string | null; email?: string | null } | null;
  billing_contact?: { full_name?: string | null; position?: string | null; contact_number?: string | null; email?: string | null } | null;
  
  // insights section (returned as array, take first item)
  growth?: string | null;
  expansion_plan?: string | null;
  competitors?: string | null;
  opportunities?: string | null;
  insight_notes?: string | null;
};

const getString = (...values: Array<string | undefined | null>): string | null => {
  for (const value of values) {
    if (value != null && value !== "") {
      return value;
    }
  }
  return null;
};

const mapBackendCompanyToFullDetails = (backend: CompanyBackendDetails | any): CompanyFullDetails => {
  // Some sections return an array of objects (pricing, operation, monitoring, documents, insights).
  // If an array is returned, use its first item as the source for mapping.
  const data = Array.isArray(backend) ? backend[0] ?? {} : backend ?? {};

  return {
    companyId: data.id?.toString(),
    summary: {
      companyName: getString(data.name, (data as any).companyName) ?? "",
      tradeName: getString(data.trade_name, (data as any).tradeName),
      consigneeUsed: getString(data.consignee_used, (data as any).consigneeUsed) ?? getString(data.consignee, null),
      accountHandler: getString(data.account_handler?.full_name, (data as any).accountHandler?.full_name),
      accountHandlerId: data.account_handler?.id != null ? String(data.account_handler.id) : null,
      transactionType: getString(data.transaction_type, (data as any).transactionType),
      clientClassification: getString(data.client_classification, (data as any).clientClassification) ?? getString(data.clasification, null),
      companyType: getString(data.company_type, (data as any).companyType),
      industry: getString(
        Array.isArray(data.industry) ? data.industry.join(", ") : data.industry,
        Array.isArray((data as any).industry) ? (data as any).industry.join(", ") : (data as any).industry,
      ),
      businessType: getString(data.business_type, (data as any).businessType),
      businessRegistrationNumber: getString(data.business_registration_number, (data as any).businessRegistrationNumber),
      website: getString(data.website, (data as any).website),
      yearsInOperation: getString(
        data.years_in_operation != null ? String(data.years_in_operation) : null,
        (data as any).yearsInOperation != null ? String((data as any).yearsInOperation) : null,
      ),
      dateOfActivation: getString(data.activation_date, (data as any).activationDate),
    },
    address: {
      registeredAddress: getString(data.registered_address, (data as any).registeredAddress),
      officeAddress: getString(data.office_address, (data as any).officeAddress),
      // Extract address strings from array of objects
      warehouseAddresses: (data.warehouse_addresses ?? [])
        .filter((item: any): item is { address?: string } => item !== null && item !== undefined)
        .map((item: any) => item.address ?? "")
        .filter(Boolean),
      deliveryAddresses: (data.delivery_addresses ?? [])
        .filter((item: any): item is { address?: string } => item !== null && item !== undefined)
        .map((item: any) => item.address ?? "")
        .filter(Boolean),
      portOfUsualEntryExit: getString(data.usual_port, data.port_of_usual_entry_exit, (data as any).portOfUsualEntryExit),
      countryOfOrigin: getString(data.origin_country, data.country_of_origin, (data as any).countryOfOrigin),
      countryOfDestination: getString(data.destination_country, data.country_of_destination, (data as any).countryOfDestination),
    },
    keyContacts: {
      primaryContact: data.primary_contact ? {
        fullName: data.primary_contact.full_name,
        position: data.primary_contact.position,
        contactNumber: data.primary_contact.contact_number,
        email: data.primary_contact.email,
      } : null,
      secondaryContact: data.secondary_contact ? {
        fullName: data.secondary_contact.full_name,
        position: data.secondary_contact.position,
        contactNumber: data.secondary_contact.contact_number,
        email: data.secondary_contact.email,
      } : null,
      billingContact: data.billing_contact ? {
        fullName: data.billing_contact.full_name,
        position: data.billing_contact.position,
        contactNumber: data.billing_contact.contact_number,
        email: data.billing_contact.email,
      } : null,
    },
    governmentCompliance: {
      tin: getString(data.tin, (data as any).tin),
      birRegistrationNumber: getString(data.bir_registration_number, (data as any).birRegistrationNumber),
      cprsStatus: getString(data.cprs_status, (data as any).cprsStatus),
      importerAccreditationNumber: getString(data.importer_accreditation_number, (data as any).importerAccreditationNumber),
      importerExpirationDate: getString(data.importer_accreditation_expiry, (data as any).importerExpirationDate),
      exporterAccreditationNumber: getString(data.exporter_accreditation_number, (data as any).exporterAccreditationNumber),
      exporterExpirationDate: getString(data.exporter_accreditation_expiry, (data as any).exporterExpirationDate),
      // Extract full_name from representatives array
      authorizedRepresentatives: (data.representatives ?? []).map((rep: any) => rep.full_name ?? "").filter(Boolean),
      specialPermits: getString(data.special_permits, (data as any).specialPermits),
      complianceRisk: getString(data.compliance_risk, (data as any).complianceRisk),
    },
    commercialInformation: {
      agreedServiceRates: getString(data.service_rate ?? data.agreed_service_rates, (data as any).agreedServiceRates),
      profitRangePercent: getString((data as any)["3pl_profit_range"] ?? (data as any).profit_range ?? (data as any).profitRangePercent, (data as any).profitRangePercent),
      specialDiscounts: getString(data.special_discounts ?? (data as any).specialDiscounts, (data as any).specialDiscounts),
      notes: getString(data.notes ?? (data as any).notes, (data as any).notes),
    },
    operationalInstructions: {
      preferredCommunicationStyle: getString(data.preferred_communication_style, (data as any).preferredCommunicationStyle),
      decisionMakingProcess: getString(data.decision_making_process, (data as any).decisionMakingProcess),
      responseTimeExpectation: getString(data.response_time_expectation, (data as any).responseTimeExpectation),
      clientSpecificSOP: getString(data.client_specific_sop, (data as any).clientSpecificSOP),
      approvalWorkflow: getString(data.approval_workflow, (data as any).approvalWorkflow),
      requiredPreAlertDetails: getString(data.pre_alert_details ?? data.required_pre_alert_details, (data as any).requiredPreAlertDetails),
      specialInstructions: getString(data.special_instructions, (data as any).specialInstructions),
    },
    riskIssueMonitoring: {
      pastIssues: getString(data.past_issues, (data as any).pastIssues),
      penalties: getString(data.penalties, (data as any).penalties),
      customFlags: getString(data.custom_flags, (data as any).customFlags),
      paymentDelays: getString(data.payment_delays, (data as any).paymentDelays),
      claims: getString(data.claims, (data as any).claims),
      notes: getString(data.notes, (data as any).notes, (data as any).monitoring_notes, (data as any).monitoringNotes),
    },
   documentsAttachments: (() => {
    // Convert various backend shapes into documents/attachments arrays.
    // Cases:
    // 1) The unwrapped payload is an array of file objects (e.g. [{file_name,...}, ...])
    // 2) The payload is an object with documents and/or attachments arrays
    const docs: Array<CompanyDocumentPayload> = [];
    const atts: Array<CompanyDocumentPayload> = [];

    const mapBackendFileItem = (item: any): CompanyDocumentPayload => ({
      id: item?.id != null ? item.id : undefined,
      filepath: getString(item?.filepath, item?.file_path, item?.filePath) ?? null,
      file_type: getString(item?.file_type, item?.fileType) ?? null,
      name: getString(item?.file_name, item?.name) ?? "",
      url: getString(item?.file_url, item?.url) ?? null,
      created_at: getString(item?.created_at) ?? undefined,
      updated_at: getString(item?.updated_at) ?? undefined,
    });

    if (Array.isArray(backend) && backend.length > 0) {
      const first = backend[0] as any;
      // Heuristic: if items look like file objects, map the whole array into documents
      if (first && (first.file_name || first.file_url || first.name || first.url)) {
        backend.forEach((doc: any) => {
          docs.push(mapBackendFileItem(doc));
        });
        return { documents: docs, attachments: atts };
      }
    }

    // Fallback: read documents/attachments from the data object (if present)
    (data.documents ?? []).forEach((doc: any) => docs.push(mapBackendFileItem(doc)));
    (data.attachments ?? []).forEach((att: any) => atts.push(mapBackendFileItem(att)));

    return { documents: docs, attachments: atts };
    })(),
    strategicInsight: {
      growthOptions: data.growth ? [data.growth] : undefined,
      keyInsights: getString(data.insight_notes ?? data.notes ?? (data as any).keyInsights, (data as any).keyInsights),
      expansionPlan: getString(data.expansion_plan, (data as any).expansionPlan),
      competitorsUsed: getString(data.competitors, (data as any).competitorsUsed),
      upsellingOpportunities: getString(data.opportunities, (data as any).upsellingOpportunities),
      notes: getString(data.insight_notes ?? data.notes, (data as any).notes),
    },
  };
};

export const companyService = {
  async getCompaniesList(
    page = 1,
    perPage = 10,
    filters?: Record<string, unknown>,
  ): Promise<CompanyListResponse> {
    const response = await GET<ApiResponse<unknown>>(`${companyApiPath}`, {
      params: { page, per_page: perPage, ...filters },
    });

    const payload = response.data as any;
    const listPayload = payload?.data ?? payload;

    const companiesData: CompanyListBackendItem[] = Array.isArray(listPayload)
      ? listPayload
      : Array.isArray(listPayload.companies)
      ? listPayload.companies
      : Array.isArray(listPayload.data)
      ? listPayload.data
      : [];

    const rows: CompanyTableRow[] = companiesData.map((company) => ({
      companyId: company.id,
      companyRouteId: company.id,
      companyName: company.name,
      classification: company.clasification,
      consignee: company.consignee,
      accountHandler: company.account_handler?.full_name ?? "",
      accountHandlerImagePath: company.account_handler?.image_path ?? undefined,
    }));

    const total =
      typeof listPayload?.total === "number"
        ? listPayload.total
        : typeof listPayload?.pagination?.total === "number"
        ? listPayload.pagination.total
        : rows.length;

    const totalPages =
      typeof listPayload?.totalPages === "number"
        ? listPayload.totalPages
        : typeof listPayload?.pagination?.total_pages === "number"
        ? listPayload.pagination.total_pages
        : Math.max(1, Math.ceil(total / perPage));

    return {
      data: rows,
      total,
      totalPages,
    };
  },

  async getCompanyById(id: string, section: CompanySection = "basic_info"): Promise<CompanyFullDetails> {
    // Use the ID as provided by the caller (keep backend route identifier unchanged)
    // Backend expects a numeric boolean flag per-section (e.g. basic_info=1)
    const params: Record<string, number> = {};
    if (section) params[section] = 1;

    console.debug(`[companyService] Fetching company: ${companyApiPath}/${id} with params`, params);

    const response = await GET<ApiResponse<CompanyBackendDetails>>(`${companyApiPath}/${id}`, {
      params,
    });

    console.debug(`[companyService] Response wrapper keys:`, Object.keys(response.data ?? {}));
    console.debug(`[companyService] Full response wrapper:`, response.data);

    // Some backend endpoints return an ApiResponse wrapper with a `data` field
    // that contains the actual section payload (sometimes as an array).
    const payloadCandidate = (response.data && (response.data as any).data) ? (response.data as any).data : response.data;
    const payload = Array.isArray(payloadCandidate) && payloadCandidate.length === 0 ? {} : payloadCandidate;

    console.debug(`[companyService] Unwrapped payload:`, payload);

    return mapBackendCompanyToFullDetails(payload ?? {});
  },

  async createCompany(payload: CompanyCreateRequest): Promise<CompanyFullDetails> {
    const normalizedPayload = normalizeAddressPayload(payload as Record<string, unknown>);
    const cleanedPayload = cleanNulls(normalizedPayload) as Record<string, unknown> | undefined;
    const payloadToSend = cleanedPayload ?? {};
    const hasFile = containsFile(payloadToSend);
    const requestData = hasFile ? objectToFormData(payloadToSend) : payloadToSend;
    const config = hasFile ? { headers: { "Content-Type": undefined } } : undefined;
    const response = await POST<ApiResponse<CompanyBackendDetails>>(`${companyApiPath}`, requestData, config);
    const payloadData = (response && (response as any).data) ? (response as any).data : response;
    return mapBackendCompanyToFullDetails(payloadData ?? {});
  },

  async updateCompany(id: string, payload: CompanyUpdateRequest | FormData): Promise<CompanyFullDetails> {
    const cleanNulls = (obj: any): any => {
      if (obj === null || obj === undefined) return undefined;
      if (isFileValue(obj)) return obj;
      if (Array.isArray(obj)) {
        const cleanedArray = obj.map(cleanNulls).filter((item) => item !== undefined);
        return cleanedArray;
      }
      if (typeof obj === "object") {
        const cleanedObject: Record<string, unknown> = {};
        Object.entries(obj).forEach(([key, value]) => {
          const cleanedValue = cleanNulls(value);
          if (cleanedValue !== undefined) {
            cleanedObject[key] = cleanedValue;
          }
        });
        return Object.keys(cleanedObject).length > 0 ? cleanedObject : undefined;
      }
      return obj;
    };

    const formDataFromObject = (obj: Record<string, unknown>, form: FormData = new FormData(), namespace = ""): FormData => {
      Object.entries(obj).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return;
        }

        const formKey = namespace ? `${namespace}[${key}]` : key;

        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item === undefined || item === null) return;
            if (item instanceof File) {
              form.append(`${formKey}[${index}][file]`, item);
            } else if (typeof item === "object") {
              formDataFromObject(item as Record<string, unknown>, form, `${formKey}[${index}]`);
            } else {
              form.append(`${formKey}[${index}]`, String(item));
            }
          });
          return;
        }

        if (isFileValue(value)) {
          form.append(formKey, value);
          return;
        }

        if (typeof value === "object") {
          formDataFromObject(value as Record<string, unknown>, form, formKey);
          return;
        }

        form.append(formKey, String(value));
      });

      return form;
    };

    try {
      let requestData: FormData;
      if (payload instanceof FormData) {
        requestData = payload;
      } else {
        const normalizedPayload = normalizeAddressPayload(payload as Record<string, unknown>);
        const cleaned = cleanNulls(normalizedPayload) ?? {};
        console.debug(`[companyService] updateCompany payload (cleaned) for id=${id}:`, cleaned);
        requestData = formDataFromObject(cleaned as Record<string, unknown>);
        requestData.append("_method", "PUT");
      }

      const config = { headers: { "Content-Type": undefined } };
      const response = await POST<ApiResponse<CompanyBackendDetails>>(`${companyApiPath}/${id}`, requestData, config);
      const payloadData = (response && (response as any).data) ? (response as any).data : response;
      return mapBackendCompanyToFullDetails(payloadData ?? {});
    } catch (err: any) {
      // Log raw payload for debugging if cleaning/POST fails
      console.error(`[companyService] updateCompany failed for id=${id}. Raw payload:`, payload);
      // If axios style response exists, log status and data
      if (err?.response) {
        try {
          console.error(`[companyService] updateCompany response status: ${err.response.status}`);
          console.error(`[companyService] updateCompany response data:`, err.response.data);
        } catch (inner) {
          console.error("Error while logging response details", inner);
        }
      }
      throw err;
    }
  },

  async archiveCompany(id: string): Promise<{ success: boolean }> {
    const response = await POST<ApiResponse<{ success: boolean }>>(`${companyApiPath}/${id}/archive`);
    return response.data;
  },

  async uploadDocuments(id: string, files: File[]): Promise<Array<{ name: string; url: string }>> {
    const endpoints = [
      `${companyApiPath}/${id}/documents`,
      `${companyApiPath}/${id}/attachments`,
      `${companyApiPath}/documents/${id}`,
      `${companyApiPath}/document/${id}`,
    ];

    const config = { headers: { "Content-Type": undefined } };
    let lastError: unknown = null;

    for (const endpoint of endpoints) {
      try {
        const uploads: Array<{ name: string; url: string }> = [];

        for (const file of files) {
          const form = new FormData();
          form.append("file", file);
          const response = await POST<ApiResponse<{ name: string; url: string }>>(
            endpoint,
            form,
            config,
          );
          uploads.push(response.data);
        }

        return uploads;
      } catch (error: any) {
        lastError = error;
        if (error?.response?.status === 404) {
          continue;
        }
        throw error;
      }
    }

    throw lastError ?? new Error("Company document upload endpoint not found.");
  },
};
