import { AppTable, type AppTableAction, type AppTableColumn } from "@/components/AppTable";
import { stripedRowProps } from "@/components/stripedRow";
import { useEffect } from "react";

interface BillingInvoiceRow {
  invoiceNumber: string;
  date: string;
  amount: string;
  status: string;
}

const billingColumns: AppTableColumn<BillingInvoiceRow>[] = [
  { key: "invoiceNumber", label: "INVOICE NO." },
  { key: "date", label: "DATE" },
  { key: "amount", label: "AMOUNT" },
  { key: "status", label: "STATUS" },
];

const billingData: BillingInvoiceRow[] = [
  { invoiceNumber: "INV-001", date: "2026-05-17", amount: "$1200", status: "Paid" },
];

const billingActions: AppTableAction<BillingInvoiceRow>[] = [
  {
    label: "View Billing & Invoices",
    onClick: (row) => console.log("View Billing & Invoices", row),
  },
  {
    label: "View Documents",
    onClick: (row) => console.log("View Documents", row),
  },
];

export function SubBillingInvoiceTable({
  page,
  perPage,
  onPageChange,
  onPerPageChange,
}: {
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}) {
  const total = billingData.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  useEffect(() => {
    if (page > totalPages) {
      onPageChange(totalPages);
    }
  }, [page, totalPages, onPageChange]);

  const visibleInvoices = billingData.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <AppTable<BillingInvoiceRow>
        columns={billingColumns}
        data={visibleInvoices}
        rowKey={(row) => row.invoiceNumber}
        getRowProps={(row, idx) => stripedRowProps(idx)}
        actions={billingActions}
        withEntryControls
        entryControlPosition="top"
        showSearchInTopBar={false}
        entryOptions={["10", "20", "30"]}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        total={total}
        showingCount={visibleInvoices.length}
      />
    </>
  );
}
