// components/TaskSelector.tsx
import { Stack, Checkbox } from "@mantine/core";
import type { ConfigItem } from "@/features/tools/types/planningTimeline";

type Props = {
  tasks: ConfigItem[];
  phaseId: number;
  processId: number;

  isTaskSelected: (
    phaseId: number,
    processId: number,
    taskId: number,
  ) => boolean;

  onTaskChange: (
    phaseId: number,
    processId: number,
    taskId: number,
    checked: boolean,
  ) => void;
};

export function TaskSelector({
  tasks,
  phaseId,
  processId,
  isTaskSelected,
  onTaskChange,
}: Props) {
  return (
    <Stack gap="sm">
      {tasks.map((task) => (
        <Checkbox
          key={task.id}
          label={task.name}
          checked={isTaskSelected(phaseId, processId, task.id)}
          onChange={(e) =>
            onTaskChange(
              phaseId,
              processId,
              task.id,
              e.currentTarget.checked,
            )
          }
        />
      ))}
    </Stack>
  );
}