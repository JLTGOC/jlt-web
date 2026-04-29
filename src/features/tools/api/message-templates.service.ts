import { DELETE, GET, POST, PUT } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

export interface MessageTemplateResource {
  id: number;
  template_name: string;
  message: string;
}
export interface CreateMessageTemplateRequest {
  template_name: string;
  message: string;
}

export interface UpdateMessageTemplateRequest {
  template_name?: string;
  message?: string;
}

export const messageTemplatesService = {
  async getMessageTemplates(): Promise<ApiResponse<MessageTemplateResource[]>> {
    return GET<ApiResponse<MessageTemplateResource[]>>("/message-templates");
  },

  async createMessageTemplate(
    data: CreateMessageTemplateRequest,
  ): Promise<ApiResponse<MessageTemplateResource>> {
    return POST<ApiResponse<MessageTemplateResource>>(
      "/message-templates",
      data,
    );
  },

  async updateMessageTemplate(
    id: number,
    data: UpdateMessageTemplateRequest,
  ): Promise<ApiResponse<MessageTemplateResource>> {
    return PUT<ApiResponse<MessageTemplateResource>>(
      `/message-templates/${id}`,
      data,
    );
  },

  async deleteMessageTemplate(id: number): Promise<ApiResponse<null>> {
    return DELETE<ApiResponse<null>>(`/message-templates/${id}`);
  },
};
