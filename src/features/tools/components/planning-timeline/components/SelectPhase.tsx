import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Text,
  Table,
  Group,
  Box,
  Checkbox,
  Flex,
  Loader,
} from "@mantine/core";

import { usePlanningConfigurations } from "@/features/tools/hooks/planningTImeline";
import type { ConfigItem } from "@/features/tools/types/planningTimeline";

import { PageCard } from "@/components/PageCard";
export default function SelectPhase() {
  const navigate = useNavigate();
  const location = useLocation();

  const [templateState, setTemplateState] = useState({
    phases: [] as number[],
    processes: [] as number[],
    tasks: [] as number[],
  });

  const serviceType = location.state?.serviceType;

  const { data, isLoading } = usePlanningConfigurations(serviceType);

  const rows = data?.phases.map((phase, i) => (
    <Table.Tr key={i}>
      <Table.Td>{phase.id}</Table.Td>
      <Table.Td>{phase.name}</Table.Td>
      <Table.Td ta={"center"}>
        <Group align="center" justify="end">
          <Box>{templateState.phases.indexOf(phase.id) === 0? "" : templateState.phases.indexOf(phase.id) + 1}</Box>
          <Checkbox
            checked={templateState.phases.includes(phase.id)}
            onChange={(event: any) => {
              const checked = event.currentTarget.checked;

              setTemplateState((prev) => ({
                ...prev,
                phases: checked
                  ? [...prev.phases, phase.id]
                  : prev.phases.filter((id) => id !== phase.id),
              }));
            }}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));
  console.log("templateState:", templateState.phases);
  return (
    <>
      <PageCard
        title="Select Phase"
        showDivider
        showNextButton
        nextButtonAction={() =>
          navigate("/tools/planning-timeline/add-template/process", {
            state: { serviceType },
          })
        }
      >
        <Table highlightOnHover striped>
          <Table.Thead bg="#17314B" c="white">
            <Table.Tr>
              <Table.Th>NO</Table.Th>
              <Table.Th style={{ width: "75%" }}>PHASE</Table.Th>
              <Table.Th ta={"right"}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        {isLoading && (
          <Flex justify="center" align="center">
            <Loader color="blue" size="xs" type="dots" />
          </Flex>
        )}
      </PageCard>
    </>
  );
}
