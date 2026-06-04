import { Text } from "@mantine/core";
import { PageCard } from "@/components/PageCard";
import { useNavigate } from "react-router";

export default function SelectProcess() {
  const navigate = useNavigate();
  return (
    <>
      <PageCard
        title="Select Process"
        showDivider
        showNextButton
        nextButtonAction={() =>
          navigate("/tools/planning-timeline/add-template/task")
        }
      ></PageCard>
    </>
  );
}
