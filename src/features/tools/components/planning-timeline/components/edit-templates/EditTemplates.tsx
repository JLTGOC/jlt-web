import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { Divider, Group, Text, Flex, Button, Checkbox } from "@mantine/core";
import { KeyboardArrowDown, Delete, Close } from "@nine-thirty-five/material-symbols-react/rounded";
import { PageCard } from "@/components/PageCard";
import ConfirmDeleteProcessModal from "../../modals/ConfirmDeleteProcessModal";
import { ConfirmTemplateModal } from "../../modals/SaveEditTemplateModal";
import {
  useTemplateDetails,
  useUpdateTemplateDetails,
} from "@/features/tools/hooks/planningTImeline";

interface Template {
  id: number;
  name: string;
  version_number?: number;
  service_type?: string;
  is_active?: boolean;
}

interface TaskOption {
  value: string;
  label: string;
}

interface ProcessOption {
  id: number;
  name: string;
  tasks: TaskOption[];
}

interface PhaseOption {
  no: number;
  phase: string;
  processes: ProcessOption[];
}

const samplePhases: PhaseOption[] = [
  {
    no: 1,
    phase: "Phase 1 - Planning",
    processes: [
      { id: 1, name: "Process 1", tasks: [{ value: "task1", label: "Task 1" }, { value: "task2", label: "Task 2" }] },
      { id: 2, name: "Process 2", tasks: [{ value: "task3", label: "Task 3" }, { value: "task4", label: "Task 4" }] },
    ],
  },
  {
    no: 2,
    phase: "Phase 2 - Execution",
    processes: [
      { id: 1, name: "Process 1", tasks: [{ value: "task5", label: "Task 5" }, { value: "task6", label: "Task 6" }] },
      { id: 2, name: "Process 2", tasks: [{ value: "task7", label: "Task 7" }, { value: "task8", label: "Task 8" }] },
    ],
  },
  {
    no: 3,
    phase: "Phase 3 - Delivery",
    processes: [
      { id: 1, name: "Process 1", tasks: [{ value: "task9", label: "Task 9" }, { value: "task10", label: "Task 10" }] },
      { id: 2, name: "Process 2", tasks: [{ value: "task11", label: "Task 11" }, { value: "task12", label: "Task 12" }] },
    ],
  },
];

