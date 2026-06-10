import { describe, expect, it } from "vitest";
import type {
  BillingDetailsValues,
  TermsValues,
} from "../../src/features/quotations/schemas/compose.schema";
import type {
  QuotationTemplate,
  ViewerSignatoryValues,
} from "../../src/features/quotations/types/compose.types";
import type { QuotationResource } from "../../src/features/quotations/types/quotations.types";
import { buildQuotationDocumentViewModel } from "../../src/features/quotations/utils/quotationDocumentViewModel";

const quotation: QuotationResource = {
  id: "q-1",
  reference_number: "REF-001",
  client: {
    full_name: "Jane Client",
    company_name: "Client Corp",
    contact_number: "+63 900 000 0000",
    email: "jane@example.com",
  },
  account_specialist: null,
  status: "RESPONDED",
  shipment_status: "PENDING",
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-01T00:00:00.000Z",
  company: {
    name: "JLT",
    address: "Manila",
    contact_person: "Agent",
    contact_number: "+63 2 0000 0000",
    email: "sales@jltcb.com",
  },
  service: null,
  commodity: null,
  shipment: null,
  regulatory_service: null,
  quotation_file: "No file available.",
  documents: "No documents available.",
  remarks: null,
  conversation_id: "conv-1",
  person_in_charge: null,
  qtn_created_at: null,
  qtn_accepted_at: null,
  qtn_status: null,
};

const template: QuotationTemplate = {
  id: "template-1",
  name: "Template 1",
  client_information_fields: [{ id: "incoterm", label: "Incoterm" }],
  custom_fields: [],
  billing_sections: [
    {
      id: "section-a",
      title: "Section A",
      available_charges: ["Charge A"],
    },
    {
      id: "section-b",
      title: "Section B",
      available_charges: ["Charge B"],
    },
  ],
};

const billingDetails: BillingDetailsValues = {
  sections: {
    "section-a": [
      {
        description: "Customs Fee",
        currency: "PHP",
        uom: "Per Container",
        amount: 100,
        quantity: 2,
      },
      {
        description: "",
        currency: "",
        uom: "",
        amount: null,
      },
    ],
    "section-b": [
      {
        description: "Warehouse",
        currency: "PHP",
        uom: "Per day",
        amount: 250,
      },
    ],
  },
};

const terms: TermsValues = {
  template_id: "template-1",
  template_name: "Standard",
  policies: "Policy text",
  terms_and_condition: "   ",
  banking_details: "Bank details",
  footer: "Footer text",
};

const signatory: ViewerSignatoryValues = {
  complementary_close: "Sincerely",
  is_authorized_signatory: true,
  authorized_signatory_name: "Alex Signatory",
  position_title: "Operations Manager",
  signature_file: null,
  signature_file_url: "https://cdn.example.com/signature.png",
};

describe("quotation document view-model", () => {
  it("derives billing sections and grand total from meaningful rows", () => {
    const model = buildQuotationDocumentViewModel({
      quotation,
      template,
      clientInformationFields: [{ label: "Incoterm", value: "FOB" }],
      billingDetails,
      terms,
      signatory,
    });

    expect(model.billingSections).toHaveLength(2);
    expect(model.billingSections[0]?.id).toBe("section-a");
    expect(model.billingSections[0]?.rows).toHaveLength(1);
    expect(model.billingSections[0]?.uom).toBe("Per Container");
    expect(model.billingSections[0]?.total).toBe(200);
    expect(model.billingSections[1]?.id).toBe("section-b");
    expect(model.billingSections[1]?.total).toBe(250);
    expect(model.grandTotal).toBe(450);
  });

  it("orders terms blocks predictably and omits empty blocks", () => {
    const model = buildQuotationDocumentViewModel({
      quotation,
      template,
      clientInformationFields: [{ label: "Incoterm", value: "FOB" }],
      billingDetails,
      terms,
      signatory,
    });

    expect(model.termsBlocks.map((block) => block.key)).toEqual([
      "policies",
      "banking_details",
    ]);
    expect(model.termsBlocks.map((block) => block.label)).toEqual([
      "Policies",
      "Banking Details",
    ]);
    expect(model.footer).toBe("Footer text");
  });

  it("provides stable signatory display fields for both renderers", () => {
    const model = buildQuotationDocumentViewModel({
      quotation,
      template,
      clientInformationFields: [{ label: "Incoterm", value: "FOB" }],
      billingDetails,
      terms,
      signatory,
    });

    expect(model.signatory.complementaryClose).toBe("Sincerely");
    expect(model.signatory.authorizedSignatoryName).toBe("Alex Signatory");
    expect(model.signatory.positionTitle).toBe("Operations Manager");
    expect(model.signatory.companyName).toBe(
      "Jill L. Tolentino Customs Brokerage",
    );
    expect(model.signatory.clientName).toBe("Jane Client");
    expect(model.signatory.signatureFileUrl).toBe(
      "https://cdn.example.com/signature.png",
    );
  });
});
