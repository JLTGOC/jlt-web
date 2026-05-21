// src/features/accounts/pages/AccountsPage.tsx
import { useNavigate, useParams } from "react-router";
import { Box } from "@mantine/core";
import { ClientsList } from "@/features/accounts/components/clients/ClientsList";
import { EmployeesList } from "@/features/accounts/components/employees/EmployeesList";
import { CompaniesList } from "@/features/accounts/components/companies/CompaniesList";
import { AccountsProfile } from "@/features/accounts/pages/AccountsProfile";
import { getAccountTabs } from "@/features/accounts/utils/accountTabs";
import { ROLES } from "@/types/roles";
import type { User } from "@/types/api";

export default function AccountsPage() {
  const navigate = useNavigate();
  const { category, id } = useParams();

  const user: User = {
    id: 0,
    firstName: "Default",
    middleName: null,
    lastName: "User",
    fullName: "Default User",
    role: ROLES.ACCOUNT_SPECIALIST,
    email: "default@example.com",
    company: "Default Co",
    address: "N/A",
    contactNumber: "N/A",
    companyName: "Default Co",
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    tabs: {
      dashboard: true,
      leads: true,
      quotations: true,
      shipments: true,
      accounts: true,
      job_orders: true,
      templates: true,
    },
    permissions: [],
  };

  const activeTab = category ?? "clients";

  const handleTabChange = (tab: string | null) => {
    if (tab) navigate(`/accounts/${tab}`);
  };

  if (id) {
    return (
      <Box style={{ width: "100%" }}>
        <Box style={{ width: "100%" }}>
          <AccountsProfile />
        </Box>
      </Box>
    );
  }

  return (
    <Box style={{ width: "100%" }}>
      {getAccountTabs(user, activeTab, handleTabChange)}

      <Box style={{ width: "100%", marginTop: "1rem" }}>
        {activeTab === "clients" ? (
          <ClientsList />
        ) : activeTab === "employees" ? (
          <EmployeesList />
        ) : activeTab === "companies" ? (
          <CompaniesList />
        ) : null}
      </Box>
    </Box>
  );
}
