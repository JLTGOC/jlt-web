import { Anchor, Avatar, Group, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { AppTable, type AppTableAction, type AppTableColumn } from "@/components/AppTable";
import { Folder, InboxTextPerson } from "@nine-thirty-five/material-symbols-react/outlined";
import { stripedRowProps } from "@/components/stripedRow";
import type { ClientQuotation } from "@/features/accounts/types/accounts.types";
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

function formatStatusLabel(value?: string) {
  if (!value) return "Pending";
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStatusBadgeStyle(status: string) {
  const normalized = status.toString().trim().toUpperCase();

  if (normalized === "PENDING" || normalized === "REQUESTED" || normalized === "RESPONDED") {
    return "Discharged";
  }

  if (normalized === "ACCEPTED") {
    return "Delivered";
  }

  if (normalized === "DISCARDED" || normalized === "EXPIRED") {
    return "Not Yet Departed";
  }

  return "Discharged";
}

function getAlertLabel(row: ClientQuotation) {
  const rawStatus = row.status?.toString().trim().toUpperCase() ?? "";
  const validUntil = row.validUntil ? new Date(row.validUntil) : null;
  const now = Date.now();
  const isExpired = validUntil ? validUntil.getTime() < now : false;

  if (rawStatus === "DISCARDED") {
    return "Expired";
  }

  if (/VIEWED/.test(rawStatus) || /VIEWED/.test(row.alerts ?? "")) {
    return "Viewed";
  }

  // If the quotation was accepted, do not show alerts here
  if (rawStatus === "ACCEPTED") {
    return "-";
  }

  // If the quotation was responded to, show soon-to-expire if we have a valid expiry
  if (rawStatus === "RESPONDED") {
    if (validUntil && !isNaN(validUntil.getTime())) {
      const diffDays = Math.ceil((validUntil.getTime() - now) / 1000 / 60 / 60 / 24);
      if (diffDays <= 0) return "Expired";
      return `Soon to Expire (${diffDays} day${diffDays === 1 ? "" : "s"} left)`;
    }
    return "-";
  }

  // Generic soon-to-expire indicator when expiry is close
  if (validUntil && !isNaN(validUntil.getTime()) && !isExpired) {
    const diffDays = Math.ceil((validUntil.getTime() - now) / 1000 / 60 / 60 / 24);
    if (diffDays <= 7) {
      return `Soon to Expire (${diffDays} day${diffDays === 1 ? "" : "s"} left)`;
    }
  }

  if (isExpired) {
    return "Expired";
  }

  return row.alerts ?? "-";
}

const quotationColumns: AppTableColumn<ClientQuotation>[] = [
  {
    key: "quotationNumber",
    label: "REFERENCE NO.",
    width: "15%",
    render: (row) => (
      <Text size="xs" style={{ textDecoration: "underline", textDecorationColor: "currentColor", fontSize: "0.813rem" }}>
        {row.quotationNumber}
      </Text>
    ),
  },
  { key: "serviceType", label: "SERVICE TYPE", width: "15%" },
  { key: "dateQuoted", label: "DATE QUOTED", width: "15%", render: (row: ClientQuotation) => <Text size="xs">{formatDateShort(row.dateQuoted)}</Text> },
  {
    key: "quotedBy",
    label: "QUOTED BY",
    width: "20%",
    render: (row) => {
      const content = (
        <Group align="center">
          <Avatar src={row.quotedByAvatarUrl ?? undefined} radius="xl" size="sm">
            {row.quotedBy ? row.quotedBy.charAt(0).toUpperCase() : "?"}
          </Avatar>
          <Text>{row.quotedBy || "—"}</Text>
        </Group>
      );

      return row.quotedByUrl ? (
        <Anchor href={row.quotedByUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
          {content}
        </Anchor>
      ) : (
        content
      );
    },
  },
  { key: "validUntil", label: "VALID UNTIL", width: "13%", render: (row: ClientQuotation) => <Text size="xs">{formatDateShort(row.validUntil)}</Text> },

  {
    key: "status",
    label: "STATUS",
    width: "15%",
    render: (row) => {
      const statusLabel = formatStatusLabel(row.status);
      const badgeStatus = getStatusBadgeStyle(statusLabel);

      return (
        <div className={`${styles.statusBadge} ${styles.statusBadgeSmall}`} data-status={badgeStatus}>
          <Text fw={400} c="currentColor" style={{ position: "relative", zIndex: 2 }}>
            {statusLabel}
          </Text>
        </div>
      );
    },
  },
  {
    key: "alerts",
    label: "ALERTS",
    width: "14%",
    render: (row) => <Text>{getAlertLabel(row)}</Text>,
  },
];

const quotationActions: AppTableAction<ClientQuotation>[] = [
  {
    label: "View Job Order",
    icon: <InboxTextPerson width={18} height={18} style={{ color: "#1D274E" }} />,
    onClick: (row) => console.log("View Job Order", row),
  },
  {
    label: "View Documents",
    icon: <Folder width={18} height={18} style={{ color: "#1D274E" }} />,
    onClick: (row) => console.log("View Documents", row),
  },
];

interface SubQuotationTableProps {
  quotations: ClientQuotation[];
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function SubQuotationTable({
  quotations,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
}: SubQuotationTableProps) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();

  // Exclude requested quotations from this subtable (they are not shown here)
  const filteredQuotations = quotations.filter((q) => {
    const s = q.status?.toString().trim().toUpperCase() ?? "";
    if (/REQUESTED/.test(s)) return false;
    if (!normalizedSearch) return true;

    return q.quotationNumber?.toString().toLowerCase().includes(normalizedSearch);
  });

  const total = filteredQuotations.length;
  const isShowAll = perPage === 0;
  const totalPages = isShowAll ? 1 : Math.max(1, Math.ceil(total / perPage));

  useEffect(() => {
    if (page > totalPages) {
      onPageChange(totalPages);
    }
  }, [page, totalPages, onPageChange]);

  const visibleQuotations = isShowAll
    ? filteredQuotations
    : filteredQuotations.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <AppTable<ClientQuotation>
        columns={quotationColumns}
        data={visibleQuotations}
        rowKey={(row) => row.quotationNumber}
        getRowProps={(_, idx) => stripedRowProps(idx)}
        actions={quotationActions}
        withEntryControls
        entryControlPosition="top"
        searchPlaceholder="Search Reference No."
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={setSearch}
        entryOptions={["10", "20", "30"]}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        total={total}
        showingCount={visibleQuotations.length}
      />
    </>
  );
}
