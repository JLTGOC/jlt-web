import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

import { Button, Table, Group, Stack, Checkbox, Collapse } from "@mantine/core";
import {
  Preview,
  Save,
} from "@nine-thirty-five/material-symbols-react/rounded";

import {
  usePlanningConfigurations,
  useCreateTemplate,
} from "@/features/tools/hooks/planningTImeline";
import { useTemplateStore } from "@/features/tools/store/LogisticsCreatePlanningTemplate";

import { PageCard } from "@/components/PageCard";
import SaveTemplateConfigurationModal from "../modals/SaveTemplateConfigurationModal";
import { ConfirmSaveTemplate } from "../modals/ConfirmSaveTemplateConfigurationModal";

export default function SelectTask() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceType = location.state?.serviceType;
  const { data, isLoading } = usePlanningConfigurations(serviceType);
  const { mutate: createTemplateMutation, isPending } =
    useCreateTemplate(serviceType);

  const { templateConfiguration, setTemplateConfiguration } =
    useTemplateStore();

  useEffect(() => {
    console.log("Task page", templateConfiguration);
  }, [templateConfiguration]);

  const [openedProcessId, setOpenedProcessId] = useState<string | null>(null);

  const [modalState, setModalState] = useState({
    save: false,
    confirmSave: false,
    name: "",
    service_type_id: 0,
  });

  const phases = templateConfiguration?.phases ?? [];

  const isTaskSelected = (
    phaseId: number,
    processId: number,
    taskId: number,
  ) => {
    // Added optional chaining here to prevent null/undefined crashes
    const phase = templateConfiguration?.phases?.find(
      (p) => p.config_phase_id === phaseId,
    );

    const process = phase?.processes?.find(
      (p) => p.config_process_id === processId,
    );

    return process?.tasks?.some((t) => t.config_task_id === taskId) ?? false;
  };

  const canSaveTemplate = useMemo(() => {
    return (
      phases.length > 0 &&
      phases.every(
        (phase) =>
          (phase.processes?.length ?? 0) > 0 &&
          phase.processes.every((process) => (process.tasks?.length ?? 0) > 0),
      )
    );
  }, [phases]);

  const handleTaskSelect = (
    phaseId: number,
    processId: number,
    taskId: number,
    checked: boolean,
  ) => {
    // Added fallback array to safely use .map
    const updatedPhases = (templateConfiguration?.phases ?? []).map((phase) => {
      if (phase.config_phase_id !== phaseId) return phase;

      return {
        ...phase,
        processes: (phase.processes ?? []).map((process) => {
          if (process.config_process_id !== processId) return process;

          const tasks = process.tasks ?? [];

          return {
            ...process,
            tasks: checked
              ? [...tasks, { config_task_id: taskId }]
              : tasks.filter((t) => t.config_task_id !== taskId),
          };
        }),
      };
    });

    setTemplateConfiguration({
      ...templateConfiguration,
      phases: updatedPhases,
    });
  };

  const rowPhases = useMemo(() => {
    // Added fallback array to avoid mapping over undefined array values
    const selectedPhaseIds = new Set(
      (templateConfiguration?.phases ?? []).map((p) => p.config_phase_id),
    );

    return (
      data?.phases?.filter((phase) => selectedPhaseIds.has(phase.id)) ?? []
    );
  }, [data?.phases, templateConfiguration?.phases]);

  const rowProcesses = (phaseId: number) => {
    const phaseConfig = templateConfiguration?.phases?.find(
      (p) => p.config_phase_id === phaseId,
    );

    if (!phaseConfig || !phaseConfig.processes) return [];

    const selectedProcessesId = new Set(
      phaseConfig.processes.map((p) => p.config_process_id),
    );

    return (
      data?.processes?.filter((process) =>
        selectedProcessesId.has(process.id),
      ) ?? []
    );
  };

  const rows = rowPhases.flatMap((phase) => {
    console.log("phase", phase);
    const processes = rowProcesses(phase.id);

    return [
      <Table.Tr key={`phase-${phase.id}`}>
        <Table.Td w={60}>{String(phase.id).padStart(2, "0")}</Table.Td>
        <Table.Td fw={600}>{phase.name}</Table.Td>
      </Table.Tr>,

      ...processes.flatMap((process) => [
        <Table.Tr key={`process-${phase.id}-${process.id}`}>
          <Table.Td />
          <Table.Td>{process.name}</Table.Td>
        </Table.Tr>,

        <Table.Tr key={`task-${phase.id}-${process.id}`}>
          <Table.Td />
          <Table.Td ta="center">
            <Button
              variant="transparent"
              onClick={() => {
                const id = `${phase.id}-${process.id}`;
                setOpenedProcessId((prev) => (prev === id ? null : id));
              }}
            >
              Select Task
            </Button>
            <Collapse in={openedProcessId === `${phase.id}-${process.id}`}>
              <Stack gap="sm">
                {data?.tasks?.map((task, index) => (
                  <Checkbox
                    key={index}
                    label={task.name}
                    checked={isTaskSelected(phase.id, process.id, task.id)}
                    onChange={(event) =>
                      handleTaskSelect(
                        phase.id,
                        process.id,
                        task.id,
                        event.currentTarget.checked,
                      )
                    }
                  />
                ))}
              </Stack>
            </Collapse>
          </Table.Td>
        </Table.Tr>,
      ]),
    ];
  });

  // Optional: Return a shell loader if data is loading from backend
  if (isLoading) {
    return (
      <PageCard title="Select Task" showDivider>
        <div>Loading configuration data...</div>
      </PageCard>
    );
  }

  return (
    <>
      <PageCard
        title="Select Task"
        showDivider
        action={
          <Button
            onClick={() => setModalState((prev) => ({ ...prev, save: true }))}
            leftSection={
              <Save width="1.25rem" height="1.25rem" fill="currentColor" />
            }
            disabled={!canSaveTemplate}
          >
            SAVE TEMPLATE
          </Button>
        }
      >
        <Table>
          <Table.Thead bg="#17314B" c="white">
            <Table.Tr>
              <Table.Th>NO</Table.Th>
              <Table.Th style={{ width: "75%" }}>PROCESS</Table.Th>
              <Table.Th ta={"right"}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </PageCard>
      <SaveTemplateConfigurationModal
        opened={modalState.save}
        onClose={() => setModalState((prev) => ({ ...prev, save: false }))}
        onConfirm={() => {
          (setModalState((prev) => ({ ...prev, confirmSave: true })),
            setModalState((prev) => ({ ...prev, save: false })));
        }}
        serviceType={serviceType}
        setModalState={setModalState}
        modalState={modalState}
      />
      <ConfirmSaveTemplate
        opened={modalState.confirmSave}
        onClose={() =>
          setModalState((prev) => ({ ...prev, confirmSave: false }))
        }
        onConfirm={() => {
          createTemplateMutation(templateConfiguration);
        }}
        isPending={isPending}
      />
    </>
  );
}
