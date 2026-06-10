export type PlanningConfigurationResponse = {
    version_number: number,
    phases: ConfigItem[],
    processes: ConfigItem[],
    tasks: ConfigItem[]
}

export interface ConfigItem {
        id: number,
        name: string,
        is_locked?: boolean,
        used_by_templates?: UsedByTemplates[]
}

export interface UsedByTemplates {
    id: number,
    name: string,
    version_number: number,
    services: string,
    is_active: boolean
}