import { useLocation, useNavigate } from "react-router";
import { Divider, Group, Text, Flex, Button, Checkbox } from "@mantine/core";
import { KeyboardArrowDown, Delete, Close } from "@nine-thirty-five/material-symbols-react/rounded";
import { PageCard } from "@/components/PageCard";
import { useState } from "react";

interface Template {
  id: number;
  name: string;
  version_number?: number;
  service_type?: string;
  is_active?: boolean;
}

export default function EditTemplates() {
  const location = useLocation();
  const navigate = useNavigate();
  const template = (location.state as { template?: Template })?.template;

  // Sample phases data - replace with real data from API
  const samplePhases = [
    { 
      no: 1, 
      phase: "Phase 1 - Planning",
      processes: [
        { id: 1, name: "Process 1", tasks: [{ value: "task1", label: "Task 1" }, { value: "task2", label: "Task 2" }] },
        { id: 2, name: "Process 2", tasks: [{ value: "task3", label: "Task 3" }, { value: "task4", label: "Task 4" }] },
      ]
    },
    { 
      no: 2, 
      phase: "Phase 2 - Execution",
      processes: [
        { id: 1, name: "Process 1", tasks: [{ value: "task5", label: "Task 5" }, { value: "task6", label: "Task 6" }] },
        { id: 2, name: "Process 2", tasks: [{ value: "task7", label: "Task 7" }, { value: "task8", label: "Task 8" }] },
      ]
    },
    { 
      no: 3, 
      phase: "Phase 3 - Delivery",
      processes: [
        { id: 1, name: "Process 1", tasks: [{ value: "task9", label: "Task 9" }, { value: "task10", label: "Task 10" }] },
        { id: 2, name: "Process 2", tasks: [{ value: "task11", label: "Task 11" }, { value: "task12", label: "Task 12" }] },
      ]
    },
  ];

  const [selectedTasks, setSelectedTasks] = useState<Record<string, string[]>>({});
  const [expandedProcesses, setExpandedProcesses] = useState<Set<string>>(new Set());
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  return (
    <PageCard
      title={template?.name || "Edit Template"}
      shadow={false}
      action={
        <Group wrap="nowrap" gap="md" mr="0.7rem">
          <Button variant="outline" color="#0064E0" onClick={() => navigate("/tools/planning-timeline/add-template", {
            state: { serviceType: template?.service_type }
          })}>
            + ADD PHASE
          </Button>
          <Button bg="#4E6174" c="white">
            SAVE CHANGES
          </Button>
        </Group>
      }
    >
      {/* Column Header */}
      <Group 
        justify="flex-start" 
        align="center" 
        p="sm" 
        style={{ backgroundColor: "#17314B", height: "2.5rem" }}
      >
        <Text fw={500} w="60px" c="white">NO</Text>
        <Text fw={500} c="white">PHASES</Text>
      </Group>

      {samplePhases.map((phase) => (
        <div key={phase.no}>
          {/* Phase Row */}
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

          {/* Process & Task Section for this Phase */}
          <Group 
            style={{ 
              border: "1px solid #dee2e6",
              padding: "0.75rem",
              borderRadius: "8px",
              flexDirection: "column",
              alignItems: "stretch",
              marginTop: "0.75rem",
              marginBottom: "0.75rem"
            }}
          >
            <Group justify="space-between" align="center" gap="xs" mb="xs">
              <Text tt="uppercase" fw={600} size="sm">List of Process & Task</Text>
              <Text 
                c="var(--mantine-color-blue-6)" 
                fw={500}
                fz="xs" 
                style={{ cursor: "pointer" }}
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
                  marginBottom: "0.75rem"
                }}
              >
                {/* Top Section: Process Title + Delete Icon */}
                <Flex justify="space-between" align="center" gap="sm" mb="-1rem">
                  <Text fw={500} size="sm" c="#17314B">{process.name}</Text>
                  <button
                    onClick={() => {
                      // Delete handler - remove process from list
                    }}
                    style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "#FF6B6B" }}
                  >
                    <Delete width="1.5rem" height="1.5rem" />
                  </button>
                </Flex>

                <Divider style={{ margin: "0.5rem -0.5rem" }} />

                {/* Bottom Section: Task Selection + Arrow */}
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
                              display: "inline-flex"
                            }}
                          >
                            <Text c="#17314B" size="sm" fw={500}>
                              {process.tasks.find(t => t.value === taskId)?.label}
                            </Text>
                            <button
                              onClick={() => {
                                const current = selectedTasks[processKey] ?? [];
                                setSelectedTasks({
                                  ...selectedTasks,
                                  [processKey]: current.filter(t => t !== taskId)
                                });
                              }}
                              style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
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
                    onClick={() => {
                      const newExpanded = new Set(expandedProcesses);
                      if (newExpanded.has(processKey)) {
                        newExpanded.delete(processKey);
                      } else {
                        newExpanded.add(processKey);
                      }
                      setExpandedProcesses(newExpanded);
                    }}
                    style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}
                  >
                    <KeyboardArrowDown 
                      width="1.5rem" 
                      height="1.5rem"
                      style={{ transform: expandedProcesses.has(processKey) ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>
                </Flex>

                {/* Accordion: Expand/Collapse Task List */}
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
                            backgroundColor: hoveredTask === task.value ? "#f0f0f0" : "transparent"
                          }}
                        >
                          <Text ml="0" size="sm">{task.label}</Text>
                          <Checkbox
                            checked={(selectedTasks[processKey] ?? []).includes(task.value)}
                            onChange={() => {
                              const current = selectedTasks[processKey] ?? [];
                              if (current.includes(task.value)) {
                                setSelectedTasks({
                                  ...selectedTasks,
                                  [processKey]: current.filter(t => t !== task.value)
                                });
                              } else {
                                setSelectedTasks({
                                  ...selectedTasks,
                                  [processKey]: [...current, task.value]
                                });
                              }
                            }}
                            readOnly
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
  );
}
