 import { DELETE, GET } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

export interface MessageTemplateResource {
  id: number;
  template_name: string;
  message: string;
}

export const messageTemplatesService = {
  async getMessageTemplates(): Promise<ApiResponse<MessageTemplateResource[]>> {
    return GET<ApiResponse<MessageTemplateResource[]>>("/message-templates");
  },

  async deleteMessageTemplate(id: number): Promise<ApiResponse<null>> {
    return DELETE<ApiResponse<null>>(`/message-templates/${id}`);
  },
};
