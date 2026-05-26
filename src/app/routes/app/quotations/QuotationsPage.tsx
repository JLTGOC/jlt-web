import { Navigate, useMatch, useParams } from "react-router";
import { QuotationsRequested } from "@/features/quotations/pages/requested/QuotationsRequested";
import { QuotationsClient } from "@/features/quotations/pages/requested/QuotationsClient";
import { QuotationDetailsPage } from "@/features/quotations/pages/shared/QuotationDetailsPage";
import { QuotationDocuments } from "@/features/quotations/pages/shared/QuotationDocuments";
import { TemplateSelection } from "@/features/quotations/pages/compose/TemplateSelection";
import { ComposeQuotationPage } from "@/features/quotations/pages/compose/ComposeQuotationPage";
import { QuotationsResponded } from "@/features/quotations/pages/responded/QuotationsResponded";
import AcceptedForm  from "@/features/quotations/pages/accepted/AcceptedForm";

export default function QuotationsPage() {
  const { tab, clientId, quotationId, template } = useParams();
  const documentsNestedMatch = useMatch(
    "/quotations/:tab/client/:clientId/:quotationId/documents",
  );
  const documentsFlatMatch = useMatch(
    "/quotations/:tab/:quotationId/documents",
  );
  const composeRootMatch = useMatch(
    "/quotations/:tab/client/:clientId/:quotationId/compose",
  );
  const composeFlatRootMatch = useMatch(
    "/quotations/:tab/:quotationId/compose",
  );

  if (quotationId && (documentsNestedMatch || documentsFlatMatch)) {
    return <QuotationDocuments />;
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
      return <AcceptedForm />;
    case "discarded":
      return <h1>Discarded</h1>;
    default:
      return <Navigate to="requested" replace />;
  }
}
