import { createElement } from "react";
import type { QuotationViewerState } from "@/features/quotations/types/compose.types";
import { toClientFileUrl } from "@/utils/file-url";
import { GET } from "@/lib/api/client";

/**
 * Fetches a signature file from the backend with proper JWT authentication
 * and converts it to a base64 data URL for use in react-pdf
 */
async function fetchSignatureAsBase64(
  signatureFileUrl: string,
): Promise<string | null> {
  if (!signatureFileUrl) return null;

  try {
    const fullUrl = toClientFileUrl(signatureFileUrl);
    const blob = await GET<Blob>(fullUrl, { responseType: "blob" });

    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = () => {
        console.warn(
          "Failed to convert signature blob to base64. Signature will not appear in PDF.",
        );
        resolve(null);
      };
      reader.readAsDataURL(blob);
    });
  } catch {
    console.warn(
      `Failed to fetch signature from ${signatureFileUrl}. Signature will not appear in PDF.`,
    );
    return null;
  }
}

export function usePDFActions(
  state: QuotationViewerState | null,
  logoSrc: string,
) {
  if (!state) {
    return {
      handleDownload: async () => undefined,
      handlePrint: async () => undefined,
    };
  }

  const viewerState = state;

  const props = {
    quotation: viewerState.quotation,
    template: viewerState.template,
    clientInformationFields: viewerState.clientInformationFields,
    quotationDetails: viewerState.quotationDetails,
    billingDetails: viewerState.billingDetails,
    terms: viewerState.terms,
    signatory: viewerState.signatory,
    logoSrc,
  };

  async function generateBlob(): Promise<Blob> {
    const [{ pdf }, { QuotationPDF }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@/features/quotations/pdf/QuotationPDF"),
    ]);

    const hasSignatureFile = Boolean(viewerState.signatory.signature_file);
    const signatureFileUrl = viewerState.signatory.signature_file_url;

    // If during compose (has actual File object), use object URL
    // Otherwise, fetch from backend with JWT auth and convert to base64
    const signatorySignatureSrc = hasSignatureFile
      ? URL.createObjectURL(viewerState.signatory.signature_file as File)
      : signatureFileUrl
        ? await fetchSignatureAsBase64(signatureFileUrl)
        : null;

    try {
      const doc = createElement(QuotationPDF, {
        ...props,
        signatorySignatureSrc,
      });
      return await pdf(doc as never).toBlob();
    } finally {
      if (hasSignatureFile && signatorySignatureSrc) {
        URL.revokeObjectURL(signatorySignatureSrc);
      }
    }
  }

  async function handleDownload() {
    const blob = await generateBlob();
    const pdfBlob =
      blob.type === "application/pdf"
        ? blob
        : new Blob([blob], { type: "application/pdf" });
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${viewerState.quotation.reference_number ?? "quotation"}.pdf`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 2000);
  }

  async function handlePrint() {
    const blob = await generateBlob();
    const pdfBlob =
      blob.type === "application/pdf"
        ? blob
        : new Blob([blob], { type: "application/pdf" });
    const url = URL.createObjectURL(pdfBlob);

    // Open PDF in a new window and trigger print
    const printWindow = window.open(url);
    if (printWindow) {
      // Wait for the PDF to load, then print
      const onLoad = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.removeEventListener("load", onLoad);
        setTimeout(() => {
          URL.revokeObjectURL(url);
          printWindow.close();
        }, 1000);
      };
      printWindow.addEventListener("load", onLoad);
    } else {
      // Fallback: open PDF and let user print manually
      window.open(url);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
  }

  return { handleDownload, handlePrint };
}
