interface AcceptedQuotationViewerPathParams {
  quotationId?: string | number | null;
  issuedQuotationId?: string | number | null;
}

export function buildAcceptedQuotationViewerPath({
  quotationId,
  issuedQuotationId,
}: AcceptedQuotationViewerPathParams) {
  if (quotationId === undefined || quotationId === null) {
    return null;
  }

  const basePath = `/quotations/accepted/${String(quotationId)}/view`;

  if (issuedQuotationId === undefined || issuedQuotationId === null) {
    return basePath;
  }

  return `${basePath}/${String(issuedQuotationId)}`;
}
