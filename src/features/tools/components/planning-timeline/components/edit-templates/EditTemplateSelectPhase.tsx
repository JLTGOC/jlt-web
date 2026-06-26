import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { Text, Table, Checkbox, Flex, Button } from "@mantine/core";

import {
  usePlanningConfigurations,
  useTemplateDetails,
} from "@/features/tools/hooks/planningTImeline";
import { PageCard } from "@/components/PageCard";
import { useTemplateStore } from "@/features/tools/store/LogisticsCreatePlanningTemplate";
import type { TemplateDetailsResponse } from "@/features/tools/types/planningTimeline";

interface LocationState {
  templateId?: number;
  template?: TemplateDetailsResponse;
  serviceType?: string;
}

export default function EditTemplateSelectPhase() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const locationState = (location.state as LocationState) ?? {};
  const templateId = locationState.templateId ?? Number(searchParams.get("templateId"));
  const serviceType = locationState.serviceType;
  const apiTemplate = locationState.template;

  const { data: template, isLoading: isTemplateLoading } = useTemplateDetails(templateId);
  const { data, isLoading } = usePlanningConfigurations(serviceType);
  const {
    setTemplateState,
    setTemplateConfiguration,
  } = useTemplateStore();

  const [selectedPhaseIds, setSelectedPhaseIds] = useState<number[]>([]);

  const selectedTemplate = apiTemplate ?? template;

  const existingPhaseIds = useMemo(
    () => selectedTemplate?.phases.map((phase) => Number(phase.config_phase_id)) ?? [],
    [selectedTemplate?.phases],
  );

  useEffect(() => {
    if (!selectedTemplate) return;

    setSelectedPhaseIds(existingPhaseIds);
  }, [existingPhaseIds, selectedTemplate]);

  const togglePhase = (phaseId: number) => {
    setSelectedPhaseIds((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId],
    );
  };

  const handleNext = () => {
    if (!templateId || !selectedTemplate) return;

    const configuredPhases = selectedPhaseIds.map((phaseId, index) => ({
      config_phase_id: phaseId,
      sort_order: index + 1,
      processes: [],
    }));

    setTemplateState((prev) => ({
      ...prev,
      phases: selectedPhaseIds,
    }));

    setTemplateConfiguration((prev) => ({
      ...prev,
      phases: configuredPhases,
    }));

    navigate("/tools/planning-timeline/add-template/process", {
      state: {
        serviceType,
        templateId,
        templateDetails: selectedTemplate,
      },
    });
  };

  const rows = (data?.phases ?? []).map((phase) => {
    const isExisting = existingPhaseIds.includes(phase.id);
    const isSelected = selectedPhaseIds.includes(phase.id);

    return (
      <Table.Tr key={phase.id} style={{ opacity: isExisting ? 0.5 : 1 }}>
        <Table.Td>{phase.id}</Table.Td>
        <Table.Td>{phase.name}</Table.Td>
        <Table.Td ta="center">
          <Checkbox
            checked={isSelected}
            disabled={isExisting}
            onChange={() => togglePhase(phase.id)}
          />
        </Table.Td>
      </Table.Tr>
    );
  });

  if (isLoading || isTemplateLoading) {
    return (
      <PageCard title="Add Phases" showDivider>
        <Flex justify="center" align="center" style={{ minHeight: 160 }}>
          <Text>Loading available phases...</Text>
        </Flex>
      </PageCard>
    );
  }

  return (
    <>
      <PageCard
        title="Select Phases"
        showDivider
        action={
          <Button
            onClick={handleNext}
            disabled={selectedPhaseIds.length === 0}
          >
            NEXT
          </Button>
        }
      >
        <Table highlightOnHover striped>
          <Table.Thead bg="#17314B" c="white">
            <Table.Tr>
              <Table.Th>NO</Table.Th>
              <Table.Th>PHASE</Table.Th>
              <Table.Th >SELECT</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </PageCard>
    </>
  );
}
