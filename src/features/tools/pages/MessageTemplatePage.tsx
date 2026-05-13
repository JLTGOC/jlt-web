import { useMemo, useState } from "react";
import { Button } from "@mantine/core";
import { Add } from "@nine-thirty-five/material-symbols-react/rounded";
import { useQuery } from "@tanstack/react-query";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { PageCard } from "@/components/PageCard";
import {
  messageTemplatesService,
  type MessageTemplateResource,
} from "@/features/tools/api/message-templates.service";
import { MessageTemplateModal } from "@/features/tools/components/MessageTemplateModal";
import { toolsQueryKeys } from "@/features/tools/config/queryKeys";
import { useMessageTemplateMutations } from "../hooks/useMessageTemplateMutations";

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<MessageTemplateResource | null>(null);

  const {
    createMutation,
    updateMutation,
    deleteMutation,
    fieldErrors,
    clearFieldErrors,
  } = useMessageTemplateMutations();

  const { data: messageTemplatesResponse } = useQuery({
    queryKey: toolsQueryKeys.messageTemplates,
    queryFn: () => messageTemplatesService.getMessageTemplates(),
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
    clearFieldErrors();
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    clearFieldErrors();
    setModalOpened(true);
  };

  const openEditModal = (template: MessageTemplateResource) => {
    setEditingTemplate(template);
    clearFieldErrors();
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
            updateMutation.mutate(
              { id: editingTemplate.id, payload: values },
              { onSuccess: closeModal },
            );
            return;
          }

          createMutation.mutate(values, { onSuccess: closeModal });
        }}
      />
    </PageCard>
  );
}
