import { describe, expect, it } from "vitest";
import { buildIssuedQuotationFormData } from "./issuedQuotationPayload";

function createBaseParams(uom: string) {
  return {
    template: {
      id: "123",
      name: "Standard Export Template",
      custom_fields: [
        {
          id: "client_name",
          label: "Client Name",
          type: "text" as const,
        },
      ],
      billing_sections: [
        {
          id: "main-section",
          title: "Main Charges",
          available_charges: ["Freight"],
        },
      ],
    },
    quotationDetails: {
      subject: "Quotation Subject",
      message: "Quotation Message",
      rate_validity: "2030-01-01",
      custom_fields: {
        client_name: "Acme Corp",
      },
    },
    billingDetails: {
      currency: "PHP",
      sections: {
        "main-section": [
          {
            description: "Freight",
            currency: "PHP",
            uom,
            amount: 1500,
            quantity: 3,
            container_size: "1x20",
          },
        ],
      },
    },
    terms: {
      template_id: "123",
      template_name: "Standard Export Template",
      policies: "Policies",
      terms_and_condition: "Terms",
      banking_details: "Banking Details",
      footer: "Footer",
    },
    signatory: {
      complementary_close: "Respectfully yours",
      is_authorized_signatory: true,
      authorized_signatory_name: "Jane Doe",
      position_title: "Account Specialist",
      signature_file: null,
    },
    issuedQuotationFile: new File(["pdf"], "proposal.pdf", {
      type: "application/pdf",
    }),
  };
}

describe("buildIssuedQuotationFormData", () => {
  it("includes quantity and container size when the UOM is per container", () => {
    const formData = buildIssuedQuotationFormData(
      createBaseParams("Per Container"),
    );

    expect(formData.get("currency")?.toString()).toBe("PHP");
    expect(formData.get("charges[0][items][0][uom]")?.toString()).toBe(
      "Per Container",
    );
    expect(formData.get("charges[0][items][0][quantity]")?.toString()).toBe(
      "3",
    );
    expect(
      formData.get("charges[0][items][0][container_size]")?.toString(),
    ).toBe("1x20");
  });

  it("omits container-specific fields for non per-container UOMs", () => {
    const formData = buildIssuedQuotationFormData(createBaseParams("Per BL"));

    expect(formData.get("currency")?.toString()).toBe("PHP");
    expect(formData.get("charges[0][items][0][uom]")?.toString()).toBe(
      "Per BL",
    );
    expect(formData.has("charges[0][items][0][quantity]")).toBe(false);
    expect(formData.has("charges[0][items][0][container_size]")).toBe(false);
  });
});
