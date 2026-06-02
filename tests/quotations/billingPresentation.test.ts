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
        {
          description: "",
          currency: "",
          uom: "Per Container",
          amount: 2500,
          quantity: 3,
          container_size: "1x20",
        },
      ],
      "PHP",
      formatQuotationAmount,
    );

    expect(rows).toEqual([
      {
        description: "Brokerage",
        currency: "PHP",
        uom: "Per BL",
        quantity: "-",
        containerSize: "-",
        amountText: "2,500.00",
        totalText: "PHP 2,500.00",
        calculationText: null,
      },
      {
        description: "-",
        currency: "PHP",
        uom: "Per Container",
        quantity: "3",
        containerSize: "1x20",
        amountText: "2,500.00",
        totalText: "PHP 7,500.00",
        calculationText: "3 x 2,500.00 = PHP 7,500.00",
      },
    ]);
  });

  it("formats per-container rows with quantity-based calculations", () => {
    const rows = getBillingPresentationRows(
      [
        {
          description: "Freight",
          currency: "PHP",
          uom: "Per Container",
          amount: 500,
          quantity: 3,
          container_size: "1x20",
        },
      ],
      "PHP",
      formatQuotationAmount,
    );

    expect(rows[0]).toMatchObject({
      quantity: "3",
      containerSize: "1x20",
      totalText: "PHP 1,500.00",
      calculationText: "3 x 500.00 = PHP 1,500.00",
    });
  });
});
