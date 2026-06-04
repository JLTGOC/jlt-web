import { Text } from "@mantine/core";
import { PageCard } from "@/components/PageCard";
import { useNavigate } from "react-router";

export default function SelectPhase() {
  const navigate = useNavigate();
  return (
    <>
      <PageCard
        title="Select Phase"
        showDivider
        showNextButton
        nextButtonAction={() =>
          navigate("/tools/planning-timeline/add-template/process")
        }
      ></PageCard>
    </>
  );
}
