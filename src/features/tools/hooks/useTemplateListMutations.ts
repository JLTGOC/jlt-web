import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QuotationTemplateResource } from "@/types/templates";
import { templatesService } from "../api/templates.service";
import { toolsQueryKeys } from "../config/queryKeys";
import { toolNotifications } from "../utils/toolNotifications";

type TemplatesQueryData = { data?: QuotationTemplateResource[] } | undefined;

export function useTemplateListMutations() {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      templatesService.toggleTemplateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: toolsQueryKeys.templates });
      const previous = queryClient.getQueryData<TemplatesQueryData>(
        toolsQueryKeys.templates,
      );

      queryClient.setQueryData(
        toolsQueryKeys.templates,
        (current: TemplatesQueryData) => ({
          ...current,
          data: (current?.data ?? []).map((template) =>
            template.id === id ? { ...template, is_active: status } : template,
          ),
        }),
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsQueryKeys.templates });
      toolNotifications.success("Template status updated");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(toolsQueryKeys.templates, context.previous);
      }
      toolNotifications.error("Failed to update template status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => templatesService.deleteTemplate(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: toolsQueryKeys.templates });
      const previous = queryClient.getQueryData<TemplatesQueryData>(
        toolsQueryKeys.templates,
      );

      queryClient.setQueryData(
        toolsQueryKeys.templates,
        (current: TemplatesQueryData) => ({
          ...current,
          data: (current?.data ?? []).filter((template) => template.id !== id),
        }),
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsQueryKeys.templates });
      toolNotifications.success("Template deleted successfully");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(toolsQueryKeys.templates, context.previous);
      }
      toolNotifications.error("Failed to delete template");
    },
  });

  return { toggleMutation, deleteMutation };
}
