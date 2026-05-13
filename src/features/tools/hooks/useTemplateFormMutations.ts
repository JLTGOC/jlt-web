import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  QuotationTemplateResource,
  StoreTemplateRequest,
  UpdateTemplateRequest,
} from "@/types/templates";
import { templatesService } from "../api/templates.service";
import { toolsQueryKeys } from "../config/queryKeys";
import { toolNotifications } from "../utils/toolNotifications";

type TemplatesQueryData = { data?: QuotationTemplateResource[] } | undefined;

type TemplateDetailQueryData = { data?: QuotationTemplateResource } | undefined;

export function useTemplateFormMutations(templateId?: string) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: StoreTemplateRequest) =>
      templatesService.createTemplate(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: toolsQueryKeys.templates });

      const previousTemplates = queryClient.getQueryData<TemplatesQueryData>(
        toolsQueryKeys.templates,
      );
      const optimisticTemplate: QuotationTemplateResource = {
        id: Date.now(),
        name: payload.name,
        service_type: payload.service_type,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData(
        toolsQueryKeys.templates,
        (current: TemplatesQueryData) => ({
          ...current,
          data: [...(current?.data ?? []), optimisticTemplate],
        }),
      );

      return { previousTemplates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsQueryKeys.templates });
      toolNotifications.success("Template created successfully");
    },
    onError: (_error, _payload, context) => {
      queryClient.setQueryData(
        toolsQueryKeys.templates,
        context?.previousTemplates,
      );
      toolNotifications.error("Failed to create template");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateTemplateRequest) =>
      templatesService.updateTemplate(Number(templateId), payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: toolsQueryKeys.templates });
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.template(templateId),
      });

      const previousTemplates = queryClient.getQueryData<TemplatesQueryData>(
        toolsQueryKeys.templates,
      );
      const previousTemplate =
        queryClient.getQueryData<TemplateDetailQueryData>(
          toolsQueryKeys.template(templateId),
        );

      queryClient.setQueryData(
        toolsQueryKeys.templates,
        (current: TemplatesQueryData) => ({
          ...current,
          data: (current?.data ?? []).map((template) =>
            template.id === Number(templateId)
              ? { ...template, name: payload.name }
              : template,
          ),
        }),
      );

      return { previousTemplates, previousTemplate };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsQueryKeys.templates });
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.template(templateId),
      });
      toolNotifications.success("Template updated successfully");
    },
    onError: (_error, _payload, context) => {
      queryClient.setQueryData(
        toolsQueryKeys.templates,
        context?.previousTemplates,
      );
      queryClient.setQueryData(
        toolsQueryKeys.template(templateId),
        context?.previousTemplate,
      );
      toolNotifications.error("Failed to update template");
    },
  });

  return { createMutation, updateMutation };
}
