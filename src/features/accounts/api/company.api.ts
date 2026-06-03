import type {
  CompanyTableRow,
  CompanyListResponse,
  CompanyFullDetails,
  CompanyCreateRequest,
  CompanyUpdateRequest,
} from "../types/company.types";

export interface CompanyAPI {
  /** GET /companies */
  getCompaniesList: (
    page?: number,
    perPage?: number,
    filters?: {
      search?: string;
      classification?: string;
      companyType?: string;
    },
  ) => Promise<CompanyListResponse>;

  /** GET /companies/:id?section=:section */
  getCompanyById: (
    id: string,
    section?: "basic_info" | "address" | "contacts" | "registration" | "pricing" | "operation" | "monitoring" | "documents" | "insights",
  ) => Promise<CompanyFullDetails>;

  /** POST /companies */
  createCompany: (payload: CompanyCreateRequest) => Promise<CompanyFullDetails>;

  /** PUT /companies/:id */
  updateCompany: (id: string, payload: CompanyUpdateRequest) => Promise<CompanyFullDetails>;

  /** POST /companies/:id/archive */
  archiveCompany: (id: string) => Promise<{ success: boolean }>;
}
