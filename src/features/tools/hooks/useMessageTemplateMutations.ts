import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  messageTemplatesService,
  type CreateMessageTemplateRequest,
  type MessageTemplateResource,
  type UpdateMessageTemplateRequest,
} from "../api/message-templates.service";
import { toolsQueryKeys } from "../config/queryKeys";
import {
  parseMessageTemplateErrors,
  type FormFieldErrors,
} from "../utils/messageTemplateErrors";
import { toolNotifications } from "../utils/toolNotifications";

type MessageTemplateQueryData =
  | { data?: MessageTemplateResource[] }
  | undefined;

export function useMessageTemplateMutations() {
  const queryClient = useQueryClient();
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});

  const createMutation = useMutation({
    mutationFn: (payload: CreateMessageTemplateRequest) =>
      messageTemplatesService.createMessageTemplate(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.messageTemplates,
      });
      const previous = queryClient.getQueryData<MessageTemplateQueryData>(
        toolsQueryKeys.messageTemplates,
      );

      queryClient.setQueryData(
        toolsQueryKeys.messageTemplates,
        (current: MessageTemplateQueryData) => ({
          ...current,
          data: [
            ...(current?.data ?? []),
            {
              id: Date.now(),
              template_name: payload.template_name,
              message: payload.message,
            },
          ],
        }),
      );

      setFieldErrors({});
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.messageTemplates,
      });
      toolNotifications.success("Message template created successfully");
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.messageTemplates,
          context.previous,
        );
      }

      const parsed = parseMessageTemplateErrors(error);
      setFieldErrors(parsed.fieldErrors);
      toolNotifications.error(parsed.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateMessageTemplateRequest;
    }) => messageTemplatesService.updateMessageTemplate(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.messageTemplates,
      });
      const previous = queryClient.getQueryData<MessageTemplateQueryData>(
        toolsQueryKeys.messageTemplates,
      );

      queryClient.setQueryData(
        toolsQueryKeys.messageTemplates,
        (current: MessageTemplateQueryData) => ({
          ...current,
          data: (current?.data ?? []).map((item) =>
            item.id === id
              ? {
                  ...item,
                  template_name: payload.template_name ?? item.template_name,
                  message: payload.message ?? item.message,
                }
              : item,
          ),
        }),
      );

      setFieldErrors({});
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.messageTemplates,
      });
      toolNotifications.success("Message template updated successfully");
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.messageTemplates,
          context.previous,
        );
      }

      const parsed = parseMessageTemplateErrors(error);
      setFieldErrors(parsed.fieldErrors);
      toolNotifications.error(parsed.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      messageTemplatesService.deleteMessageTemplate(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.messageTemplates,
      });
      const previous = queryClient.getQueryData<MessageTemplateQueryData>(
        toolsQueryKeys.messageTemplates,
      );

      queryClient.setQueryData(
        toolsQueryKeys.messageTemplates,
        (current: { data?: MessageTemplateResource[] } | undefined) => ({
          ...current,
          data: (current?.data ?? []).filter((item) => item.id !== id),
        }),
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.messageTemplates,
      });
      toolNotifications.success("Message template deleted successfully");
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.messageTemplates,
          context.previous,
        );
      }
      toolNotifications.error("Failed to delete message template");
    },
  });

  const clearFieldErrors = () => setFieldErrors({});

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    fieldErrors,
    clearFieldErrors,
  };
}
