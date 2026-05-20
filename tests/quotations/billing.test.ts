import { describe, expect, it } from "vitest";
import {
  getBillingGrandTotal,
  getBillingSectionsWithCharges,
  getRowsTotal,
  hasAnyCharge,
  hasChargeContent,
} from "../../src/features/quotations/utils/billing";
import type { BillingDetailsValues } from "../../src/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "../../src/features/quotations/types/compose.types";

const template: QuotationTemplate = {
  id: "template-1",
  name: "Template 1",
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

describe("billing utils", () => {
  it("detects meaningful charge content", () => {
    expect(hasChargeContent({ description: "", currency: "", uom: "" })).toBe(
      false,
    );
    expect(hasChargeContent({ description: "Customs fee" })).toBe(true);
    expect(hasChargeContent({ amount: 0 })).toBe(true);
  });

  it("requires at least one meaningful charge across sections", () => {
    const emptySections: BillingDetailsValues["sections"] = {
      "section-a": [{ description: "", currency: "", uom: "", amount: null }],
    };
    const withCharge: BillingDetailsValues["sections"] = {
      "section-a": [
        { description: "Fee", currency: "PHP", uom: "Per BL", amount: 0 },
      ],
    };

    expect(hasAnyCharge(emptySections)).toBe(false);
    expect(hasAnyCharge(withCharge)).toBe(true);
  });

  it("filters out empty rows and empty sections for output", () => {
    const billingDetails: BillingDetailsValues = {
      sections: {
        "section-a": [
          { description: "", currency: "", uom: "", amount: null },
          {
            description: "Charge A",
            currency: "PHP",
            uom: "Per BL",
            amount: 1200,
          },
        ],
        "section-b": [{ description: "", currency: "", uom: "", amount: null }],
      },
    };

    const outputSections = getBillingSectionsWithCharges(
      template,
      billingDetails,
    );

    expect(outputSections).toHaveLength(1);
    expect(outputSections[0]?.section.id).toBe("section-a");
    expect(outputSections[0]?.rows).toHaveLength(1);
    expect(outputSections[0]?.rows[0]?.description).toBe("Charge A");
  });

  it("computes row and grand totals", () => {
    const sections = [
      {
        section: template.billing_sections[0],
        rows: [
          { description: "A", amount: 1000 },
          { description: "B", amount: 500 },
        ],
      },
      {
        section: template.billing_sections[1],
        rows: [{ description: "C", amount: 250 }],
      },
    ];

    expect(getRowsTotal(sections[0].rows)).toBe(1500);
    expect(getBillingGrandTotal(sections)).toBe(1750);
  });
});
