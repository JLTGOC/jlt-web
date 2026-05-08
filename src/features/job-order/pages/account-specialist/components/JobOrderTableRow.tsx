import type { JobOrderServiceType } from "../../../types/jobOrder";

const SERVICE_COLOR: Record<JobOrderServiceType, string> = {
  Logistics: "blue",
  Regulatory: "green",
};

export function getJobOrderRowStyle(
  serviceType: JobOrderServiceType,
): React.CSSProperties {
  return {
    boxShadow: `inset 0.5rem 0 0 0 var(--mantine-color-${SERVICE_COLOR[serviceType]}-6)`,
  };
}
