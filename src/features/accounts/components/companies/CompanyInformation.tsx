import { useLocation } from "react-router";
import type { CompanyFullDetails } from "@/features/accounts/types/company.types";
import { AddCompanyFlow } from "./AddCompanyFlow";
import { EditCompanyFlow } from "./EditCompanyFlow";

export function CompanyInformation() {
  const location = useLocation();
  const locationState = (location.state as {
    companyId?: string;
    company?: CompanyFullDetails;
    activeStep?: number;
    draftId?: string;
  } | null) ?? null;

  const companyId = locationState?.companyId;
  const isEditMode = Boolean(companyId);

  if (isEditMode && companyId) {
    return <EditCompanyFlow companyId={companyId} initialCompany={locationState?.company} />;
  }

  return <AddCompanyFlow />;
}
