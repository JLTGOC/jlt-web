import { useMemo, useState } from "react";
import { Button } from "@mantine/core";
import { Add } from "@nine-thirty-five/material-symbols-react/rounded";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { PageCard } from "@/components/PageCard";
import {
  messageTemplatesService,
  type MessageTemplateResource,
} from "@/features/tools/api/message-templates.service";
import { toolsQueryKeys } from "@/features/tools/config/queryKeys";

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);

  const { data: messageTemplatesResponse } = useQuery({
    queryKey: toolsQueryKeys.messageTemplates,
    queryFn: () => messageTemplatesService.getMessageTemplates(),
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

  return (
    <PageCard
      title="List of Messages Template"
      showDivider
      action={
        <Button
          leftSection={<Add />}
          color="jltAccent.6"
          h="2.4375rem"
          onClick={() => {
            notifications.show({
              title: "Info",
              message: "Create message template flow is not wired yet",
              color: "blue",
            });
          }}
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
          onClick: () => {
            notifications.show({
              title: "Info",
              message: "Edit message template flow is not wired yet",
              color: "blue",
            });
          },
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
    </PageCard>
  );
}
