import { Avatar, Box, Paper, Text, ActionIcon, Group, Menu, Divider } from "@mantine/core";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { MoreVert } from "@nine-thirty-five/material-symbols-react/rounded";
import { CloseSmall, InboxTextPerson, Folder, ToggleOff, ContentCopy, HotelClass, DomainDisabled, Edit } from "@nine-thirty-five/material-symbols-react/outlined";
import { BasicInformation } from "./CompanyDetails/BasicInformation";
import { CompanyTableFilters } from "./CompanyTableFilters";
import { BusinessAddressandLocation } from "./CompanyDetails/BusinessAddressandLocation";
import { GovernmentandComplianceDetails } from "./CompanyDetails/GovernmentandComplianceDetails";
import { KeyContacts } from "./CompanyDetails/KeyContacts";
import { CommercialandPricingInformation } from "./CompanyDetails/CommercialandPricingInformation";
import { OperationalInstructions } from "./CompanyDetails/OperationalInstructions";
import { RiskIssueandComplianceMonitoring } from "./CompanyDetails/RiskIssueandComplianceMonitoring";
import { DocumentsandAttachments } from "./CompanyDetails/DocumentsandAttachments";
import { StrategicInsight } from "./CompanyDetails/StrategicInsight";
import { stripedRowProps } from "@/components/stripedRow";
import styles from "./CompaniesList.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { companyService } from "../../services/company.service";
import type { CompanyTableRow, CompanyFullDetails } from "../../types/company.types";

export interface CompanyTab {
  value: string;
  label: string;
}

interface CompanyTableProps {
  tabs: readonly CompanyTab[];
  activeTab: string | null;
  onExitTab: () => void;
}

const sectionStepMap: Record<string, number> = {
  "basic-information": 1,
  "business-address-location": 2,
  "key-contacts": 3,
  "government-compliance": 4,
  "commercial-pricing": 5,
  "operational-instructions": 6,
  "risk-issue-monitoring": 7,
  "documents-attachments": 8,
  "strategic-insight": 9,
};

const tabValueToBackendSection: Record<string, string> = {
  "basic-information": "basic_info",
  "business-address-location": "address",
  "key-contacts": "contacts",
  "government-compliance": "registration",
  "commercial-pricing": "pricing",
  "operational-instructions": "operation",
  "risk-issue-monitoring": "monitoring",
  "documents-attachments": "documents",
  "strategic-insight": "insights",
};

type CompanySection =
  | "basic_info"
  | "address"
  | "contacts"
  | "registration"
  | "pricing"
  | "operation"
  | "monitoring"
  | "documents"
  | "insights";

