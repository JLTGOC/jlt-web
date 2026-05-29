import { GET, POST, PUT } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  CompanyListResponse,
  CompanyFullDetails,
  CompanyCreateRequest,
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

const normalizeCompanyRouteId = (companyId: string): string => {
  const match = /^C0*(\d+)$/i.exec(companyId);
  return match ? match[1] : companyId;
};

export const companyService = {
  async getCompaniesList(
    page = 1,
    perPage = 10,
    filters?: Record<string, unknown>,
  ): Promise<CompanyListResponse> {
    const response = await GET<ApiResponse<CompanyListBackendItem[]>>("/companies", {
      params: { page, per_page: perPage, ...filters },
    });

    const rows: CompanyTableRow[] = (response.data ?? []).map((company) => ({
      companyId: company.id,
      companyRouteId: normalizeCompanyRouteId(company.id),
      companyName: company.name,
      classification: company.clasification,
      consignee: company.consignee,
      accountHandler: company.account_handler?.full_name ?? "",
      accountHandlerImagePath: company.account_handler?.image_path ?? undefined,
    }));

    return {
      data: rows,
      total: rows.length,
      totalPages: 1,
    };
  },

  async getCompanyById(id: string): Promise<CompanyFullDetails> {
    const normalizedId = normalizeCompanyRouteId(id);
    const response = await GET<ApiResponse<CompanyFullDetails>>(`/companies/${normalizedId}`);
    return response.data;
  },

  async createCompany(payload: CompanyCreateRequest): Promise<CompanyFullDetails> {
    const response = await POST<ApiResponse<CompanyFullDetails>>("/companies", payload);
    return response.data;
  },

  async updateCompany(id: string, payload: CompanyUpdateRequest): Promise<CompanyFullDetails> {
    const normalizedId = normalizeCompanyRouteId(id);
    const response = await PUT<ApiResponse<CompanyFullDetails>>(`/companies/${normalizedId}`, payload);
    return response.data;
  },

  async archiveCompany(id: string): Promise<{ success: boolean }> {
    const normalizedId = normalizeCompanyRouteId(id);
    const response = await POST<ApiResponse<{ success: boolean }>>(`/companies/${normalizedId}/archive`);
    return response.data;
  },

  async uploadDocuments(id: string, files: File[]): Promise<Array<{ name: string; url: string }>> {
    const normalizedId = normalizeCompanyRouteId(id);
    const form = new FormData();
    files.forEach((file) => form.append("files", file));

    const response = await POST<ApiResponse<Array<{ name: string; url: string }>>>(
      `/companies/${normalizedId}/documents`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },
};
