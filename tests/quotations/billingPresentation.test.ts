import { describe, expect, it } from "vitest";
import {
  formatQuotationAmount,
  getBillingPresentationRows,
} from "../../src/features/quotations/utils/billingPresentation";

describe("billing presentation utils", () => {
  it("formats numbers consistently for preview and PDF", () => {
    expect(formatQuotationAmount(1234.5)).toBe("1,234.50");
    expect(formatQuotationAmount(0)).toBe("0.00");
    expect(formatQuotationAmount(null)).toBe("-");
  });

  it("normalizes row cells and mirrors amount/total text", () => {
    const rows = getBillingPresentationRows(
      [
        {
          description: "  Brokerage ",
          currency: "PHP",
          uom: "Per BL",
          amount: 2500,
        },
        { description: "", currency: "", uom: "", amount: null },
      ],
      formatQuotationAmount,
    );

    expect(rows).toEqual([
      {
        description: "Brokerage",
        currency: "PHP",
        uom: "Per BL",
        amountText: "2,500.00",
        totalText: "2,500.00",
      },
      {
        description: "-",
        currency: "-",
        uom: "-",
        amountText: "-",
        totalText: "-",
      },
    ]);
  });
});
