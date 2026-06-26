import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
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

  const locationState =
    (location.state as {
      serviceType?: string;
      templateId?: number;
      templateDetails?: {
        phases: Array<{
          config_phase_id: number | string;
          sort_order: number | string;
          processes: Array<{
            config_process_id: number | string;
            tasks: Array<{ config_task_id: number | string }>;
          }>;
        }>;
      };
    }) ?? {};

  const serviceType = locationState.serviceType;
  const existingTemplateDetails = locationState.templateDetails;
  const isEditMode = Boolean(locationState.templateId || existingTemplateDetails);

  const { data, isLoading } = usePlanningConfigurations(serviceType);

  const {
    templateState,
    setTemplateState,
    templateConfiguration,
    setTemplateConfiguration,
  } = useTemplateStore();

  useEffect(() => {
    const version_number = data?.version_number ?? 1;
    setTemplateConfiguration((prev) => ({
      ...prev,
      config_version_number: version_number,
    }));
  }, [data?.version_number, setTemplateConfiguration]);

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

  useEffect(() => {
    if (isEditMode) return;

    setTemplateConfiguration((prev) => ({
      ...prev,
      phases: templateState.phases.map((phaseId, index) => ({
        config_phase_id: phaseId,
        sort_order: index + 1,
        processes: [],
      })),
    }));
  }, [templateState.phases, serviceType, isEditMode, setTemplateConfiguration]);

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
            disabled={isEditMode && templateState.phases.includes(phase.id)}
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
                state: {
                  serviceType,
                  templateId: locationState.templateId,
                  templateDetails: existingTemplateDetails,
                },
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
