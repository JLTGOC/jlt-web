import { create } from "zustand";
import type { TemplateConfigurationPayload } from "../types/planningTimeline";

interface TemplateStore {
  templateState: {
    phases: number[];
    processes: number[];
    tasks: number[];
  };

  templateConfiguration: TemplateConfigurationPayload;

  setTemplateState: (
    updater:
      | { phases: number[]; processes: number[]; tasks: number[] }
      | ((prev: { phases: number[]; processes: number[]; tasks: number[] }) => {
          phases: number[];
          processes: number[];
          tasks: number[];
        }),
  ) => void;

  setTemplateConfiguration: (
    updater:
      | TemplateConfigurationPayload
      | ((prev: TemplateConfigurationPayload) => TemplateConfigurationPayload),
  ) => void;

  reset: () => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templateState: {
    phases: [],
    processes: [],
    tasks: [],
  },

  templateConfiguration: {
    name: "",
    service_type_id: 0,
    config_version_number: 0,
    phases: [],
  },

  setTemplateState: (updater) =>
    set((state) => ({
      templateState:
        typeof updater === "function" ? updater(state.templateState) : updater,
    })),

  setTemplateConfiguration: (updater) =>
    set((state) => ({
      templateConfiguration:
        typeof updater === "function"
          ? updater(state.templateConfiguration)
          : updater,
    })),

  reset: () =>
    set({
      templateState: { phases: [], processes: [], tasks: [] },
      templateConfiguration: {
        name: "",
        service_type_id: 0,
        config_version_number: 0,
        phases: [],
      },
    }),
}));
