import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import { CheckCircle } from "@nine-thirty-five/material-symbols-react/outlined";
import {
  MoreVert,
  InboxTextPerson,
  Folder,
  Delete,
  RequestQuote,
} from "@nine-thirty-five/material-symbols-react/rounded";

import type { QuotationListItem } from "@/features/quotations/types/quotations.types";

function RouteArrow() {
  return (
    <Box
      component="span"
      style={{
        display: "inline-flex",
        verticalAlign: "middle",
      }}
    >
      <svg
        width="38"
        height="11"
        viewBox="0 0 38 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="6.125" cy="6" r="3.5" fill="#9CA3AF" />
        <path
          d="M10 6H30"
          stroke="#9CA3AF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M25 1L31 6L25 11"
          stroke="#9CA3AF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
}

function toTitleCase(value?: string) {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDisplayDate(value?: string) {
  if (!value) return "-";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("MMM DD, YYYY") : value;
}

function getInitials(fullName: string) {
  if (!fullName) return "?";
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getRowAccentColor(row: QuotationListItem) {
  return row.client_type === "NEW" ? "#54B99B" : "#368DC4";
}

export function RequestCell({ row }: { row: QuotationListItem }) {
  return (
    <Stack gap={2}>
      <Text
        c="#2a4058"
        fz="0.875rem"
        fw={700}
        style={{ textDecoration: "underline" }}
      >
        {row.reference_number}
      </Text>
      <Text c="#475569" fz="0.813rem" lh={1.45}>
        {row.client_full_name}
      </Text>
    </Stack>
  );
}

export function DetailsCell({ row }: { row: QuotationListItem }) {
  return (
    <Stack gap={2}>
      <Text c="#2a4058" fz="0.875rem" fw={700}>
        {toTitleCase(row.service)}
      </Text>
      {row.logistics_service ? (
        <>
          <Group gap={6} align="center" wrap="nowrap">
            <Text c="#475569" fz="0.813rem" lh={1.45}>
              {toTitleCase(row.logistics_service.service_type)}
            </Text>
            <RouteArrow />
            <Text c="#475569" fz="0.813rem" lh={1.45}>
              {toTitleCase(row.logistics_service.transport_mode)}
            </Text>
          </Group>
          <Group gap={6} align="center" wrap="nowrap">
            <Text c="#475569" fz="0.813rem" lh={1.45}>
              {row.logistics_service.origin}
              <RouteArrow />
              {row.logistics_service.destination}
            </Text>
          </Group>
        </>
      ) : row.regulatory_service ? (
        <>
          <Text c="#475569" fz="0.813rem" lh={1.45}>
            {toTitleCase(row.regulatory_service.type_of_regulatory_assistance)}
          </Text>
          <Text c="#475569" fz="0.813rem" lh={1.45}>
            Application Type:{" "}
            {toTitleCase(row.regulatory_service.application_type)}
          </Text>
          <Text c="#475569" fz="0.813rem" lh={1.45}>
            Business Type:{" "}
            {row.regulatory_service.business_type
              ? toTitleCase(row.regulatory_service.business_type)
              : "-"}
          </Text>
        </>
      ) : (
        <Text c="#475569" fz="0.813rem" lh={1.45}>
          -
        </Text>
      )}
    </Stack>
  );
}

export function PersonInChargeCell({ row }: { row: QuotationListItem }) {
  const name = row.account_specialist ?? row.account_specialist ?? "Unassigned";
  const initials = getInitials(name);

  return (
    <Group gap="sm" align="center">
      <Avatar radius="xl" color="#f5c96a" size={36}>
        {initials}
      </Avatar>
      <Text c="#2a4058" fz="0.75rem" fw={700}>
        {name.toUpperCase()}
      </Text>
    </Group>
  );
}

export function AcceptedStatusCell({ row }: { row: QuotationListItem }) {
  return (
    <Stack gap={6}>
      <Box
        style={{
          border: "1px solid #22c55e",
          color: "#16a34a",
          borderRadius: "8px",
          padding: "0.2rem 0.75rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          width: "fit-content",
        }}
      >
        <CheckCircle width={16} color="#16a34a" />
        <Text fz="0.75rem" fw={600} c="#16a34a">
          Quotation Accepted
        </Text>
      </Box>
      <Text c="#475569" fz="0.75rem">
        Quotation Accepted: {formatDisplayDate(row.date)}
      </Text>
    </Stack>
  );
}

export function MyJobsStatusCell({
  row,
  onMakeJobOrder,
}: {
  row: QuotationListItem;
  onMakeJobOrder: (row: QuotationListItem) => void;
}) {
  const personInCharge =
    row.account_specialist ?? row.account_specialist ?? "Unassigned";

  return (
    <Stack gap={6}>
      {row.job_order_created === true ? (
        ""
      ) : (
        <Button
          variant="outline"
          color="#4f657d"
          size="xs"
          leftSection={<CheckCircle width={16} />}
          onClick={(event) => {
            event.stopPropagation();
            onMakeJobOrder(row);
          }}
        >
          Make Job Order
        </Button>
      )}

      <Text c="#475569" fz="0.75rem">
        PIC: {personInCharge}
      </Text>
      <Text c="#475569" fz="0.75rem">
        Date Accepted: {formatDisplayDate(row.date)}
      </Text>
    </Stack>
  );
}

interface ActionsMenuProps {
  row: QuotationListItem;
  onViewDetails: (row: QuotationListItem) => void;
  onViewDocuments: (row: QuotationListItem) => void;
  actionLabel: "Discard" | "Update Quotation";
  onAction?: (row: QuotationListItem) => void;
}

export function ActionsMenu({
  row,
  onViewDetails,
  onViewDocuments,
  actionLabel,
  onAction,
}: ActionsMenuProps) {
  return (
    <Menu shadow="md" width={180} position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="subtle" color="#334155" aria-label="More actions">
          <MoreVert width={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => onViewDetails(row)}
          leftSection={<InboxTextPerson width={16} />}
        >
          View Details
        </Menu.Item>
        <Menu.Item
          onClick={() => onViewDocuments(row)}
          leftSection={<Folder width={18} />}
        >
          Documents
        </Menu.Item>
        {/* <Menu.Item
          color={actionLabel === "Discard" ? "red" : undefined}
          onClick={() => onAction?.(row)}
          leftSection={
            actionLabel === "Discard" ? (
              <Delete width={18} />
            ) : (
              <RequestQuote width={18} />
            )
          }
        >
          {actionLabel}
        </Menu.Item> */}
      </Menu.Dropdown>
    </Menu>
  );
}
