import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Button, Table } from "@mantine/core";
import { Save } from "@nine-thirty-five/material-symbols-react/rounded";

import {
  usePlanningConfigurations,
  useCreateTemplate,
} from "@/features/tools/hooks/usePlanningTimeline";

import { useTemplateStore } from "@/features/tools/store/LogisticsCreatePlanningTemplate";

import { PageCard } from "@/components/PageCard";
import SaveTemplateConfigurationModal from "../../modals/SaveTemplateConfigurationModal";
import { ConfirmSaveTemplate } from "../../modals/ConfirmSaveTemplateConfigurationModal";

import { useTaskSelection } from "./hooks/useTaskSelection";
import { ProcessRow } from "./components/ProcessRow";

export default function SelectTask() {
  const location = useLocation();
  const serviceType = location.state?.serviceType;

  const { data, isLoading } = usePlanningConfigurations(serviceType);
  const { mutate: createTemplateMutation, isPending } =
    useCreateTemplate(serviceType);

  const { templateConfiguration, setTemplateConfiguration } =
    useTemplateStore();

  const {
    isTaskSelected,
    getSelectedTasks,
    handleTaskSelect,
  } = useTaskSelection(
    templateConfiguration,
    setTemplateConfiguration,
  );

  const [openedProcessId, setOpenedProcessId] = useState<
    string | null
  >(null);

  const [modalState, setModalState] = useState({
    save: false,
    confirmSave: false,
    name: "",
    service_type_id: 0,
  });

  useEffect(() => {
    console.log("Task page", templateConfiguration);
  }, [templateConfiguration]);

  const phases = templateConfiguration?.phases ?? [];

  const canSaveTemplate = useMemo(() => {
    return (
      phases.length > 0 &&
      phases.every(
        (phase) =>
          (phase.processes?.length ?? 0) > 0 &&
          phase.processes.every(
            (process) =>
              (process.tasks?.length ?? 0) > 0,
          ),
      )
    );
  }, [phases]);

  const rowPhases = useMemo(() => {
    const selectedPhaseIds = new Set(
      (templateConfiguration?.phases ?? []).map(
        (p) => p.config_phase_id,
      ),
    );

    return (
      data?.phases?.filter((phase) =>
        selectedPhaseIds.has(phase.id),
      ) ?? []
    );
  }, [data?.phases, templateConfiguration?.phases]);

  const rowProcesses = (phaseId: number) => {
    const phaseConfig = templateConfiguration?.phases?.find(
      (p) => p.config_phase_id === phaseId,
    );

    if (!phaseConfig) return [];

    const selectedProcessesId = new Set(
      phaseConfig.processes.map(
        (p) => p.config_process_id,
      ),
    );

    return (
      data?.processes?.filter((process) =>
        selectedProcessesId.has(process.id),
      ) ?? []
    );
  };

  const rows = rowPhases.flatMap((phase) => {
    const processes = rowProcesses(phase.id);

    return [
      <Table.Tr key={`phase-${phase.id}`}>
        <Table.Td w={60}>
          {String(phase.id).padStart(2, "0")}
        </Table.Td>
        <Table.Td fw={600}>{phase.name}</Table.Td>
      </Table.Tr>,

      ...processes.flatMap((process) => (
        <ProcessRow
          key={`process-${phase.id}-${process.id}`}
          phase={phase}
          process={process}
          selectedTasks={getSelectedTasks(
            phase.id,
            process.id,
          )}
          taskMap={new Map(
            (data?.tasks ?? []).map((t) => [t.id, t]),
          )}
          allTasks={data?.tasks ?? []}
          isTaskSelected={isTaskSelected}
          handleTaskSelect={handleTaskSelect}
          openedProcessId={openedProcessId}
          setOpenedProcessId={setOpenedProcessId}
        />
      )),
    ];
  });

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
            onClick={() =>
              setModalState((prev) => ({
                ...prev,
                save: true,
              }))
            }
            leftSection={
              <Save
                width="1.25rem"
                height="1.25rem"
                fill="currentColor"
              />
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
              <Table.Th style={{ width: "75%" }}>
                PROCESS
              </Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </PageCard>

      <SaveTemplateConfigurationModal
        opened={modalState.save}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            save: false,
          }))
        }
        onConfirm={() => {
          setModalState((prev) => ({
            ...prev,
            confirmSave: true,
            save: false,
          }));
        }}
        serviceType={serviceType}
        setModalState={setModalState}
        modalState={modalState}
      />

      <ConfirmSaveTemplate
        opened={modalState.confirmSave}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            confirmSave: false,
          }))
        }
        onConfirm={() =>
          createTemplateMutation(templateConfiguration)
        }
        isPending={isPending}
      />
    </>
  );
}