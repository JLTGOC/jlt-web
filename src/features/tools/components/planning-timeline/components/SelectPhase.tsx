import { useEffect } from "react";
import { useNavigate, useLocation, data } from "react-router";
import {
  Text,
  Table,
  Group,
  Box,
  Checkbox,
  Flex,
  Loader,
  Button,
} from "@mantine/core";
import { ArrowForward } from "@nine-thirty-five/material-symbols-react/rounded";

import { usePlanningConfigurations } from "@/features/tools/hooks/planningTImeline";
import { useTemplateStore } from "@/features/tools/store/LogisticsCreatePlanningTemplate";

import { PageCard } from "@/components/PageCard";
export default function SelectPhase() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceType = location.state?.serviceType;
  const { data, isLoading } = usePlanningConfigurations(serviceType);

  console.log("khate", data?.version_number);

  useEffect(() => {
    const version_number = data?.version_number ?? 1;
    setTemplateConfiguration((prev) => ({
      ...prev,
      config_version_number: version_number,
      service_category: serviceType
    }));
  }, []);

  const {
    templateState,
    setTemplateState,
    templateConfiguration,
    setTemplateConfiguration,
  } = useTemplateStore();

  useEffect(() => {
    setTemplateConfiguration((prev) => ({
      ...prev,
      phases: templateState.phases.map((phaseId, index) => ({
        config_phase_id: phaseId,
        sort_order: index + 1,
        processes: [],
      })),
    }));
  }, [templateState.phases, serviceType]);

  const rows = data?.phases.map((phase, i) => (
    <Table.Tr key={i}>
      <Table.Td>{phase.id}</Table.Td>
      <Table.Td>{phase.name}</Table.Td>
      <Table.Td ta={"center"}>
        <Group align="center" justify="end">
          <Box fz={10} bg={""}>
            {templateConfiguration.phases.findIndex(
              (p) => p.config_phase_id === phase.id,
            ) +
              1 ===
            0
              ? ""
              : templateConfiguration.phases.findIndex(
                  (p) => p.config_phase_id === phase.id,
                ) + 1}
          </Box>
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
  return (
    <>
      <PageCard
        title="Select Phase"
        showDivider
        action={
          <Button
            onClick={() =>
              navigate("/tools/planning-timeline/add-template/process", {
                state: { serviceType },
              })
            }
            rightSection={
              <ArrowForward
                width="1.25rem"
                height="1.25rem"
                fill="currentColor"
              />
            }
            disabled={templateState.phases.length === 0}
          >
            NEXT
          </Button>
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
