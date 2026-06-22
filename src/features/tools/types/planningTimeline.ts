export type PlanningConfigurationResponse = {
  version_number: number;
  phases: ConfigItem[];
  processes: ConfigItem[];
  tasks: ConfigItem[];
};

export interface ConfigItem {
  id: number;
  name: string;
  is_locked?: boolean;
  used_by_templates?: UsedByTemplates[];
}

export interface UsedByTemplates {
  id: number;
  name: string;
  version_number: number;
  services: string;
  is_active: boolean;
}

export interface PlanningPhaseHeadingResource {
  id: string | number;
  template_phase_id: string | number;
  name: string;
  input_type: string;
  sort_order: string | number;
  is_default: string | number;
}

export interface TemplatePhaseProcessTaskResource {
  id: string | number;
  config_task_id: string | number;
  name: string;
}

export interface TemplatePhaseProcessResource {
  id: string | number;
  config_process_id: string | number;
  name: string;
  tasks: TemplatePhaseProcessTaskResource[];
}

export interface TemplatePhaseResource {
  id: string | number;
  config_phase_id: string | number;
  name: string;
  sort_order: string | number;
  headings: PlanningPhaseHeadingResource[];
  processes: TemplatePhaseProcessResource[];
}

export interface TemplateDetailsResponse {
  id: string | number;
  name: string;
  version_number: string | number;
  service_type: string;
  service_category?: string;
  is_active: string | boolean;
  phases: TemplatePhaseResource[];
}

export interface TemplateListResponse {
  id: number;
  name: string;
  version_number: number;
  service_type: number;
  is_active: boolean;
}

export interface TemplateConfigurationPayload {
  name: string;
  service_type_id: number;
  config_version_number: number;
  phases: {
    config_phase_id: number;
    sort_order: number;
    processes: {
      config_process_id: number;
      tasks: {
        config_task_id: number;
      }[];
    }[];
  }[];
}

export interface ServiceTypeResponse {
  id: number;
  isActive: string;
  name: string;
  service_type: string;
  version_number: number;
}
