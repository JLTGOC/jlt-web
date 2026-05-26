import { Text } from "@mantine/core";
import ServiceTypeModal from "../components/planning-timeline/modals/ServiceType";

type PlanningTimelinePageProps = {
  openServiceTypeModal: boolean;
};

export default function PlanningTimelinePage({
  openServiceTypeModal,
}: PlanningTimelinePageProps) {
  return (
    <>
     <ServiceTypeModal></ServiceTypeModal>
    </>
  );
}
