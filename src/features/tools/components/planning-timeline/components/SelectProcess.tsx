import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Text,
  Table,
  Button,
  Checkbox,
  Flex,
  Loader,
  Box,
} from "@mantine/core";
import {
  ArrowForward,
} from "@nine-thirty-five/material-symbols-react/rounded";

import { usePlanningConfigurations } from "@/features/tools/hooks/planningTImeline";
import { useTemplateStore } from "@/features/tools/store/LogisticsCreatePlanningTemplate";
import { PageCard } from "@/components/PageCard";

export default function SelectProcess() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceType = location.state?.serviceType;

  const { data, isLoading } = usePlanningConfigurations(serviceType);

  const {
    templateState,
    setTemplateState,
    templateConfiguration,
    setTemplateConfiguration,
  } = useTemplateStore();

  console.log(templateConfiguration)

  const processes = data?.processes ?? [];

  const { leftColumn, rightColumn } = useMemo(() => {
    const middle = Math.ceil(processes.length / 2);

    return {
      leftColumn: processes.slice(0, middle),
      rightColumn: processes.slice(middle),
    };
  }, [processes]);

 const rowPhases = useMemo(() => {
    const selectedPhaseIds = new Set(
      templateConfiguration.phases.map((p) => p.config_phase_id),
    );

    return data?.phases.filter((phase) => selectedPhaseIds.has(phase.id)) ?? [];
  }, [data?.phases, templateConfiguration.phases]);

  const isProcessChecked = (phaseId: number, processId: number) => {
    const phaseConfig = templateConfiguration.phases.find(
      (p) => p.config_phase_id === phaseId,
    );

    return (
      phaseConfig?.processes.some((p) => p.config_process_id === processId) ??
      false
    );
  };

  console.log(templateState)

  const toggleProcess = useCallback((processId: number, phaseId: number) => {
    const exists = templateState.processes.includes(processId);
    
    console.log(processId)
    setTemplateState({
      ...templateState,
      processes: exists
        ? templateState.processes.filter((p) => p !== processId)
        : [...templateState.processes, processId],
    });

    setTemplateConfiguration((prev) => ({
      ...prev,
      phases: prev.phases.map((phase) => {
        if (phase.config_phase_id !== phaseId) {
          return phase;
        }

        const exists = phase.processes.some(
          (p) => p.config_process_id === processId,
        );

        return {
          ...phase,
          processes: exists
            ? phase.processes.filter((p) => p.config_process_id !== processId)
            : [
                ...phase.processes,
                {
                  config_process_id: processId,
                  tasks: [],
                },
              ],
        };
      }),
    }));
  }, [templateState]);

  const allPhasesHaveProcess = useMemo(() => {
  return templateConfiguration.phases.every(
    (phase) => phase.processes.length > 0,
  );
}, [templateConfiguration.phases]);

  const rows = rowPhases?.flatMap((phase, index) => [
    // PHASE ROW
    <Table.Tr key={index}>
      <Table.Td w={60}>{String(index +1).padStart(2, "0")}</Table.Td>

      <Table.Td fw={600}>{phase.name}</Table.Td>
    </Table.Tr>,

    // LABEL ROW
    <Table.Tr key={`label-${phase.id}`}>
      <Table.Td colSpan={2}>
        <Text size="sm" fw={500} c="dimmed">
          LIST OF PROCESSES
        </Text>
      </Table.Td>
    </Table.Tr>,

    // PROCESS ROWS (BELONG TO THIS PHASE)
   <Table.Tr>
  <Table.Td colSpan={2}>
    <Box style={{ display: "flex", gap: 12 }}>
      
      {/* LEFT */}
      <Box
        style={{
          flex: 1,
          height: 100,
          overflowY: "auto",
          border: "1px solid #e5e5e5",
          borderRadius: 6,
        }}
      >
        {leftColumn.map((left) => (
          <Box key={left.id} p="xs">
            <Checkbox
              label={left.name}
              checked={isProcessChecked(phase.id, left.id)}
              onChange={() => toggleProcess(left.id, phase.id)}
            />
          </Box>
        ))}
      </Box>

      {/* RIGHT */}
      <Box
        style={{
          flex: 1,
          height: 100,
          overflowY: "auto",
          border: "1px solid #e5e5e5",
          borderRadius: 6,
        }}
      >
        {rightColumn.map((right) => (
          <Box key={right.id} p="xs">
            <Checkbox
              label={right.name}
              checked={isProcessChecked(phase.id, right.id)}
              onChange={() => toggleProcess(right.id, phase.id)}
            />
          </Box>
        ))}
      </Box>

    </Box>
  </Table.Td>
</Table.Tr>
    ,

    // SPACING ROW
    <Table.Tr key={`space-${phase.id}`}>
      <Table.Td colSpan={2} style={{ height: 10 }} />
    </Table.Tr>,
  ]);

  return (
    <PageCard
      title="Select Process"
      showDivider
      action={
        <Button
          onClick={() =>
            navigate("/tools/planning-timeline/add-template/task", {
              state: { serviceType },
            })
          }
          rightSection={<ArrowForward width="1.25rem" height="1.25rem" />}
          disabled={!allPhasesHaveProcess}
        >
          NEXT
        </Button>
      }
    >
      <Table withTableBorder borderColor="#ddd" verticalSpacing="sm">
        {/* HEADER */}
        <Table.Thead>
          <Table.Tr bg="#17314B" c="white">
            <Table.Th w={60}>NO</Table.Th>
            <Table.Th>PHASES</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {isLoading && (
        <Flex justify="center" mt="md">
          <Loader size="xs" />
        </Flex>
      )}
    </PageCard>
  );
}