export function CompanyTable({ tabs, activeTab, onExitTab }: CompanyTableProps) {
  const [searchValue, setSearchValue] = useState("");
  const [asSearchValue, setAsSearchValue] = useState("");
  const [searchFilters, setSearchFilters] = useState<Record<string, string> | undefined>(undefined);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [companies, setCompanies] = useState<CompanyTableRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function loadCompanies() {
      try {
        const response = await companyService.getCompaniesList(page, perPage, searchFilters);

        if (!active) {
          return;
        }

        setCompanies(response.data ?? []);
        setTotalCount(response.total ?? 0);
      } catch (error) {
        console.error("Failed to load companies", error);
        if (active) {
          setCompanies([]);
          setTotalCount(0);
        }
      }
    }

    loadCompanies();

    return () => {
      active = false;
    };
  }, [page, perPage, searchFilters]);

  const pageData = companies ?? [];

  const selectedTab = tabs.find((tab) => tab.value === activeTab);
  const selectedCompany = selectedCompanyId
    ? companies.find((row) => row.companyId === selectedCompanyId)
    : null;

  const selectedCompanyRouteId = selectedCompany?.companyRouteId ?? selectedCompanyId;

  const [selectedCompanyFull, setSelectedCompanyFull] = useState<CompanyFullDetails | null>(null);
  const [loadingCompanyFull, setLoadingCompanyFull] = useState(false);

  const handleUpdateCompany = (companyId: string) => {
    navigate("/accounts/companies/company-information", {
      state: {
        companyId,
        company: selectedCompanyId === companyId ? selectedCompanyFull ?? undefined : undefined,
        activeStep: 1,
        useFullStepper: true,
      },
    });
  };

  const columns: AppTableColumn<CompanyTableRow>[] = [
    {
      key: "classification",
      label: "CLASSIFICATION",
      render: (row) => {
        const classification = (row.classification ?? "").toLowerCase();
        const badgeClass =
          classification === "vip"
            ? styles.vipBadge
            : classification === "vvip"
            ? styles.vvipBadge
            : styles.regularBadge;

        return (
          <span className={`${styles.classificationBadge} ${badgeClass}`}>
            {row.classification}
          </span>
        );
      },
    },
    { key: "companyId", label: "COMPANY ID" },
    { key: "companyName", label: "COMPANY NAME" },
    { key: "consignee", label: "CONSIGNEE" },
    {
      key: "accountHandler",
      label: "ACCOUNT HANDLER",
      width: "20%",
      render: (row) => (
        <Group gap="sm" align="center">
          <Avatar
            src={row.accountHandlerImagePath ?? undefined}
            alt={row.accountHandler}
            radius="xl"
            size="sm"
          />
          <Text size="sm">{row.accountHandler}</Text>
        </Group>
      ),
    },
    {
      key: "action",
      label: "ACTION",
      width: "3%",
      render: (row) => (
        <Group style={{ width: "80%", display: "flex", justifyContent: "flex-end" }}>
          <Menu shadow="md" width={220} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" onClick={(e) => e.stopPropagation()}>
                <MoreVert width={18} height={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<Folder width={18} height={18} style={{ color: "#1D274E" }} />}
                onClick={() => undefined}
              >
                Documents
              </Menu.Item>
              <Menu.Item
                leftSection={<ToggleOff width={18} height={18} style={{ color: "#1D274E" }} />}
                onClick={() => undefined}
              >
                Deactivate Account
              </Menu.Item>
              <Menu.Item
                leftSection={<HotelClass width={18} height={18} style={{ color: "#1D274E" }} />}
                onClick={() => undefined}
              >
                Change Classification
              </Menu.Item>
              <Menu.Item
                leftSection={<Edit width={18} height={18} style={{ color: "#1D274E" }} />}
                onClick={() => handleUpdateCompany(row.companyRouteId ?? row.companyId)}
              >
                Update Company
              </Menu.Item>
              <Menu.Item
                leftSection={<ContentCopy width={18} height={18} style={{ color: "#1D274E" }} />}
                onClick={() => undefined}
              >
                Duplicate Company
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      ),
    },
  ];

  useEffect(() => {
    let active = true;
    async function loadFull() {
      if (!selectedCompanyRouteId) {
        setSelectedCompanyFull(null);
        return;
      }

      const section = selectedTab
        ? (tabValueToBackendSection[selectedTab.value] as CompanySection)
        : "basic_info";

      console.debug(`[CompanyTable] Fetching full details for company:`, selectedCompanyRouteId, `section:`, section);

      setLoadingCompanyFull(true);
      try {
        const data = await companyService.getCompanyById(selectedCompanyRouteId, section);
        console.debug(`[CompanyTable] Received company details for section ${section}:`, data);
        if (!active) return;
        setSelectedCompanyFull(data);
      } catch (err) {
        console.error("Failed to load full company details", err);
        if (active) setSelectedCompanyFull(null);
      } finally {
        if (active) setLoadingCompanyFull(false);
      }
    }

    loadFull();

    return () => {
      active = false;
    };
  }, [selectedCompanyRouteId, selectedTab]);

  const handleEditSection = (sectionValue: string) => {
    if (!selectedCompany) {
      return;
    }

    navigate("/accounts/companies/company-information", {
      state: {
        companyId: selectedCompany.companyRouteId ?? selectedCompany.companyId,
        company: selectedCompanyFull ?? null,
        activeStep: sectionStepMap[sectionValue] ?? 1,
      },
    });
  };

  const noCompanySelected = (
    <Box
      style={{
        display: "grid",
        justifyItems: "center",
        minHeight: 220,
        textAlign: "center",
      }}
    >
      <DomainDisabled width={260} height={260} style={{ color: "#BEBEBE" }} />
      <Text fw={450} size="md" mb="xs">
        NO COMPANY SELECTED
      </Text>
      <Text c="dimmed" size="xs">
        Please select a company from the list to view its details.
      </Text>
    </Box>
  );

  useEffect(() => {
    if (selectedTab) {
      setSelectedCompanyId(null);
    }
  }, [selectedTab?.value]);

  return (
    <Box style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Box style={{ flex: 1, minWidth: selectedTab ? 0 : "100%"  }}>
        <Paper radius="md" p="md" style={{ overflow: "hidden" }}>
          <Box mb="md">
            <CompanyTableFilters
              companySearchValue={searchValue}
              onCompanySearchChange={setSearchValue}
              onCompanySearch={() => {
                const trimmedValue = searchValue.trim();
                setSearchValue(trimmedValue);
                setSearchFilters(trimmedValue ? { company_name: trimmedValue } : undefined);
                setPage(1);
              }}
              asSearchValue={asSearchValue}
              onAsSearchChange={setAsSearchValue}
              onAsSearch={() => {
                const trimmedValue = asSearchValue.trim();
                setAsSearchValue(trimmedValue);
                setSearchFilters(trimmedValue ? { as_search: trimmedValue } : undefined);
                setPage(1);
              }}
              onReset={() => {
                setSearchValue("");
                setAsSearchValue("");
                setSearchFilters(undefined);
                setPage(1);
              }}
              onAddCompany={() => navigate("/accounts/companies/company-information")}
              perPage={perPage}
              setPerPage={(nextPerPage) => {
                setPerPage(nextPerPage);
                setPage(1);
              }}
            />
          </Box>

          <AppTable<CompanyTableRow>
            columns={columns}
            data={pageData}
              rowKey={(row) => row.companyRouteId ?? row.companyId}
              getRowProps={(row, idx) => {
                const baseProps = stripedRowProps(idx, {
                  className: `${styles.companyRow}${
                    selectedTab ? "" : ` ${styles.hoverDisabled}`
                  }${
                    selectedTab && row.companyId === selectedCompanyId ? ` ${styles.selectedCompanyRow}` : ""
                  }`,
                });

                return baseProps;
              }}
              onRowClick={selectedTab ? (row) => setSelectedCompanyId(row.companyId) : undefined}
              perPage={perPage}
              onPerPageChange={(nextPerPage) => {
                setPerPage(nextPerPage);
                setPage(1);
              }}
              page={page}
              onPageChange={(nextPage) => setPage(nextPage)}
              total={totalCount}
              showingCount={pageData.length}
              entryOptions={["10", "20", "30"]}
            />
        </Paper>
      </Box>

      {selectedTab ? (
        <Box style={{ flex: "0 0 450px", minWidth: "350px" }}>
          <Paper shadow="xs" radius="md" p="md" style={{ height: "100%" }}>
            <Box className={styles.selectedTabLabelContainer}>
              <Text fw={500} tt="uppercase" className={styles.selectedTabLabel}>
                {selectedTab.label}
              </Text>
              <ActionIcon
                variant="light"
                color="gray"
                onClick={onExitTab}
                style={{ position: "absolute", top: 0, right: 0 }}
              >
                <CloseSmall width={20} height={20} />
              </ActionIcon>
            </Box>
            <Divider mt="md" mb="sm" />
            {selectedTab?.value === "basic-information" ? (
              selectedCompany ? (
                loadingCompanyFull ? (
                  <Box style={{ padding: "2rem", textAlign: "center" }}>
                    <Text>Loading company details...</Text>
                  </Box>
                ) : (
                  <BasicInformation company={selectedCompanyFull} onEdit={() => handleEditSection("basic-information")} />
                )
              ) : (
                noCompanySelected
              )
            ) : selectedTab?.value === "key-contacts" ? (
              selectedCompany ? (
                loadingCompanyFull ? noCompanySelected : <KeyContacts company={selectedCompanyFull} onEdit={() => handleEditSection("key-contacts")} />
              ) : noCompanySelected
            ) : selectedTab?.value === "commercial-pricing" ? (
              selectedCompany ? (
                loadingCompanyFull ? noCompanySelected : <CommercialandPricingInformation company={selectedCompanyFull} onEdit={() => handleEditSection("commercial-pricing")} />
              ) : noCompanySelected
            ) : selectedTab?.value === "operational-instructions" ? (
              selectedCompany ? (
                loadingCompanyFull ? noCompanySelected : <OperationalInstructions company={selectedCompanyFull} onEdit={() => handleEditSection("operational-instructions")} />
              ) : noCompanySelected
            ) : selectedTab?.value === "business-address-location" ? (
              selectedCompany ? (
                loadingCompanyFull ? noCompanySelected : <BusinessAddressandLocation company={selectedCompanyFull} onEdit={() => handleEditSection("business-address-location")} />
              ) : noCompanySelected
            ) : selectedTab?.value === "government-compliance" ? (
              selectedCompany ? (
                loadingCompanyFull ? noCompanySelected : <GovernmentandComplianceDetails company={selectedCompanyFull} onEdit={() => handleEditSection("government-compliance")} />
              ) : noCompanySelected
            ) : selectedTab?.value === "risk-issue-monitoring" ? (
              selectedCompany ? (
                loadingCompanyFull ? noCompanySelected : <RiskIssueandComplianceMonitoring company={selectedCompanyFull} onEdit={() => handleEditSection("risk-issue-monitoring")} />
              ) : noCompanySelected
            ) : selectedTab?.value === "documents-attachments" ? (
              selectedCompany ? (
                loadingCompanyFull ? noCompanySelected : <DocumentsandAttachments company={selectedCompanyFull} onEdit={() => handleEditSection("documents-attachments")} />
              ) : noCompanySelected
            ) :selectedTab?.value === "strategic-insight" ? (
              selectedCompany ? (
                loadingCompanyFull ? noCompanySelected : <StrategicInsight company={selectedCompanyFull} onEdit={() => handleEditSection("strategic-insight")} />
              ) : noCompanySelected
            ) : selectedCompany ? (
              <Box style={{ display: "grid", gap: "0.75rem" }}>
                <Text fw={500} size="sm">
                  Company Name
                </Text>
                <Text size="sm">{selectedCompany.companyName}</Text>
                <Text fw={500} size="sm">
                  Consignee
                </Text>
                <Text size="sm">{selectedCompany.consignee}</Text>
                <Text fw={500} size="sm">
                  Company ID
                </Text>
                <Text size="sm">{selectedCompany.companyId}</Text>
                <Text fw={500} size="sm">
                  Classification
                </Text>
                <Text size="sm">{selectedCompany.classification}</Text>
                <Text fw={500} size="sm">
                  Account Handler
                </Text>
                <Text size="sm">{selectedCompany.accountHandler}</Text>
              </Box>
            ) : (
              noCompanySelected
            )}
          </Paper>
        </Box>
      ) : null}
    </Box>
  );
}
