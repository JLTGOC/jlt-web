import { AppTable, type AppTableAction, type AppTableColumn } from "@/components/AppTable";
import { Folder, License } from "@nine-thirty-five/material-symbols-react/outlined";
import { stripedRowProps } from "@/components/stripedRow";
import { Avatar, Group, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import type { ClientRegulatory } from "@/features/accounts/types/accounts.types";
import styles from "../ClientTables.module.css";

function formatDateShort(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const monthName = d.toLocaleString("en-US", { month: "long" });
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${monthName} ${dd}, ${yyyy}`;
}

function formatRegulatoryStatus(value?: string) {
  if (!value) return "—";

  return value
    .toString()
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getRegulatoryBadgeStatus(status: string) {
  const normalized = status.toString().trim().toLowerCase();

  if (normalized === "for evaluation") return "For Evaluation";
  if (normalized === "approved") return "Approved";
  if (normalized === "under review") return "Under Review";
  if (normalized === "soon to expire") return "Soon To Expire";

  return status;
}

const regulatoryColumns: AppTableColumn<ClientRegulatory>[] = [
  {
    key: "regulatoryNumber",
    label: "REGULATORY NO.",
    render: (row) => (
      <Text size="xs" style={{ textDecoration: "underline", textDecorationColor: "currentColor" }}>
        {row.regulatoryNumber}
      </Text>
    ),
  },
  { key: "applicationType", label: "APPLICATION TYPE" },
  { key: "typeOfApplication", label: "TYPE OF APPLICATION" },
  { key: "issueDate", label: "ISSUE DATE", render: (row) => formatDateShort(row.issueDate) },
  { key: "expiryDate", label: "EXPIRY DATE", render: (row) => formatDateShort(row.expiryDate) },
  {
    key: "personInCharge",
    label: "PERSON IN CHARGE",
    render: (row) => (
      <Group align="center" gap="xs">
        <Avatar
          size="sm"
          radius="xl"
          src={row.pic_image_path ?? undefined}
          alt={row.personInCharge ?? "PIC"}
        >
          {row.personInCharge ? row.personInCharge.charAt(0).toUpperCase() : "?"}
        </Avatar>
        <Text>{row.personInCharge || "—"}</Text>
      </Group>
    ),
  },
  {
    key: "status",
    label: "STATUS",
    render: (row) => {
      const statusLabel = formatRegulatoryStatus(row.status);
      const badgeStatus = getRegulatoryBadgeStatus(statusLabel);

      return (
        <div className={`${styles.statusBadge} ${styles.statusBadgeSmall}`} data-status={badgeStatus}>
          <Text fw={400} c="currentColor" style={{ position: "relative", zIndex: 2 }}>
            {statusLabel}
          </Text>
        </div>
      );
    },
  },
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
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();

  const filteredRegulatory = regulatory.filter((row) => {
    if (!normalizedSearch) return true;
    return row.regulatoryNumber?.toString().toLowerCase().includes(normalizedSearch);
  });

  const total = filteredRegulatory.length;
  const isShowAll = perPage === 0;
  const totalPages = isShowAll ? 1 : Math.max(1, Math.ceil(total / perPage));

  useEffect(() => {
    if (page > totalPages) {
      onPageChange(totalPages);
    }
  }, [page, totalPages, onPageChange]);

  const visibleRegulatory = isShowAll ? filteredRegulatory : filteredRegulatory.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <AppTable<ClientRegulatory>
        columns={regulatoryColumns}
        data={visibleRegulatory}
        rowKey={(row) => row.regulatoryNumber}
        getRowProps={(_, idx) => stripedRowProps(idx)}
        actions={regulatoryActions}
        withEntryControls
        entryControlPosition="top"
        searchPlaceholder="Search Regulatory No."
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={setSearch}
        entryOptions={["10", "20", "30"]}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        total={total}
        showingCount={visibleRegulatory.length}
      />
    </>
  );
}
