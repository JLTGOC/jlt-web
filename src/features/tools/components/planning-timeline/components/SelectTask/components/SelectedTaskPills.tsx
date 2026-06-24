// components/SelectedTaskPills.tsx
import { Pill, PillGroup } from "@mantine/core";
import type {
  ConfigItem,
  TemplateConfigurationPayload,
} from "@/features/tools/types/planningTimeline";

type Props = {
  selectedTasks: { config_task_id: number }[];
  taskMap: Map<number, ConfigItem>;
  onRemove: (taskId: number) => void;
};

export function SelectedTaskPills({
  selectedTasks,
  taskMap,
  onRemove,
}: Props) {
  return (
    <PillGroup>
      {selectedTasks.map((t) => {
        const task = taskMap.get(t.config_task_id);
        if (!task) return null;

        return (
          <Pill
            key={task.id}
            withRemoveButton
            onRemove={() => onRemove(task.id)}
          >
            {task.name}
          </Pill>
        );
      })}
    </PillGroup>
  );
}