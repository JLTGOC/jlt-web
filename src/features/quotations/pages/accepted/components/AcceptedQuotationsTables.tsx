import { useAcceptedQuotationsContext } from "./AcceptedQuotationsContext";
import { AcceptedQuotationsAllTable } from "./AcceptedQuotationsTableAll";
import { AcceptedQuotationsMyJobsTable } from "./AcceptedQuotationsTableMyJobs";

export function AcceptedQuotationsTables() {
  const { state } = useAcceptedQuotationsContext();
  if (state.jobScope === "my-items") {
    return <AcceptedQuotationsMyJobsTable />;
  }
  return <AcceptedQuotationsAllTable />;
}
