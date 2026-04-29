import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfThumbnailProps {
  fileUrl: string;
}

export function PdfThumbnail({ fileUrl }: PdfThumbnailProps) {
  return (
    <div style={{ width: 60, height: 80, overflow: "hidden" }}>
      <Document file={fileUrl}>
        <Page pageNumber={1} height={60} />
      </Document>
    </div>
  );
}
