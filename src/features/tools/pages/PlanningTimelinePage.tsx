import { useEffect, useState } from "react";
import ServiceTypeModal from "../components/planning-timeline/modals/ServiceType";

type PlanningTimelinePageProps = {
  openServiceTypeModal: boolean;
};

export default function PlanningTimelinePage({
  openServiceTypeModal,
}: PlanningTimelinePageProps) {
  const [isServiceTypeModalOpen, setIsServiceTypeModalOpen] = useState(
    openServiceTypeModal,
  );

  useEffect(() => {
    setIsServiceTypeModalOpen(openServiceTypeModal);
  }, [openServiceTypeModal]);

  return (
    <>
      <ServiceTypeModal
        opened={isServiceTypeModalOpen}
        onClose={() => setIsServiceTypeModalOpen(false)}
      />
    </>
  );
}
