import type {
  CompanyTableRow,
  CompanyListResponse,
  CompanyFullDetails,
  CompanyCreateRequest,
  CompanyUpdateRequest,
} from "../types/company.types";

export interface CompanyAPI {
  /** GET http://localhost:8000/api/companies */
  getCompaniesList: (
    page?: number,
    perPage?: number,
    filters?: {
      search?: string;
      classification?: string;
      companyType?: string;
    },
  ) => Promise<CompanyListResponse>;

  /** GET http://localhost:8000/api/companies/{company}?section=:section */
  getCompanyById: (
    id: string,
    section?: "basic_info" | "address" | "contacts" | "registration" | "pricing" | "operation" | "monitoring" | "documents" | "insights",
  ) => Promise<CompanyFullDetails>;

  /** POST http://localhost:8000/api/companies */
  createCompany: (payload: CompanyCreateRequest) => Promise<CompanyFullDetails>;

  /** PUT http://localhost:8000/api/companies/{company} */
  updateCompany: (id: string, payload: CompanyUpdateRequest) => Promise<CompanyFullDetails>;

  /** POST http://localhost:8000/api/companies/{company}/archive */
  archiveCompany: (id: string) => Promise<{ success: boolean }>;
}
