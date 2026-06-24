// components/ProcessRow.tsx
import { Table, Button, Collapse } from "@mantine/core";
import { SelectedTaskPills } from "./SelectedTaskPills";
import { TaskSelector } from "./TaskSelector";
import type {
  ConfigItem,
  TemplateConfigurationPayload,
} from "@/features/tools/types/planningTimeline";

type Props = {
  phase: any;
  process: any;
  selectedTasks: { config_task_id: number }[];

  taskMap: Map<number, ConfigItem>;
  allTasks: ConfigItem[];

  isTaskSelected: (
    phaseId: number,
    processId: number,
    taskId: number,
  ) => boolean;

  handleTaskSelect: (
    phaseId: number,
    processId: number,
    taskId: number,
    checked: boolean,
  ) => void;

  openedProcessId: string | null;
  setOpenedProcessId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
};

export function ProcessRow({
  phase,
  process,
  selectedTasks,
  taskMap,
  allTasks,
  isTaskSelected,
  handleTaskSelect,
  openedProcessId,
  setOpenedProcessId,
}: Props) {
  const id = `${phase.id}-${process.id}`;

  return (
    <>
      <Table.Tr>
        <Table.Td />
        <Table.Td>{process.name}</Table.Td>
      </Table.Tr>

      {selectedTasks.length > 0 && (
        <Table.Tr>
          <Table.Td />
          <Table.Td>
            <SelectedTaskPills
              selectedTasks={selectedTasks}
              taskMap={taskMap}
              onRemove={(taskId) =>
                handleTaskSelect(
                  phase.id,
                  process.id,
                  taskId,
                  false,
                )
              }
            />
          </Table.Td>
        </Table.Tr>
      )}

      <Table.Tr>
        <Table.Td />
        <Table.Td>
          <Button
            variant="transparent"
            onClick={() =>
              setOpenedProcessId(openedProcessId === id ? null : id)
            }
          >
            Select Task
          </Button>

          <Collapse in={openedProcessId === id}>
            <TaskSelector
              tasks={allTasks}
              phaseId={phase.id}
              processId={process.id}
              isTaskSelected={isTaskSelected}
              onTaskChange={handleTaskSelect}
            />
          </Collapse>
        </Table.Td>
      </Table.Tr>
    </>
  );
}