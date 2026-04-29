import { useMemo, useState } from "react";
import { AxiosError } from "axios";
import { Button } from "@mantine/core";
import { Add } from "@nine-thirty-five/material-symbols-react/rounded";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { PageCard } from "@/components/PageCard";
import {
  messageTemplatesService,
  type CreateMessageTemplateRequest,
  type MessageTemplateResource,
  type UpdateMessageTemplateRequest,
} from "@/features/tools/api/message-templates.service";
import { MessageTemplateModal } from "@/features/tools/components/MessageTemplateModal";
import { toolsQueryKeys } from "@/features/tools/config/queryKeys";

type MessageTemplateQueryData =
  | { data?: MessageTemplateResource[] }
  | undefined;

type FormFieldErrors = Partial<Record<"template_name" | "message", string>>;

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

function parseApiErrors(error: unknown): {
  message: string;
  fieldErrors: FormFieldErrors;
} {
  const fallback = {
    message: "Something went wrong. Please try again.",
    fieldErrors: {},
  };

  if (!(error instanceof AxiosError)) {
    return fallback;
  }

  const data = error.response?.data as ApiErrorBody | undefined;
  const validationErrors = data?.errors ?? {};
  const fieldErrors: FormFieldErrors = {
    template_name: validationErrors.template_name?.[0],
    message: validationErrors.message?.[0],
  };

  const errorMessage =
    data?.message ||
    fieldErrors.template_name ||
    fieldErrors.message ||
    fallback.message;

  return {
    message: errorMessage,
    fieldErrors,
  };
}

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<MessageTemplateResource | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});

  const { data: messageTemplatesResponse } = useQuery({
    queryKey: toolsQueryKeys.messageTemplates,
    queryFn: () => messageTemplatesService.getMessageTemplates(),
  });

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
      notifications.show({
        title: "Success",
        message: "Message template created successfully",
        color: "teal",
      });
      closeModal();
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.messageTemplates,
          context.previous,
        );
      }

      const parsed = parseApiErrors(error);
      setFieldErrors(parsed.fieldErrors);
      notifications.show({
        title: "Error",
        message: parsed.message,
        color: "red",
      });
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
      notifications.show({
        title: "Success",
        message: "Message template updated successfully",
        color: "teal",
      });
      closeModal();
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.messageTemplates,
          context.previous,
        );
      }

      const parsed = parseApiErrors(error);
      setFieldErrors(parsed.fieldErrors);
      notifications.show({
        title: "Error",
        message: parsed.message,
        color: "red",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      messageTemplatesService.deleteMessageTemplate(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.messageTemplates,
      });
      const previous = queryClient.getQueryData(
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
      notifications.show({
        title: "Success",
        message: "Message template deleted successfully",
        color: "teal",
      });
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.messageTemplates,
          context.previous,
        );
      }
      notifications.show({
        title: "Error",
        message: "Failed to delete message template",
        color: "red",
      });
    },
  });

  const messageTemplates = useMemo(
    () => messageTemplatesResponse?.data ?? [],
    [messageTemplatesResponse?.data],
  );

  const filteredTemplates = useMemo(() => {
    if (!search) {
      return messageTemplates;
    }

    const keyword = search.toLowerCase();
    return messageTemplates.filter((template) =>
      template.template_name.toLowerCase().includes(keyword),
    );
  }, [search, messageTemplates]);

  const paginatedTemplates = useMemo(
    () => filteredTemplates.slice(0, perPage),
    [filteredTemplates, perPage],
  );

  const columns: AppTableColumn<MessageTemplateResource>[] = useMemo(
    () => [
      {
        key: "template_name",
        label: "MSG NAME",
      },
    ],
    [],
  );

  const isMutating = createMutation.isPending || updateMutation.isPending;

  const closeModal = () => {
    setModalOpened(false);
    setEditingTemplate(null);
    setFieldErrors({});
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    setFieldErrors({});
    setModalOpened(true);
  };

  const openEditModal = (template: MessageTemplateResource) => {
    setEditingTemplate(template);
    setFieldErrors({});
    setModalOpened(true);
  };

  return (
    <PageCard
      title="List of Messages Template"
      showDivider
      action={
        <Button
          leftSection={<Add />}
          color="jltAccent.6"
          h="2.4375rem"
          tt={"uppercase"}
          onClick={openCreateModal}
        >
          Message
        </Button>
      }
      fullHeight
    >
      <AppTable
        columns={columns}
        data={paginatedTemplates}
        rowKey={(row) => row.id}
        withNumbering={{ label: "No" }}
        withEdit={{
          onClick: openEditModal,
          tooltip: "Edit message template",
        }}
        withDelete={{
          onClick: (row) => deleteMutation.mutate(row.id),
          tooltip: "Delete message template",
          confirmMessage: (row) =>
            `Are you sure you want to delete "${row.template_name}"?`,
        }}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={filteredTemplates.length}
        showingCount={paginatedTemplates.length}
        searchPlaceholder="SEARCH MESSAGE TEMPLATE"
        searchValue={search}
        onSearchChange={setSearch}
      />

      <MessageTemplateModal
        key={editingTemplate ? `edit-${editingTemplate.id}` : "create"}
        opened={modalOpened}
        mode={editingTemplate ? "edit" : "create"}
        initialValues={
          editingTemplate
            ? {
                template_name: editingTemplate.template_name,
                message: editingTemplate.message,
              }
            : undefined
        }
        isSubmitting={isMutating}
        fieldErrors={fieldErrors}
        onClose={closeModal}
        onSubmit={(values) => {
          if (editingTemplate) {
            updateMutation.mutate({ id: editingTemplate.id, payload: values });
            return;
          }

          createMutation.mutate(values);
        }}
      />
    </PageCard>
  );
}
