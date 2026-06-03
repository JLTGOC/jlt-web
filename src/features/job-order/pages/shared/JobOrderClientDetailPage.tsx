import { Center, Loader, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { fetchJobOrderQuotation } from "../../api/jobOrder.api";
import { jobOrdersQueryKeys } from "../../api/jobOrdersQueryKeys";
import { JobOrderDetailHeader } from "../../components/JobOrderDetailHeader";
import JobOrderClientDetailSections from "../../components/JobOrderClientDetailSections";
import { mapQuotationToJobOrderDetail } from "../../utils/jobOrderQuotationMapper";

export default function JobOrderClientDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ jobOrderId?: string }>();
  const jobOrderId = params.jobOrderId;

  const { data: detail, isLoading } = useQuery({
    queryKey: jobOrdersQueryKeys.detail(jobOrderId),
    queryFn: () => {
      if (!jobOrderId) {
        throw new Error("Missing job order id.");
      }
      return fetchJobOrderQuotation(jobOrderId).then(
        mapQuotationToJobOrderDetail,
      );
    },
    enabled: Boolean(jobOrderId),
  });

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

  return (
    <Stack gap="lg" p="lg">
      <JobOrderDetailHeader
        referenceNumber={"Client Details"}
        quotationId={detail.quotation_id}
        onBack={() => navigate(-1)}
      />

      <JobOrderClientDetailSections detail={detail} />
    </Stack>
  );
}
