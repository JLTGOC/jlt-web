// src/features/accounts/pages/AccountsProfile.tsx
import { useParams } from "react-router";
import { ClientDetails } from "../components/clients/ClientDetails";
import { EmployeeProfile } from "../components/employees/EmployeeProfile";

export function AccountsProfile() {
  const { category } = useParams();

  if (category === "clients") {
    return <ClientDetails />;
  }

  if (category === "employees") {
     return <EmployeeProfile />;
  }

  if (category === "companies") {
     return <div>Company Profile - Coming Soon</div>;
  }
  return <div>Profile not found</div>;
}
