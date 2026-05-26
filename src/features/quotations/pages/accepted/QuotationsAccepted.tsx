import { AcceptedQuotations } from "@/features/quotations/pages/accepted/components/AcceptedQuotations";

export function QuotationsAccepted() {
  return (
    <AcceptedQuotations.Provider>
      <AcceptedQuotations.Page>
        <AcceptedQuotations.Layout>
          <AcceptedQuotations.ClientTabs />
          <AcceptedQuotations.Panel>
            <AcceptedQuotations.Filters />
            <AcceptedQuotations.Tables />
          </AcceptedQuotations.Panel>
        </AcceptedQuotations.Layout>
      </AcceptedQuotations.Page>
    </AcceptedQuotations.Provider>
  );
}
