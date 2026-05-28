// src/features/accounts/components/companies/CompaniesList.tsx
import { Box, Paper, Stack, Tabs, Text } from "@mantine/core";
import { useState } from "react";
import {
  CorporateFare,
  LocationOn,
  Contacts,
  VerifiedUser,
  PriceChange,
  QuickReference,
  Error,
  Folder,
  BarChart,
} from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompaniesList.module.css";
import { CompanyTable } from "./CompanyTable";

type CompanyTabValue = (typeof companyTabs)[number]["value"];

const companyTabs = [
  { value: "basic-information", label: "Basic Information", Icon: CorporateFare },
  { value: "business-address-location", label: "Business Address & Location", Icon: LocationOn },
  { value: "key-contacts", label: "Key Contacts", Icon: Contacts },
  { value: "government-compliance", label: "Government & Compliance Details", Icon: VerifiedUser },
  { value: "commercial-pricing", label: "Commercial & Pricing Information", Icon: PriceChange },
  { value: "operational-instructions", label: "Operational Instructions", Icon: QuickReference },
  { value: "risk-issue-monitoring", label: "Risk, Issue And Compliance Monitoring", Icon: Error },
  { value: "documents-attachments", label: "Documents & Attachments", Icon: Folder },
  { value: "strategic-insight", label: "Strategic Insight", Icon: BarChart },
] as const;

export function CompaniesTabs() {
  const [activeTab, setActiveTab] = useState<CompanyTabValue | null>(null);

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={(value) => value && setActiveTab(value as CompanyTabValue)}
        orientation="horizontal"
        keepMounted={false}
      >
        <Paper shadow="false" >
          <Tabs.List grow className={styles.tabsList}>
            {companyTabs.map(({ value, label, Icon }) => (
              <Tabs.Tab key={value} value={value} className={styles.tab}>
                <Stack className={styles.tabContent}>
                  <Box className={styles.tabIcon}>
                    <Icon width={42} height={42} />
                  </Box>
                  <Text className={styles.tabLabel}>{label}</Text>
                </Stack>
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Paper>
      </Tabs>

      <Box style={{ marginTop: "2rem" }}>
        <CompanyTable
          tabs={companyTabs}
          activeTab={activeTab}
          onExitTab={() => setActiveTab(null)}
        />
      </Box>
    </>
  );
}
