import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StandardTemplateSummaryResource } from "../api/standard-templates.service";
import { standardTemplatesService } from "../api/standard-templates.service";
import { toolsQueryKeys } from "../config/queryKeys";
import { toolNotifications } from "../utils/toolNotifications";

type StandardTemplatesQueryData =
  | { data?: StandardTemplateSummaryResource[] }
  | undefined;

export function useStandardTemplateListMutations() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      standardTemplatesService.deleteStandardTemplate(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.standardTemplates,
      });
      const previous = queryClient.getQueryData<StandardTemplatesQueryData>(
        toolsQueryKeys.standardTemplates,
      );

      queryClient.setQueryData(
        toolsQueryKeys.standardTemplates,
        (current: StandardTemplatesQueryData) => ({
          ...current,
          data: (current?.data ?? []).filter((item) => item.id !== id),
        }),
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.standardTemplates,
      });
      toolNotifications.success("Template deleted successfully");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.standardTemplates,
          context.previous,
        );
      }
      toolNotifications.error("Failed to delete template");
    },
  });

  return { deleteMutation };
}
