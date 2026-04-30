import type { JobOrderClientType } from "../types/jobOrder";

const CLIENT_TYPE_COLOR: Record<JobOrderClientType, string> = {
  new: "teal",
  old: "blue",
};

export function getJobOrderRowStyle(
  clientType: JobOrderClientType,
): React.CSSProperties {
  return {
    boxShadow: `inset 0.5rem 0 0 0 var(--mantine-color-${CLIENT_TYPE_COLOR[clientType]}-6)`,
  };
}
