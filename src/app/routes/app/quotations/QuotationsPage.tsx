import { Navigate, useMatch, useParams, useSearchParams } from "react-router";
import { QuotationsRequested } from "@/features/quotations/pages/requested/QuotationsRequested";
import { QuotationsClient } from "@/features/quotations/pages/requested/QuotationsClient";
import { QuotationDetailsPage } from "@/features/quotations/pages/shared/QuotationDetailsPage";
import { QuotationDocuments } from "@/features/quotations/pages/shared/QuotationDocuments";
import { TemplateSelection } from "@/features/quotations/pages/compose/TemplateSelection";
import { ComposeQuotationPage } from "@/features/quotations/pages/compose/ComposeQuotationPage";
import { QuotationsResponded } from "@/features/quotations/pages/responded/QuotationsResponded";
import { QuotationsAccepted } from "@/features/quotations/pages/accepted/QuotationsAccepted";
import AcceptedForm from "@/features/quotations/pages/accepted/AcceptedForm";

export default function QuotationsPage() {
  const { tab, clientId, quotationId, template } = useParams();
  const documentsNestedMatch = useMatch(
    "/quotations/:tab/client/:clientId/:quotationId/documents",
  );
  const documentsFlatMatch = useMatch(
    "/quotations/:tab/:quotationId/documents",
  );
  const jobOrderNestedMatch = useMatch(
    "/quotations/:tab/client/:clientId/:quotationId/job-order",
  );
  const jobOrderFlatMatch = useMatch(
    "/quotations/:tab/:quotationId/job-order",
  );
  const composeRootMatch = useMatch(
    "/quotations/:tab/client/:clientId/:quotationId/compose",
  );
  const composeFlatRootMatch = useMatch(
    "/quotations/:tab/:quotationId/compose",
  );
  const [searchParams] = useSearchParams();

  if (quotationId && (documentsNestedMatch || documentsFlatMatch)) {
    return <QuotationDocuments />;
  }
  if (quotationId && (jobOrderNestedMatch || jobOrderFlatMatch)) {
    return (
      <AcceptedForm
        quotation_reference_number={
          searchParams.get("ref") ?? quotationId
        }
        job_type={searchParams.get("job_type") ?? "LOGISTICS"}
      />
    );
  }
  if (quotationId && template) return <ComposeQuotationPage />;
  if (quotationId && (composeRootMatch || composeFlatRootMatch)) {
    return <TemplateSelection />;
  }
  if (quotationId) return <QuotationDetailsPage />;
  if (clientId) return <QuotationsClient />;

  switch (tab) {
    case "requested":
      return <QuotationsRequested />;
    case "responded":
      return <QuotationsResponded />;
    case "accepted":
      return <QuotationsAccepted />;
    case "discarded":
      return <h1>Discarded</h1>;
    default:
      return <Navigate to="requested" replace />;
  }
}
