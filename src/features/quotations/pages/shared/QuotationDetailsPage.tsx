import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack, Group, Text, Image, Button } from "@mantine/core";
import { PageCard } from "@/components/PageCard";
import { fetchQuotation } from "@/features/quotations/api/quotations.api";
import { QuotationDetailsSections } from "@/features/quotations/components/QuotationDetailsSections";
import { useQuotationRouteParams } from "@/features/quotations/hooks/useQuotationRouteParams";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import { ReferenceHeader } from "@/features/quotations/components/ReferenceHeader";
import { ReferenceHeaderSecondary } from "@/features/quotations/components/ReferenceHeaderSecondary";
import { getQtnStatus } from "@/features/quotations/utils/quotationStatus";
import { ContractEdit, Article, RequestQuote } from "@nine-thirty-five/material-symbols-react/outlined";

const UpdateQuotationIcon = () => <ContractEdit width={30} height={30} />;

const CreateJobOrderIcon = () => <Article width={30} height={30} />;

const MakeQuotationIcon = () => <RequestQuote width={30} height={30} />
;

export function QuotationDetailsPage() {
  const routeParams = useQuotationRouteParams(["tab", "quotationId"] as const);
  const params = useParams<{ clientId?: string }>();
  const clientId = params.clientId;
  const navigate = useNavigate();
  const quotationId = routeParams?.quotationId;

  const { data: quotation, isLoading } = useQuery({
    queryKey: quotationQueryKeys.quotationDetails(quotationId),
    queryFn: () => {
      if (!routeParams) {
        throw new Error("Missing required route parameters.");
      }
      return fetchQuotation(
        routeParams.quotationId,
        routeParams.tab as "requested" | "responded" | "accepted",
      );
    },
    enabled: Boolean(routeParams),
  });

  if (!routeParams) {
    return (
      <PageCard title="Client Details" bgColor="transparent">
        <Text size="0.8rem" c="dimmed">
          Invalid route parameters.
        </Text>
      </PageCard>
    );
  }

  if (isLoading || !quotation) return null;

  // Determine button label and icon based on quotation status (explicit checks only)
  const status = getQtnStatus(quotation);

  // Default to the existing "UPDATE QUOTATION" behavior when status is unknown
  let buttonLabel = "UPDATE QUOTATION";
  let ButtonIcon = UpdateQuotationIcon;

  if (status === "requested") {
    buttonLabel = "MAKE QUOTATION";
    ButtonIcon = MakeQuotationIcon;
  } else if (status === "responded") {
    buttonLabel = "UPDATE QUOTATION";
    ButtonIcon = UpdateQuotationIcon;
  } else if (status === "accepted") {
    buttonLabel = "CREATE JOB ORDER";
    ButtonIcon = CreateJobOrderIcon;
  }

  const isRequested = status === "requested";
  const isAccepted = status === "accepted";

  const canShowButton = quotation.account_specialist;

  return (
    <PageCard
      title="Client Details"
      bgColor="transparent"
      shadow={false}
      action={
        canShowButton ? (
          <Button
            size="md"
            bg="#4E6174"
            c="white"
            leftSection={<ButtonIcon />}
            onClick={() => {
              if (isAccepted) {
                navigate(
                  quotationRoutes.compose({
                    tab: "accepted",
                    clientId,
                    quotationId: routeParams.quotationId,
                  }),
                );
              } else {
                navigate(
                  quotationRoutes.compose({
                    tab: routeParams.tab,
                    clientId,
                    quotationId: routeParams.quotationId,
                  }),
                );
              }
            }}
          >
            {buttonLabel}
          </Button>
        ) : undefined
      }
    >
      {/**/}
      <Stack gap="lg">
        {/* Reference Headers Row */}
        <Group gap="lg" align="flex-start">
          {/* Left side - primary reference header */}
          <div style={{ flex: 1 }}>
            <ReferenceHeader quotation={quotation} />
          </div>

          {/* Right side - secondary reference header (only for responded and accepted) */}
          {!isRequested && (
            <div style={{ flex: 1, minWidth: 300 }}>
              <ReferenceHeaderSecondary quotation={quotation} />
            </div>
          )}
        </Group>

        {/* Full-width quotation details sections below headers */}
        <QuotationDetailsSections
          quotation={quotation}
          routeParams={routeParams}
          clientId={clientId}
        />
      </Stack>
    </PageCard>
  );
}
