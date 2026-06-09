// src/features/accounts/pages/AccountsPage.tsx
import { useNavigate, useParams } from "react-router";
import { Box } from "@mantine/core";
import { ClientsList } from "@/features/accounts/components/clients/ClientsList";
import { EmployeesList } from "@/features/accounts/components/employees/EmployeesList";
import { CompaniesTabs } from "@/features/accounts/components/companies/CompaniesList";
import { CompanyInformation } from "@/features/accounts/components/companies/CompanyInformation";
import { CompanyDocuments } from "@/features/accounts/components/companies/CompanyDocuments";
import { AccountsProfile } from "@/features/accounts/pages/AccountsProfile";
import { getAccountTabs } from "@/features/accounts/utils/accountTabs";

export default function AccountsPage() {
  const navigate = useNavigate();
  const { category, subCategory, id } = useParams();

  const activeTab = category ?? "clients";

  const handleTabChange = (tab: string | null) => {
    if (tab) navigate(`/accounts/${tab}`);
  };

  // If there's an id param, show profile view
  if (id) {
    return (
      <Box style={{ width: "100%" }}>
        <AccountsProfile />
      </Box>
    );
  }

  // If user navigates to /accounts/companies/company-information, show the form
  if (category === "companies" && subCategory === "company-information") {
    return (
      <Box style={{ width: "100%" }}>
        <CompanyInformation />
      </Box>
    );
  }

  // If user navigates to /accounts/companies/documents, show documents
  if (category === "companies" && subCategory === "documents") {
    return (
      <Box style={{ width: "100%" }}>
        <CompanyDocuments />
      </Box>
    );
  }

  // Otherwise, show the normal tabs + lists
  return (
    <Box style={{ width: "100%" }}>
      {getAccountTabs(activeTab, handleTabChange)}

      <Box style={{ width: "100%", marginTop: "1rem" }}>
        {activeTab === "clients" ? (
          <ClientsList />
        ) : activeTab === "employees" ? (
          <EmployeesList />
        ) : activeTab === "companies" ? (
          <CompaniesTabs />
        ) : null}
      </Box>
    </Box>
  );
}
