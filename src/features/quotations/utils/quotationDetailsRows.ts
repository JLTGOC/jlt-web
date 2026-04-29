import type { DetailRow } from "@/components/DetailGrid";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";

interface DocumentRow {
  name: string;
  previewUrl?: string;
  uploadedDate?: string; // formatted like "April 20, 2026"
  uploadedBy?: string;   // formatted like "Finance 1"
}

interface QuotationDetailsRows {
  consignee: DetailRow[];
  shipment: DetailRow[];
  documentsJLTCB: DocumentRow[];
  documentsClient: DocumentRow[];
  history: DetailRow[];
}

function withFallback(value: string | null | undefined) {
  return value && value.trim() ? value : "-";
}

function getVolumeDimension(quotation: QuotationResource) {
  return [quotation.commodity?.cargo_type, quotation.commodity?.container_size]
    .filter(Boolean)
    .join(" ");
}

export function buildQuotationDetailsRows(
  quotation: QuotationResource,
): QuotationDetailsRows {
  const volumeDimension = getVolumeDimension(quotation);

  return {
    consignee: [
      { label: "Company Name", value: withFallback(quotation.company.name) },
      { label: "Company Address", value: withFallback(quotation.company.address) },
      { label: "Contact Person", value: withFallback(quotation.company.contact_person) },
      { label: "Contact Number", value: withFallback(quotation.company.contact_number) },
      { label: "Email Address", value: withFallback(quotation.company.email) },
    ],
    shipment: [
      { label: "Service Type", value: withFallback(quotation.service?.type) },
      { label: "Freight Transport Mode", value: withFallback(quotation.service?.transport_mode) },
      { label: "Service", value: withFallback(quotation.service?.options?.join(", ")) },
      { label: "Commodity", value: withFallback(quotation.commodity?.commodity) },
      { label: "Volume (Dimension)", value: withFallback(volumeDimension) },
      { label: "Origin", value: withFallback(quotation.shipment?.origin) },
      { label: "Destination", value: withFallback(quotation.shipment?.destination) },
      ...(quotation.remarks ? [{ label: "Details", value: withFallback(quotation.remarks) }] : []),
    ],

    // ✅ Mock data with preview, date, and uploader
    documentsJLTCB: [
      {
        name: "Invoice.pdf",
        previewUrl: "/mock-previews/invoice.png",
        uploadedDate: "April 20, 2026",
        uploadedBy: "Finance 1",
      },
      {
        name: "PackingList.pdf",
        previewUrl: "/mock-previews/packinglist.png",
        uploadedDate: "April 21, 2026",
        uploadedBy: "Operations",
      },
    ],
    documentsClient: [
      {
        name: "PurchaseOrder.pdf",
        previewUrl: "/mock-previews/purchaseorder.png",
        uploadedDate: "April 22, 2026",
        uploadedBy: "Client Admin",
      },
      {
        name: "ClientID.pdf",
        previewUrl: "/mock-previews/clientid.png",
        uploadedDate: "April 23, 2026",
        uploadedBy: "Client HR",
      },
    ],

    history: [
      { label: "2026-04-20 10:00", value: "Requested by John Doe" },
      { label: "2026-04-21 14:30", value: "Assigned to Jane Smith" },
      { label: "2026-04-22 09:00", value: "Accepted by Alice Johnson" },
    ],
  };
}