export default function EditTemplates() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const template = (location.state as { template?: Template })?.template;
  const templateIdFromQuery = Number(searchParams.get("templateId"));
  const templateId =
    Number.isFinite(templateIdFromQuery) && templateIdFromQuery > 0
      ? templateIdFromQuery
      : template?.id;

  const { data: templateDetails, isLoading, isError } = useTemplateDetails(templateId);
  const { mutate: updateTemplateDetails, isPending } = useUpdateTemplateDetails();

  const [phases, setPhases] = useState<PhaseOption[]>(samplePhases);
  const [selectedTasks, setSelectedTasks] = useState<Record<string, string[]>>({});
  const [expandedProcesses, setExpandedProcesses] = useState<Set<string>>(new Set());
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const [deleteProcessTarget, setDeleteProcessTarget] = useState<{
    phaseNo: number;
    processId: number;
  } | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  useEffect(() => {
    if (!templateDetails?.phases) return;

    const mappedPhases = templateDetails.phases.map((phase, index) => ({
      no: Number(phase.sort_order ?? index + 1),
      phase: phase.name,
      processes: phase.processes.map((process) => ({
        id: Number(process.config_process_id),
        name: process.name,
        tasks: process.tasks.map((task) => ({
          value: String(task.config_task_id),
          label: task.name,
        })),
      })),
    }));

    setPhases(mappedPhases);
  }, [templateDetails]);

  const handleAddPhase = () => {
    navigate("/tools/planning-timeline/add-template", {
      state: {
        serviceType: template?.service_type,
        templateId,
      },
    });
  };

  const handleAddProcess = (phaseNo: number) => {
    navigate("/tools/planning-timeline/add-template/process", {
      state: {
        serviceType: template?.service_type,
        templateId,
        phaseNo,
      },
    });
  };

  const handleDeleteProcess = () => {
    if (!deleteProcessTarget) return;

    setPhases((current) =>
      current.map((phase) =>
        phase.no === deleteProcessTarget.phaseNo
          ? {
              ...phase,
              processes: phase.processes.filter(
                (process) => process.id !== deleteProcessTarget.processId,
              ),
            }
          : phase,
      ),
    );

    setSelectedTasks((current) => {
      const next = { ...current };
      Object.keys(next).forEach((key) => {
        if (key === `phase_${deleteProcessTarget.phaseNo}_process_${deleteProcessTarget.processId}`) {
          delete next[key];
        }
      });
      return next;
    });

    setDeleteProcessTarget(null);
  };

  const handleSaveChanges = () => {
    setSaveModalOpen(true);
  };

  const handleConfirmSaveChanges = () => {
    if (!templateDetails || !templateId) return;

    const payload = {
      ...templateDetails,
      phases: templateDetails.phases.map((phase) => ({
        ...phase,
        headings: phase.headings.map((heading) => ({
          ...heading,
        })),
        processes: phase.processes.map((process) => ({
          ...process,
          tasks: process.tasks.map((task) => ({
            ...task,
          })),
        })),
      })),
    };

    updateTemplateDetails({
      templateId,
      payload,
    });
    setSaveModalOpen(false);
  };

  const toggleTaskSelection = (processKey: string, taskValue: string) => {
    setSelectedTasks((current) => {
      const currentSelection = current[processKey] ?? [];
      return {
        ...current,
        [processKey]: currentSelection.includes(taskValue)
          ? currentSelection.filter((task) => task !== taskValue)
          : [...currentSelection, taskValue],
      };
    });
  };

  const toggleProcessExpansion = (processKey: string) => {
    setExpandedProcesses((current) => {
      const next = new Set(current);
      if (next.has(processKey)) {
        next.delete(processKey);
      } else {
        next.add(processKey);
      }
      return next;
    });
  };

  const removeTaskSelection = (processKey: string, taskValue: string) => {
    setSelectedTasks((current) => ({
      ...current,
      [processKey]: (current[processKey] ?? []).filter((task) => task !== taskValue),
    }));
  };

  if (!templateId) {
    return (
      <PageCard title="Edit Template" shadow={false}>
        <Text c="red">Unable to load template details because the template id is missing.</Text>
      </PageCard>
    );
  }

  if (isLoading) {
    return (
      <PageCard title={template?.name || "Edit Template"} shadow={false}>
        <Text>Loading template details...</Text>
      </PageCard>
    );
  }

  if (isError) {
    return (
      <PageCard title={template?.name || "Edit Template"} shadow={false}>
        <Text c="red">Unable to load template details. Please try again.</Text>
      </PageCard>
    );
  }

  return (
    <>
      <PageCard
        title={template?.name || "Edit Template"}
        shadow={false}
        action={
          <Group wrap="nowrap" gap="md" mr="0.7rem">
            <Button
              variant="outline"
              color="#0064E0"
              onClick={handleAddPhase}
            >
              + ADD PHASE
            </Button>
            <Button
              bg="#4E6174"
              c="white"
              onClick={handleSaveChanges}
              loading={isPending}
            >
              SAVE CHANGES
            </Button>
          </Group>
        }
      >
        <Group
          justify="flex-start"
          align="center"
          p="sm"
          style={{ backgroundColor: "#17314B", height: "2.5rem" }}
        >
          <Text fw={500} w="60px" c="white">NO</Text>
          <Text fw={500} c="white">PHASES</Text>
        </Group>

        {phases.map((phase) => (
          <div key={phase.no}>
            <Group
              justify="flex-start"
              align="center"
              gap="lg"
              p="sm"
              style={{ borderBottom: "1px solid #dee2e6" }}
            >
              <Text fw={400} w="60px">{phase.no}</Text>
              <Text fw={400}>{phase.phase}</Text>
            </Group>

            <Group
              style={{
                border: "1px solid #dee2e6",
                padding: "0.75rem",
                borderRadius: "8px",
                flexDirection: "column",
                alignItems: "stretch",
                marginTop: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              <Group justify="space-between" align="center" gap="xs" mb="xs">
                <Text tt="uppercase" fw={600} size="sm">List of Process & Task</Text>
                <Text
                  c="var(--mantine-color-blue-6)"
                  fw={500}
                  fz="xs"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAddProcess(phase.no)}
                >
                  + Add Process
                </Text>
              </Group>

              {phase.processes.map((process) => {
                const processKey = `phase_${phase.no}_process_${process.id}`;
                return (
                  <Group
                    key={processKey}
                    style={{
                      border: "1px solid #dee2e6",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      flexDirection: "column",
                      alignItems: "stretch",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <Flex justify="space-between" align="center" gap="sm" mb="-1rem">
                      <Text fw={500} size="sm" c="#17314B">{process.name}</Text>
                      <button
                        onClick={() => setDeleteProcessTarget({ phaseNo: phase.no, processId: process.id })}
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          padding: 0,
                          color: "#AA4851",
                        }}
                      >
                        <Delete width="1.5rem" height="1.5rem" />
                      </button>
                    </Flex>

                    <Divider style={{ margin: "0.5rem -0.5rem" }} />

                    <Flex justify="space-between" align="center" gap="sm" mt="-1rem">
                      <div style={{ flex: 1 }}>
                        {(selectedTasks[processKey]?.length ?? 0) > 0 ? (
                          <Group gap="xs">
                            {selectedTasks[processKey].map((taskId) => (
                              <Group
                                key={taskId}
                                gap="xs"
                                style={{
                                  backgroundColor: "#dbdbdb",
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "20px",
                                  display: "inline-flex",
                                }}
                              >
                                <Text c="#17314B" size="sm" fw={500}>
                                  {process.tasks.find((task) => task.value === taskId)?.label}
                                </Text>
                                <button
                                  onClick={() => removeTaskSelection(processKey, taskId)}
                                  style={{
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Close width="1rem" height="1rem" />
                                </button>
                              </Group>
                            ))}
                          </Group>
                        ) : (
                          <Text c="#999" fw={500} fz="sm">
                            No selected tasks yet.
                          </Text>
                        )}
                      </div>
                      <button
                        onClick={() => toggleProcessExpansion(processKey)}
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        <KeyboardArrowDown
                          width="1.5rem"
                          height="1.5rem"
                          style={{
                            transform: expandedProcesses.has(processKey)
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </button>
                    </Flex>

                    {expandedProcesses.has(processKey) && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <Divider my="xs" />
                        <div>
                          {process.tasks.map((task) => (
                            <label
                              key={task.value}
                              onMouseEnter={() => setHoveredTask(task.value)}
                              onMouseLeave={() => setHoveredTask(null)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "0.5rem",
                                cursor: "pointer",
                                borderRadius: "4px",
                                justifyContent: "space-between",
                                backgroundColor:
                                  hoveredTask === task.value ? "#f0f0f0" : "transparent",
                              }}
                            >
                              <Text ml="0" size="sm">{task.label}</Text>
                              <Checkbox
                                checked={(selectedTasks[processKey] ?? []).includes(task.value)}
                                onChange={() => toggleTaskSelection(processKey, task.value)}
                                ml="auto"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </Group>
                );
              })}
            </Group>

            <Divider />
          </div>
        ))}
      </PageCard>

      <ConfirmDeleteProcessModal
        opened={deleteProcessTarget !== null}
        onClose={() => setDeleteProcessTarget(null)}
        onConfirm={handleDeleteProcess}
      />

      <ConfirmTemplateModal
        opened={saveModalOpen}
        isLoading={isPending}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleConfirmSaveChanges}
      />
    </>
  );
}
