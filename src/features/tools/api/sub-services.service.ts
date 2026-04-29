import { DELETE, GET, POST, PUT } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

export type SubServiceStatus = "ENABLED" | "DISABLED";

export interface SubServiceResource {
  id: number;
  name: string;
  status: SubServiceStatus;
  service_type: "IMPORT" | "EXPORT" | "BUSINESS SOLUTION";
}

export interface StoreSubServiceRequest {
  name: string;
  service_type_id: number;
  service_type?: SubServiceResource["service_type"];
}

export interface UpdateSubServiceRequest {
  name?: string;
  status?: SubServiceStatus;
}

export const subServicesService = {
  async getSubServices(
    serviceType: SubServiceResource["service_type"],
  ): Promise<ApiResponse<SubServiceResource[]>> {
    return GET<ApiResponse<SubServiceResource[]>>("/sub-services", {
      params: { service_type: serviceType },
    });
  },

  async createSubService(
    payload: StoreSubServiceRequest,
  ): Promise<ApiResponse<SubServiceResource>> {
    return POST<ApiResponse<SubServiceResource>>("/sub-services", payload);
  },

  async updateSubService(
    id: number,
    payload: UpdateSubServiceRequest,
  ): Promise<ApiResponse<SubServiceResource>> {
    return PUT<ApiResponse<SubServiceResource>>(`/sub-services/${id}`, payload);
  },

  async deleteSubService(id: number): Promise<ApiResponse<null>> {
    return DELETE<ApiResponse<null>>(`/sub-services/${id}`);
  },
};
