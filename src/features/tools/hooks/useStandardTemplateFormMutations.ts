import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  StandardTemplateSummaryResource,
  StoreStandardTemplateRequest,
} from "../api/standard-templates.service";
import { standardTemplatesService } from "../api/standard-templates.service";
import { toolsQueryKeys } from "../config/queryKeys";
import { toolNotifications } from "../utils/toolNotifications";

type StandardTemplatesQueryData =
  | { data?: StandardTemplateSummaryResource[] }
  | undefined;

type StandardTemplateQueryData =
  | { data?: StoreStandardTemplateRequest & { id?: number } }
  | undefined;

export function useStandardTemplateFormMutations(templateId?: string) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: StoreStandardTemplateRequest) =>
      standardTemplatesService.createStandardTemplate(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.standardTemplates,
      });

      const previousTemplates =
        queryClient.getQueryData<StandardTemplatesQueryData>(
          toolsQueryKeys.standardTemplates,
        );

      const optimisticItem: StandardTemplateSummaryResource = {
        id: Date.now(),
        template_name: payload.template_name,
      };

      queryClient.setQueryData(
        toolsQueryKeys.standardTemplates,
        (current: StandardTemplatesQueryData) => ({
          ...current,
          data: [...(current?.data ?? []), optimisticItem],
        }),
      );

      return { previousTemplates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.standardTemplates,
      });
      toolNotifications.success(
        "Standard quotation template created successfully",
      );
    },
    onError: (_error, _payload, context) => {
      if (context?.previousTemplates) {
        queryClient.setQueryData(
          toolsQueryKeys.standardTemplates,
          context.previousTemplates,
        );
      }

      toolNotifications.error("Failed to create standard quotation template");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: StoreStandardTemplateRequest) =>
      standardTemplatesService.updateStandardTemplate(
        Number(templateId),
        payload,
      ),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.standardTemplates,
      });
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.standardTemplate(templateId),
      });

      const previousTemplates =
        queryClient.getQueryData<StandardTemplatesQueryData>(
          toolsQueryKeys.standardTemplates,
        );
      const previousTemplate =
        queryClient.getQueryData<StandardTemplateQueryData>(
          toolsQueryKeys.standardTemplate(templateId),
        );

      queryClient.setQueryData(
        toolsQueryKeys.standardTemplates,
        (current: StandardTemplatesQueryData) => ({
          ...current,
          data: (current?.data ?? []).map((item) =>
            String(item.id) === String(templateId)
              ? { ...item, template_name: payload.template_name }
              : item,
          ),
        }),
      );

      queryClient.setQueryData(
        toolsQueryKeys.standardTemplate(templateId),
        (current: StandardTemplateQueryData) => ({
          ...current,
          data: {
            ...(current?.data ?? {}),
            ...payload,
          },
        }),
      );

      return { previousTemplates, previousTemplate };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.standardTemplates,
      });
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.standardTemplate(templateId),
      });
      toolNotifications.success(
        "Standard quotation template updated successfully",
      );
    },
    onError: (_error, _payload, context) => {
      if (context?.previousTemplates) {
        queryClient.setQueryData(
          toolsQueryKeys.standardTemplates,
          context.previousTemplates,
        );
      }

      if (context?.previousTemplate) {
        queryClient.setQueryData(
          toolsQueryKeys.standardTemplate(templateId),
          context.previousTemplate,
        );
      }

      toolNotifications.error("Failed to update standard quotation template");
    },
  });

  return { createMutation, updateMutation };
}
