import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Text } from "@mantine/core";
import LogisticsTemplates from "../components/planning-timeline/components/LogisticsTemplates";

type ServiceType = "REGULATORY" | "LOGISTICS";

type PlanningTimelinePageProps = {};

export default function PlanningTimelinePage({}: PlanningTimelinePageProps) {
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const location = useLocation();

  useEffect(() => {
    const stateServiceType = (
      location.state as { serviceType?: ServiceType } | null | undefined
    )?.serviceType;

    if (stateServiceType) {
      setServiceType(stateServiceType);
    }
  }, [location.state]);

  console.log("khate",serviceType);

  return (
    <>
      {serviceType === "LOGISTICS" ? (
        <>
          <LogisticsTemplates serviceType={serviceType}/> 
        </>
      ) : (
        <Text>UNDER-CONSTRUCTION</Text>
      )}
    </>
  );
}
