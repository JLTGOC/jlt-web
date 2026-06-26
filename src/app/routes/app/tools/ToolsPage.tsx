import { useLocation, useMatch } from "react-router";
import { ToolsDashboard } from "@/features/tools/pages/ToolsDashboard";
import { TemplatesPage } from "@/features/tools/pages/TemplatesPage";
import ServicesPage from "@/features/tools/pages/ServicesPage";
import { SubServicesPage } from "@/features/tools/pages/SubServicesPage";
import MessagesPage from "@/features/tools/pages/MessageTemplatePage";
import { DetailsConfigurationPage } from "@/features/tools/pages/DetailsConfigurationPage";
import { BillingConfigurationPage } from "@/features/tools/pages/BillingConfigurationPage";
import { StandardQuotationTemplatePage } from "@/features/tools/pages/StandardQuotationTemplatePage";
import { StandardQuotationTemplateFormPage } from "@/features/tools/pages/StandardQuotationTemplateFormPage";
import { TemplateFormPage } from "@/features/tools/pages/TemplateFormPage";

// Logistics
import PlanningTimelinePage from "@/features/tools/pages/PlanningTimelinePage";
import TemplatesConfiguration from "@/features/tools/components/planning-timeline/components/TemplatesConfiguration";
import SelectPhase from "@/features/tools/components/planning-timeline/components/SelectPhase";
import SelectProcess from "@/features/tools/components/planning-timeline/components/SelectProcess";
import EditTemplateSelectPhase from "@/features/tools/components/planning-timeline/components/edit-templates/EditTemplateSelectPhase";
import ViewTemplatesTable from "@/features/tools/components/planning-timeline/components/view-templates/ViewTemplatesTable";
import EditTemplates from "@/features/tools/components/planning-timeline/components/edit-templates/EditTemplates";

export default function ToolsPage() {
  const location = useLocation();
  const detailsConfigMatch = useMatch("/tools/templates/config/details");
  const billingConfigMatch = useMatch("/tools/templates/config/billing");
  const standardQuotationTemplateMatch = useMatch(
    "/tools/templates/config/standard-quotation-template",
  );
  const createStandardQuotationTemplateMatch = useMatch(
    "/tools/templates/config/standard-quotation-template/new",
  );
  const editStandardQuotationTemplateMatch = useMatch(
    "/tools/templates/config/standard-quotation-template/:templateId/edit",
  );
  const createTemplateMatch = useMatch("/tools/templates/new");
  const editTemplateMatch = useMatch("/tools/templates/:templateId/edit");
  const serviceSubListMatch = useMatch("/tools/services/:serviceType");
  const servicesMatch = useMatch("/tools/services");
  const messagesMatch = useMatch("/tools/messages");
  const templatesMatch = useMatch("/tools/templates");

  // logistics
  const planningTimelineMatch = useMatch("/tools/planning-timeline")
  const TemplateConfigurationMatch = useMatch("/tools/planning-timeline/templates-configuration")
  const SelectPhaseMatch = useMatch("/tools/planning-timeline/add-template")
  const SelectProcessMatch = useMatch("/tools/planning-timeline/add-template/process")
  const EditTemplateSelectPhaseMatch = useMatch("/tools/planning-timeline/edit-template/select-phase")
  const ViewTemplatesTableMatch = useMatch("/tools/planning-timeline/view-templates-table")
  const EditTemplateMatch = useMatch("/tools/planning-timeline/edit-template")

  if (detailsConfigMatch) return <DetailsConfigurationPage />;
  if (billingConfigMatch) return <BillingConfigurationPage />;
  if (createStandardQuotationTemplateMatch) {
    return <StandardQuotationTemplateFormPage mode="create" />;
  }
  if (editStandardQuotationTemplateMatch) {
    return <StandardQuotationTemplateFormPage mode="edit" />;
  }
  if (standardQuotationTemplateMatch) return <StandardQuotationTemplatePage />;
  if (createTemplateMatch) {
    const params = new URLSearchParams(location.search);
    const serviceType = params.get("serviceType");

    return (
      <TemplateFormPage
        mode="create"
        serviceType={serviceType === "logistics" ? "LOGISTICS" : "REGULATORY"}
      />
    );
  }

  if (editTemplateMatch) {
    return <TemplateFormPage mode="edit" serviceType="REGULATORY" />;
  }

  if (serviceSubListMatch) return <SubServicesPage />;
  if (servicesMatch) return <ServicesPage />;
  if (messagesMatch) return <MessagesPage />;
  if (templatesMatch) return <TemplatesPage />;

  // Specific planning-timeline routes must come BEFORE the generic planningTimelineMatch
  if (EditTemplateMatch) {
    return <EditTemplates />;
  }
  if (EditTemplateSelectPhaseMatch) {
    return <EditTemplateSelectPhase />;
  }
  if (ViewTemplatesTableMatch) {
    return <ViewTemplatesTable />;
  }
  if (TemplateConfigurationMatch) {
    return <TemplatesConfiguration />;
  }
  if (SelectPhaseMatch) {
    return <SelectPhase />;
  }
  if (SelectProcessMatch) {
    return <SelectProcess />;
  }
  if (planningTimelineMatch) {
    return <PlanningTimelinePage />;
  }

  return <ToolsDashboard />;
}
