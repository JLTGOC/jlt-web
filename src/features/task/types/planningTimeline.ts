export type PlanningTemplateResponse = {
  id: number;
  name: string;
  version_number: number;
  service_type: "IMPORT" | "EXPORT";
  service_category: string;
  is_active: boolean;
  phases: PlanningPhase[];
};

export type PlanningPhase = {
  id: number;
  config_phase_id: number;
  name: string;
  sort_order: number;
  headings: PlanningHeading[];
  processes: PlanningProcess[];
};

export type PlanningHeading = {
  id: number;
  template_phase_id: number;
  name: string;
  input_type: "TEXT" | "NUMBER" | "DATETIME";
  sort_order: number;
  is_default: boolean;
};

export type PlanningProcess = {
  id: number;
  config_process_id: number;
  name: string;
  tasks: PlanningTask[];
};

export type PlanningTask = {
  id: number;
  config_task_id: number;
  name: string;
};