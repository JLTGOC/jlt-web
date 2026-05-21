import { AppTable, type AppTableAction, type AppTableColumn } from "@/components/AppTable";
import { Folder, License } from "@nine-thirty-five/material-symbols-react/outlined";
import { stripedRowProps } from "@/components/stripedRow";
import { useEffect } from "react";
import type { ClientRegulatory } from "@/features/accounts/types/accounts.types";

function formatDateShort(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const monthName = d.toLocaleString("en-US", { month: "long" });
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${monthName} ${dd}, ${yyyy}`;
}

const regulatoryColumns: AppTableColumn<ClientRegulatory>[] = [
  { key: "regulatoryNumber", label: "REGULATORY NO." },
  { key: "applicationType", label: "APPLICATION TYPE" },
  { key: "typeOfApplication", label: "TYPE OF APPLICATION" },
  { key: "issueDate", label: "ISSUE DATE", render: (row) => formatDateShort(row.issueDate) },
  { key: "expiryDate", label: "EXPIRY DATE", render: (row) => formatDateShort(row.expiryDate) },
  { key: "personInCharge", label: "PERSON IN CHARGE" },
  { key: "status", label: "STATUS" },
];

const regulatoryActions: AppTableAction<ClientRegulatory>[] = [
  {
    label: "View Regulatory",
    icon: <License width={18} height={18} style={{ color: "#1D274E" }} />,
    onClick: (row) => console.log("View Regulatory", row),
  },
  {
    label: "View Documents",
    icon: <Folder width={18} height={18} style={{ color: "#1D274E" }} />,
    onClick: (row) => console.log("View Documents", row),
  },
];

interface SubRegulatoryTableProps {
  regulatory: ClientRegulatory[];
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function SubRegulatoryTable({
  regulatory,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
}: SubRegulatoryTableProps) {
  const total = regulatory.length;
  const isShowAll = perPage === 0;
  const totalPages = isShowAll ? 1 : Math.max(1, Math.ceil(total / perPage));

  useEffect(() => {
    if (page > totalPages) {
      onPageChange(totalPages);
    }
  }, [page, totalPages, onPageChange]);

  const visibleRegulatory = isShowAll ? regulatory : regulatory.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <AppTable<ClientRegulatory>
        columns={regulatoryColumns}
        data={visibleRegulatory}
        rowKey={(row) => row.regulatoryNumber}
        getRowProps={(row, idx) => stripedRowProps(idx)}
        actions={regulatoryActions}
        withEntryControls
        entryControlPosition="top"
        showSearchInTopBar={false}
        entryOptions={["10", "20", "30", "All"]}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        total={total}
        showingCount={visibleRegulatory.length}
      />
    </>
  );
}
