import { Group, Stack, Text } from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router";
import { DetailCard } from "@/components/DetailCard";
import { DetailGrid, type DetailRow } from "@/components/DetailGrid";
import { PageCard } from "@/components/PageCard";
import type { JobOrderResponse } from "@/features/job-order/types/jobOrder";
import { jobOrderRoutes } from "@/features/job-order/utils/jobOrderRoutes";

type JobOrderLocationState = {
  jobOrder?: JobOrderResponse;
};

function fallback(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "-";
  const text = String(value).trim();
  return text.length > 0 ? text : "-";
}

export function JobOrderDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as JobOrderLocationState | null;
  const jobOrder = state?.jobOrder;

  console.log("khate", jobOrder)

  if (!jobOrder) {
    return (
      <PageCard title="Job Order Details" bgColor="transparent" subtitle="JOB ORDER">
        <Text size="sm" c="dimmed">
          No job order detail data is available. Please open this page from the
          job order table.
        </Text>
      </PageCard>
    );
  }

  const requestRows: DetailRow[] = [
    { label: "Reference", value: fallback(jobOrder.reference_number) },
    { label: "Date Created", value: fallback(jobOrder.date_created) },
    { label: "Client", value: fallback(jobOrder.client) },
    { label: "Assignment Status", value: fallback(jobOrder.assignment_status) },
  ];

  const serviceRows: DetailRow[] = [
    { label: "Job Type", value: fallback(jobOrder.job_type) },
    { label: "Service Type", value: fallback(jobOrder.service_type) },
    { label: "Service Level", value: fallback(jobOrder.service_level) },
    { label: "Transport Mode", value: fallback(jobOrder.transport_mode) },
    { label: "Commodity", value: fallback(jobOrder.commodity) },
    { label: "Origin", value: fallback(jobOrder.origin) },
    { label: "Destination", value: fallback(jobOrder.destination) },
    { label: "BL No.", value: fallback(jobOrder.bl_no) },
  ];

  const assignmentRows: DetailRow[] = [
    { label: "Assigned To", value: fallback(jobOrder.assigned_to) },
    { label: "Assigned At", value: fallback(jobOrder.assigned_at) },
    {
      label: "Quotation Ref",
      value: fallback(jobOrder.quotation_reference_number),
    },
  ];

  return (
    <PageCard
      title="Client Details"
      subtitle="JOB ORDER"
      bgColor="transparent"
      action={
          <Text
            component="button"
            type="button"
            onClick={() => navigate(jobOrderRoutes.list())}
            style={{
              border: 0,
              background: "transparent",
              color: "#1D4ED8",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Back to Job Orders
          </Text>
      }
    >
      <Stack gap="lg">
        <Group grow align="flex-start">
          <DetailCard icon={<Text fw={700}>JO</Text>} title="Request Details">
            <DetailGrid rows={requestRows} />
          </DetailCard>

          <DetailCard icon={<Text fw={700}>AS</Text>} title="Assignment">
            <DetailGrid rows={assignmentRows} />
          </DetailCard>
        </Group>

        <DetailCard icon={<Text fw={700}>SV</Text>} title="Service Details">
          <DetailGrid rows={serviceRows} />
        </DetailCard>
      </Stack>
    </PageCard>
  );
}