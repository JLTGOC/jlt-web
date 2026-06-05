import { useNavigate } from "react-router";

import { Text } from "@mantine/core";
import { PageCard } from "@/components/PageCard";


export default function LogisticsTemplates() {
    const navigate = useNavigate()
  return (
    <>
      <PageCard
        title="list of logistics templates"
        showDivider
        inLogisticsTemplate
        logisticsSettingIconAction={() => (navigate("/tools/planning-timeline/templates-configuration"))}
        logisticsAddTemplateAction={() => (navigate("/tools/planning-timeline/add-template"))}
      >
       
      </PageCard>
    </>
  );
}
