import { Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router";
import type { JobOrderServiceType } from "../../types/jobOrder";
import { fetchJobOrderDetail } from "../../api/jobOrders.api";
import { jobOrdersQueryKeys } from "../../api/jobOrdersQueryKeys";
import { JobOrderDetailHeader } from "./components/JobOrderDetailHeader";
import { JobOrderDetailSections } from "./components/JobOrderDetailSections";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobOrderDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const jobOrderId = params.id;
  const serviceType = searchParams.get("service") as JobOrderServiceType | null;
  const isRegulatory = serviceType === "Regulatory";

  const { data: detail, isLoading } = useQuery({
    queryKey: jobOrdersQueryKeys.detail(jobOrderId),
    queryFn: () => {
      if (!jobOrderId) {
        throw new Error("Missing job order id.");
      }
      return fetchJobOrderDetail(jobOrderId);
    },
    enabled: Boolean(jobOrderId),
  });

  if (!jobOrderId || isLoading || !detail) return null;

  return (
    <Stack gap="lg" p="lg">
      <JobOrderDetailHeader
        referenceNumber={detail.reference_number}
        quotationReference={null}
        quotationId={detail.quotation_id}
        onBack={() => navigate(-1)}
      />

      <JobOrderDetailSections detail={detail} isRegulatory={isRegulatory} />
    </Stack>
  );
}
