import { Button } from "@mantine/core";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Add } from "@nine-thirty-five/material-symbols-react/rounded";
import { PageCard } from "@/components/PageCard";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { toolsQueryKeys } from "../config/queryKeys";
import { useStandardTemplateListMutations } from "../hooks/useStandardTemplateListMutations";
import {
  standardTemplatesService,
  type StandardTemplateSummaryResource,
} from "../api/standard-templates.service";

export function StandardQuotationTemplatePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);

  const { data: templatesResponse } = useQuery({
    queryKey: toolsQueryKeys.standardTemplates,
    queryFn: () => standardTemplatesService.getStandardTemplates(),
  });

  const { deleteMutation } = useStandardTemplateListMutations();

  const templates = useMemo(
    () => templatesResponse?.data ?? [],
    [templatesResponse?.data],
  );

  const filteredTemplates = useMemo(() => {
    if (!search) {
      return templates;
    }

    const keyword = search.toLowerCase();
    return templates.filter((template) =>
      template.template_name.toLowerCase().includes(keyword),
    );
  }, [search, templates]);

  const paginatedTemplates = useMemo(
    () => filteredTemplates.slice(0, perPage),
    [filteredTemplates, perPage],
  );

  const columns: AppTableColumn<StandardTemplateSummaryResource>[] = useMemo(
    () => [
      {
        key: "template_name",
        label: "NAME OF TEMPLATES",
      },
    ],
    [],
  );

  const handleEdit = (row: StandardTemplateSummaryResource) => {
    navigate(
      `/tools/templates/config/standard-quotation-template/${row.id}/edit`,
    );
  };

  const handleDelete = (row: StandardTemplateSummaryResource) => {
    deleteMutation.mutate(row.id);
  };

  const handleAddTemplate = () => {
    navigate("/tools/templates/config/standard-quotation-template/new");
  };

  return (
    <PageCard
      title="Standard Quotation Template"
      showDivider
      action={
        <Button
          leftSection={<Add />}
          onClick={handleAddTemplate}
          color="jltAccent.6"
          h="2.4375rem"
          w="8.0625rem"
          style={{
            minWidth: "8.0625rem",
            maxWidth: "8.0625rem",
            paddingInline: 0,
          }}
        >
          Template
        </Button>
      }
      fullHeight
    >
      <AppTable
        columns={columns}
        data={paginatedTemplates}
        rowKey={(row) => row.id}
        withNumbering
        withEdit={{
          onClick: handleEdit,
          tooltip: "Edit template",
        }}
        withDelete={{
          onClick: handleDelete,
          tooltip: "Delete template",
          confirmMessage: (row) =>
            `Are you sure you want to delete "${row.template_name}"?`,
        }}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={filteredTemplates.length}
        showingCount={paginatedTemplates.length}
        searchPlaceholder="SEARCH SERVICE NAME"
        searchValue={search}
        onSearchChange={setSearch}
      />
    </PageCard>
  );
}
