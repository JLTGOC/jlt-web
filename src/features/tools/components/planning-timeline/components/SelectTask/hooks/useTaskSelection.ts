// hooks/useTaskSelection.ts
import type { TemplateConfigurationPayload } from "@/features/tools/types/planningTimeline";

export function useTaskSelection(
  templateConfiguration: TemplateConfigurationPayload | undefined,
  setTemplateConfiguration: (value: TemplateConfigurationPayload) => void,
) {
  const isTaskSelected = (
    phaseId: number,
    processId: number,
    taskId: number,
  ) => {
    const phase = templateConfiguration?.phases?.find(
      (p) => p.config_phase_id === phaseId,
    );

    const process = phase?.processes?.find(
      (p) => p.config_process_id === processId,
    );

    return process?.tasks?.some(
      (t) => t.config_task_id === taskId,
    ) ?? false;
  };

  const getSelectedTasks = (phaseId: number, processId: number) => {
    const phase = templateConfiguration?.phases?.find(
      (p) => p.config_phase_id === phaseId,
    );

    const process = phase?.processes?.find(
      (p) => p.config_process_id === processId,
    );

    return process?.tasks ?? [];
  };

  const handleTaskSelect = (
    phaseId: number,
    processId: number,
    taskId: number,
    checked: boolean,
  ) => {
    const updated = (templateConfiguration?.phases ?? []).map((phase) => {
      if (phase.config_phase_id !== phaseId) return phase;

      return {
        ...phase,
        processes: phase.processes.map((process) => {
          if (process.config_process_id !== processId) return process;

          const tasks = process.tasks ?? [];

          return {
            ...process,
            tasks: checked
              ? tasks.some((t) => t.config_task_id === taskId)
                ? tasks
                : [...tasks, { config_task_id: taskId }]
              : tasks.filter((t) => t.config_task_id !== taskId),
          };
        }),
      };
    });

    setTemplateConfiguration({
      ...templateConfiguration!,
      phases: updated,
    });
  };

  return {
    isTaskSelected,
    getSelectedTasks,
    handleTaskSelect,
  };
}