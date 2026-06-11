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

export interface TemplateDetailsResponse {
  id: number;
  name: string;
  version_number: number;
  service_type: string;
  is_active: string;
  phases: [
    {
      id: number;
      config_phase_id: number;
      name: string;
      sort_order: number;
      headings: [
        {
          id: number;
          template_phase_id: number;
          name: string;
          input_type: string;
          sort_order: number;
        },
      ];
      processes: [
        {
          id: number;
          config_process_id: number;
          name: string;
          tasks: [{ id: number; config_task_id: number; name: string }];
        },
      ];
    },
  ];
}

export interface TemplateListResponse {
  id: number;
  name: string;
  version_number: number;
  service_type: number;
  is_active: boolean;
}
export interface TemplateConfiguration {
  phase: [phaseId: number];
}
