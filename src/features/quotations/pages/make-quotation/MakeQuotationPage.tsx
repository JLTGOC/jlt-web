import { MakeQuotationContent } from "./components/MakeQuotationContent";
import { MakeQuotationProvider } from "./MakeQuotationProvider";

export function MakeQuotationPage() {
  return (
    <MakeQuotationProvider>
      <MakeQuotationPageContent />
    </MakeQuotationProvider>
  );
}

function MakeQuotationPageContent() {
  return <MakeQuotationContent />;
}
