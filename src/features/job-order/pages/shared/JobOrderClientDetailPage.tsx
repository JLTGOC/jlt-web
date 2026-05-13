import { Center, Loader, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router";
import type { JobOrderServiceType } from "../../types/jobOrder";
import { fetchJobOrderDetail } from "../../api/jobOrderQueries.api";
import { jobOrdersQueryKeys } from "../../api/jobOrdersQueryKeys";
import { JobOrderDetailHeader } from "../../components/JobOrderDetailHeader";
import JobOrderClientDetailSections from "../../components/JobOrderClientDetailSections";

export default function JobOrderClientDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ jobOrderId?: string }>();
  const [searchParams] = useSearchParams();
  const jobOrderId = params.jobOrderId;
  const serviceType = searchParams.get("service") as JobOrderServiceType | null;


  console.log(params.jobOrderId)
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

  console.log(detail)

  if (!jobOrderId) return null;

  if (isLoading) {
    return (
      <Center py="xl">
        <Stack gap="xs" align="center">
          <Loader size="sm" />
          <Text size="sm" c="dimmed">
            Loading job order details...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!detail) return null;

  const serviceTypeFromDetail =
    detail.service?.service_type ??
    detail.service?.type ??
    detail.job_type ??
    detail.service_type ??
    null;
  const isRegulatory =
    serviceType === "Regulatory" ||
    serviceTypeFromDetail === "Regulatory" ||
    serviceTypeFromDetail === "REGULATORY";

  return (
    <Stack gap="lg" p="lg">
      <JobOrderDetailHeader
        referenceNumber={"Client Details"}
        quotationReference={null}
        quotationId={detail.quotation_id}
        onBack={() => navigate(-1)}
      />

      <JobOrderClientDetailSections />
    </Stack>
  );
}
