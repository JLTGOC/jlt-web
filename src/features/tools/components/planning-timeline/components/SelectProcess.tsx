import { useCallback, useEffect, useMemo, useState } from "react";
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


import { usePlanningConfigurations, useUpdateTemplateDetails } from "@/features/tools/hooks/planningTImeline";
import { useTemplateStore } from "@/features/tools/store/LogisticsCreatePlanningTemplate";
import { PageCard } from "@/components/PageCard";
import { SaveUpdatedTemplateModal } from "@/features/tools/components/planning-timeline/modals/SaveUpdatedTemplateModal";
import type {
  TemplateDetailsResponse,
  TemplateUpdatePayload,
} from "@/features/tools/types/planningTimeline";

export default function SelectProcess() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState =
    (location.state as {
      serviceType?: string;
      templateId?: number;
      templateDetails?: TemplateDetailsResponse;
    }) ?? {};

  const serviceType = locationState.serviceType;
  const templateId =
    locationState.templateId ??
    (locationState.templateDetails ? Number(locationState.templateDetails.id) : undefined);
  const existingTemplateDetails = locationState.templateDetails;
  const isEditMode =
    Boolean(existingTemplateDetails) || templateId !== undefined;

  const { data, isLoading } = usePlanningConfigurations(serviceType);

  const {
    templateState,
    setTemplateState,
    templateConfiguration,
    setTemplateConfiguration,
  } = useTemplateStore();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { mutate: updateTemplateDetails, isPending } = useUpdateTemplateDetails();

  useEffect(() => {
    if (!existingTemplateDetails) return;
    if (templateState.phases.length > 0 || templateConfiguration.phases.length > 0)
      return;

    const phases = existingTemplateDetails.phases.map((phase) =>
      Number(phase.config_phase_id),
    );

    const configuredPhases = existingTemplateDetails.phases.map((phase) => ({
      config_phase_id: Number(phase.config_phase_id),
      sort_order: Number(phase.sort_order ?? 0),
      processes: phase.processes.map((process) => ({
        config_process_id: Number(process.config_process_id),
        tasks: (process.tasks ?? []).map((task) => ({
          config_task_id: Number(task.config_task_id),
        })),
      })),
    }));

    setTemplateState((prev) => ({
      ...prev,
      phases,
      processes: configuredPhases.flatMap((phase) =>
        phase.processes.map((process) => process.config_process_id),
      ),
    }));

    setTemplateConfiguration((prev) => ({
      ...prev,
      phases: configuredPhases,
    }));
  }, [
    existingTemplateDetails,
    templateState.phases.length,
    templateConfiguration.phases.length,
    setTemplateState,
    setTemplateConfiguration,
  ]);

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

  const handleConfirmSave = () => {
    if (!templateId || !existingTemplateDetails) return;

    const payload: TemplateUpdatePayload = {
      name: existingTemplateDetails.name,
      config_version_number: Number(existingTemplateDetails.version_number),
      template_version_number: Number(existingTemplateDetails.version_number),
      phases: templateConfiguration.phases.map((phase) => ({
        ...phase,
        processes: phase.processes.map((process) => ({
          ...process,
          tasks: process.tasks.map((task) => ({
            ...task,
          })),
        })),
      })),
    };

    updateTemplateDetails({ templateId, payload });
    setShowConfirmModal(false);
  };

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
        {leftColumn.map((left) => {
          const checked = isProcessChecked(phase.id, left.id);
          return (
            <Box key={left.id} p="xs">
              <Checkbox
                label={<Text style={{ color: checked ? "#000" : "#6c757d" }}>{left.name}</Text>}
                checked={checked}
                onChange={() => toggleProcess(left.id, phase.id)}
              />
            </Box>
          );
        })}
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
        {rightColumn.map((right) => {
          const checked = isProcessChecked(phase.id, right.id);
          return (
            <Box key={right.id} p="xs">
              <Checkbox
                label={<Text style={{ color: checked ? "#000" : "#6c757d" }}>{right.name}</Text>}
                checked={checked}
                onChange={() => toggleProcess(right.id, phase.id)}
              />
            </Box>
          );
        })}
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
          onClick={() => {
            if (isEditMode) {
              setShowConfirmModal(true);
            } else {
              navigate("/tools/planning-timeline/add-template/task", {
                state: { serviceType },
              });
            }
          }}
          disabled={!allPhasesHaveProcess}
        >
          {isEditMode ? "SAVE CHANGES" : "NEXT"}
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

      <SaveUpdatedTemplateModal
        opened={showConfirmModal}
        isLoading={isPending}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
      />
    </PageCard>
  );
}
