import { GET, POST, PUT } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  CompanyListResponse,
  CompanyFullDetails,
  CompanyCreateRequest,
  CompanyUpdateRequest,
} from "../types/company.types";

export const companyService = {
  async getCompaniesList(
    page = 1,
    perPage = 10,
    filters?: Record<string, unknown>,
  ): Promise<CompanyListResponse> {
    const response = await GET<ApiResponse<CompanyListResponse>>("/companies", {
      params: { page, per_page: perPage, ...filters },
    });
    return response.data;
  },

  async getCompanyById(id: string): Promise<CompanyFullDetails> {
    const response = await GET<ApiResponse<CompanyFullDetails>>(`/companies/${id}`);
    return response.data;
  },

  async createCompany(payload: CompanyCreateRequest): Promise<CompanyFullDetails> {
    const response = await POST<ApiResponse<CompanyFullDetails>>("/companies", payload);
    return response.data;
  },

  async updateCompany(id: string, payload: CompanyUpdateRequest): Promise<CompanyFullDetails> {
    const response = await PUT<ApiResponse<CompanyFullDetails>>(`/companies/${id}`, payload);
    return response.data;
  },

  async archiveCompany(id: string): Promise<{ success: boolean }> {
    const response = await POST<ApiResponse<{ success: boolean }>>(`/companies/${id}/archive`);
    return response.data;
  },
};
