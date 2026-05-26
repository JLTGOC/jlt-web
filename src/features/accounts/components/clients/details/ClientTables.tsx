// src/features/accounts/components/clients/ClientTables.tsx
import { Button, Group, Paper, Tabs, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { ChevronRight } from "@nine-thirty-five/material-symbols-react/rounded";
import tabClasses from "./ClientTabs.module.css";
import { SubQuotationTable } from "./subtable/subQuotationTable";
import { SubShipmentTable } from "./subtable/subShipmentTable";
import { SubRegulatoryTable } from "./subtable/subRegulatoryTable";
import { SubBillingInvoiceTable } from "./subtable/subBillingInvoicetable";
import type {
  ClientDetails,
  ClientQuotation,
  ClientRegulatory,
  ClientShipment,
} from "@/features/accounts/types/accounts.types";
import { useQuery } from "@tanstack/react-query";
import { accountsService } from "@/features/accounts/services/accounts.service";

interface ClientTablesProps {
  // Either provide the full client details, or provide a clientId to fetch them here.
  client?: ClientDetails;
  clientId?: number;
}

type ClientTablesTab = "quotations" | "shipments" | "regulatory" | "billing";
  type SearchableTab = Exclude<ClientTablesTab, "billing">;

export function ClientTables({ client, clientId }: ClientTablesProps) {
  const [activeTab, setActiveTab] = useState<ClientTablesTab>("quotations");
  const idToFetch = clientId ?? client?.clientId;

  const [pagination, setPagination] = useState<Record<ClientTablesTab, { page: number; perPage: number }>>({
    quotations: { page: 1, perPage: 10 },
    shipments: { page: 1, perPage: 10 },
    regulatory: { page: 1, perPage: 10 },
    billing: { page: 1, perPage: 10 },
  });

  const [searchText, setSearchText] = useState<Record<SearchableTab, string>>({
    quotations: "",
    shipments: "",
    regulatory: "",
  });

  const [searchQuery, setSearchQuery] = useState<Record<SearchableTab, string>>({
    quotations: "",
    shipments: "",
    regulatory: "",
  });

  const hasPrefetchedRegulatory = Array.isArray(client?.regulatory) && client.regulatory.length > 0;

  const currentSearchQuery = activeTab !== "billing" ? searchQuery[activeTab] : "";

  const { data } = useQuery<ClientQuotation[] | ClientShipment[] | ClientRegulatory[]>({
    queryKey: [
      "clients",
      idToFetch,
      activeTab,
      pagination[activeTab].page,
      pagination[activeTab].perPage,
      currentSearchQuery,
    ],
    queryFn: async () => {
      if (!idToFetch || activeTab === "billing") {
        return [] as ClientQuotation[];
      }

      const { page, perPage } = pagination[activeTab];
      const baseParams = perPage === 0 ? { all: true } : { page, per_page: perPage };
      const params = {
        ...baseParams,
        "filter[search]": currentSearchQuery ? currentSearchQuery : null,
      };

      switch (activeTab) {
        case "quotations":
          return accountsService.getClientQuotations(idToFetch, params);
        case "shipments":
          return accountsService.getClientShipments(idToFetch, params);
        case "regulatory":
          if (hasPrefetchedRegulatory) {
            return client!.regulatory;
          }
          return accountsService.getClientRegulatory(idToFetch, params);
        default:
          return [] as ClientQuotation[];
      }
    },
    enabled:
      typeof idToFetch === "number" &&
      idToFetch > 0 &&
      activeTab !== "billing" &&
      !(activeTab === "regulatory" && hasPrefetchedRegulatory),
    retry: false,
  });

  const quotations: ClientQuotation[] =
    activeTab === "quotations" && Array.isArray(data) ? (data as ClientQuotation[]) : [];
  const shipments: ClientShipment[] =
    activeTab === "shipments" && Array.isArray(data) ? (data as ClientShipment[]) : [];
  const regulatory: ClientRegulatory[] =
    activeTab === "regulatory"
      ? hasPrefetchedRegulatory
        ? client!.regulatory
        : Array.isArray(data)
        ? (data as ClientRegulatory[])
        : []
      : [];

  const activePagination = pagination[activeTab];
  const currentPage = activePagination.page;
  const currentPerPage = activePagination.perPage;
  const currentData =
    activeTab === "quotations"
      ? quotations
      : activeTab === "shipments"
      ? shipments
      : activeTab === "regulatory"
      ? regulatory
      : [];

  const currentTotal = currentData.length;
  const isShowAll = currentPerPage === 0;
  const currentTotalPages = isShowAll ? 1 : Math.max(1, Math.ceil(currentTotal / currentPerPage));
  const currentShowingCount =
    currentTotal === 0
      ? 0
      : isShowAll
      ? currentTotal
      : Math.min(currentPerPage, currentTotal - (currentPage - 1) * currentPerPage);

  useEffect(() => {
    if (currentPage > currentTotalPages) {
      setPagination((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], page: currentTotalPages },
      }));
    }
  }, [activeTab, currentPage, currentTotalPages]);

  return (
    <Paper shadow="sm" radius="md" p="md">
      <Tabs
        value={activeTab}
        onChange={(value: string | null) =>
          value && setActiveTab(value as "quotations" | "shipments" | "regulatory" | "billing")
        }
        variant="unstyled"
        classNames={{ list: tabClasses.tabsList, tab: tabClasses.tab }}
      >
        <Tabs.List grow>
          <Tabs.Tab value="quotations">Quotations</Tabs.Tab>
          <Tabs.Tab value="shipments">Shipments</Tabs.Tab>
          <Tabs.Tab value="regulatory">Regulatory</Tabs.Tab>
          <Tabs.Tab value="billing">Billing & Invoice</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="quotations" pt="sm">
          <SubQuotationTable
            quotations={quotations}
            page={pagination.quotations.page}
            perPage={pagination.quotations.perPage}
            searchValue={searchText.quotations}
            onSearchChange={(value) =>
              setSearchText((prev) => ({
                ...prev,
                quotations: value,
              }))
            }
            onSearch={(value) => {
              setSearchQuery((prev) => ({
                ...prev,
                quotations: value,
              }));
              setPagination((prev) => ({
                ...prev,
                quotations: { ...prev.quotations, page: 1 },
              }));
            }}
            onPageChange={(page) =>
              setPagination((prev) => ({
                ...prev,
                quotations: { ...prev.quotations, page },
              }))
            }
            onPerPageChange={(perPage) =>
              setPagination((prev) => ({
                ...prev,
                quotations: { ...prev.quotations, perPage, page: 1 },
              }))
            }
          />
        </Tabs.Panel>

        <Tabs.Panel value="shipments" pt="sm">
          <SubShipmentTable
            shipments={shipments}
            page={pagination.shipments.page}
            perPage={pagination.shipments.perPage}
            searchValue={searchText.shipments}
            onSearchChange={(value) =>
              setSearchText((prev) => ({
                ...prev,
                shipments: value,
              }))
            }
            onSearch={(value) => {
              setSearchQuery((prev) => ({
                ...prev,
                shipments: value,
              }));
              setPagination((prev) => ({
                ...prev,
                shipments: { ...prev.shipments, page: 1 },
              }));
            }}
            onPageChange={(page) =>
              setPagination((prev) => ({
                ...prev,
                shipments: { ...prev.shipments, page },
              }))
            }
            onPerPageChange={(perPage) =>
              setPagination((prev) => ({
                ...prev,
                shipments: { ...prev.shipments, perPage, page: 1 },
              }))
            }
          />
        </Tabs.Panel>

        <Tabs.Panel value="regulatory" pt="sm">
          <SubRegulatoryTable
            regulatory={regulatory}
            page={pagination.regulatory.page}
            perPage={pagination.regulatory.perPage}
            searchValue={searchText.regulatory}
            onSearchChange={(value) =>
              setSearchText((prev) => ({
                ...prev,
                regulatory: value,
              }))
            }
            onSearch={(value) => {
              setSearchQuery((prev) => ({
                ...prev,
                regulatory: value,
              }));
              setPagination((prev) => ({
                ...prev,
                regulatory: { ...prev.regulatory, page: 1 },
              }));
            }}
            onPageChange={(page) =>
              setPagination((prev) => ({
                ...prev,
                regulatory: { ...prev.regulatory, page },
              }))
            }
            onPerPageChange={(perPage) =>
              setPagination((prev) => ({
                ...prev,
                regulatory: { ...prev.regulatory, perPage, page: 1 },
              }))
            }
          />
        </Tabs.Panel>

        <Tabs.Panel value="billing" pt="sm">
          <SubBillingInvoiceTable
            page={pagination.billing.page}
            perPage={pagination.billing.perPage}
            onPageChange={(page) =>
              setPagination((prev) => ({
                ...prev,
                billing: { ...prev.billing, page },
              }))
            }
            onPerPageChange={(perPage) =>
              setPagination((prev) => ({
                ...prev,
                billing: { ...prev.billing, perPage, page: 1 },
              }))
            }
          />
        </Tabs.Panel>
      </Tabs>

      <Group justify="space-between" align="center" mt="sm">
        <Text size="0.75rem" c="dimmed">
          Showing {currentShowingCount} out of {currentTotal} entries
        </Text>

        <Group gap="0.25rem">
          <Button
            variant="outline"
            size="xs"
            onClick={() =>
              currentPage > 1 &&
              setPagination((prev) => ({
                ...prev,
                [activeTab]: { ...prev[activeTab], page: currentPage - 1 },
              }))
            }
            disabled={currentPage === 1}
            leftSection={<ChevronRight width={14} style={{ transform: "rotate(180deg)" }} />}
          >
            Previous
          </Button>

          {Array.from({ length: currentTotalPages }).map((_, index) => {
            const pageNumber = index + 1;
            const label = isShowAll ? "All" : String(pageNumber);

            if (pageNumber === 1 || pageNumber === currentTotalPages) {
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "filled" : "default"}
                  size="xs"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      [activeTab]: { ...prev[activeTab], page: pageNumber },
                    }))
                  }
                >
                  {label}
                </Button>
              );
            }

            if (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2) {
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "filled" : "default"}
                  size="xs"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      [activeTab]: { ...prev[activeTab], page: pageNumber },
                    }))
                  }
                >
                  {label}
                </Button>
              );
            }

            if (
              (pageNumber === 2 && currentPage > 4) ||
              (pageNumber === currentTotalPages - 1 && currentPage < currentTotalPages - 3)
            ) {
              return (
                <Text key={`ellipsis-${index}`} size="0.75rem" c="dimmed">
                  …
                </Text>
              );
            }

            return null;
          })}

          <Button
            variant="outline"
            size="xs"
            onClick={() =>
              currentPage < currentTotalPages &&
              setPagination((prev) => ({
                ...prev,
                [activeTab]: { ...prev[activeTab], page: currentPage + 1 },
              }))
            }
            disabled={currentPage === currentTotalPages}
            rightSection={<ChevronRight width={14} />}
          >
            Next
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}
