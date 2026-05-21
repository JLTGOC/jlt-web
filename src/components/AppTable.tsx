import {
  Table,
  Group,
  Text,
  Select,
  Menu,
  ActionIcon,
  Box,
  Switch,
  Tooltip,
  Button,
} from "@mantine/core";
import {
  MoreVert,
  ChevronRight,
  Edit,
  Delete,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { useMemo, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import type { ReactNode } from "react";
import type React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppTableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T, index: number) => ReactNode;
  width?: string;
  type?: "select";
  selectOptions?: { value: string; label: string }[] | string[];
  onSelectChange?: (row: T, value: string) => void;
  selectValue?: (row: T) => string;
}

export interface AppTableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  color?: string;
}

export interface AppTableProps<T> {
  /** Optional function to provide extra props for each row (e.g., style, className) */
  getRowProps?: (
    row: T,
    index: number,
  ) => React.HTMLAttributes<HTMLTableRowElement>;
  columns: AppTableColumn<T>[];
  data: T[];
  rowKey?: (row: T) => string | number;
  actions?: AppTableAction<T>[];
  withNumbering?:
    | boolean
    | {
        label?: string;
        width?: string;
        format?: (index: number) => string;
      };
  withToggle?: {
    getValue: (row: T) => boolean;
    onChange: (row: T, value: boolean) => void | Promise<void>;
    label?: string;
    width?: string;
    disabled?: (row: T) => boolean;
    color?: string;
  };
  withEdit?: {
    onClick: (row: T) => void;
    label?: string;
    width?: string;
    disabled?: (row: T) => boolean;
    icon?: React.ReactNode;
    tooltip?: string;
  };
  withDelete?: {
    onClick: (row: T) => void | Promise<void>;
    label?: string;
    width?: string;
    disabled?: (row: T) => boolean;
    icon?: React.ReactNode;
    tooltip?: string;
    confirmMessage?: string | ((row: T) => string);
  };
  /** Enables the top bar and/or footer controls */
  withEntryControls?: boolean;
  /** Place the entry controls in the table header, footer, or both */
  entryControlPosition?: "top" | "bottom" | "both";
  /** Custom entry size options in the paginator */
  entryOptions?: string[];
  /** Hide the top-bar search input when entry controls are enabled */
  showSearchInTopBar?: boolean;
  perPage?: number;
  onPerPageChange?: (value: number) => void;
  total?: number;
  /** Explicit count for "Showing X out of Y" — use pagination.count from the API. Defaults to data.length if omitted. */
  showingCount?: number;
  /** Search bar placeholder — only shown when withEntryControls is true */
  searchPlaceholder?: string;
  /** Controlled search value */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  /** Optional row click handler */
  onRowClick?: (row: T) => void;
  /** Optional row hover handler for high-confidence prefetching */
  onRowHover?: (row: T) => void;
  /** Current page (1-indexed). Enables pagination in the footer when provided. */
  page?: number;
  /** Called when the user clicks a page number or prev/next */
  onPageChange?: (page: number) => void;
}

const DEFAULT_ENTRY_OPTIONS = ["5", "10", "25", "50", "100"];

// ─── Component ────────────────────────────────────────────────────────────────

export function AppTable<T>({
  columns,
  data,
  rowKey,
  actions,
  withNumbering,
  withToggle,
  withEdit,
  withDelete,
  withEntryControls = false,
  entryControlPosition = "top",
  entryOptions = DEFAULT_ENTRY_OPTIONS,
  perPage = 10,
  onPerPageChange,
  total,
  searchPlaceholder = "SEARCH",
  searchValue,
  onSearchChange,
  onSearch,
  showSearchInTopBar = true,
  showingCount: showingCountProp,
  onRowClick,
  onRowHover,
  page,
  onPageChange,
  getRowProps,
}: AppTableProps<T>) {
  const hasActions = Array.isArray(actions) && actions.length > 0;
  const showingCount = showingCountProp ?? data.length;
  const totalCount = total ?? data.length;
  const hasPagination = page !== undefined && onPageChange && totalCount > 0;

  // Internal search state for uncontrolled usage
  const [internalSearch, setInternalSearch] = useState("");
  const isSearchControlled = searchValue !== undefined;
  const currentSearch = isSearchControlled ? searchValue : internalSearch;
  const showTopControls = withEntryControls && entryControlPosition !== "bottom";
  const showBottomControls = withEntryControls && entryControlPosition !== "top";
  const showSearchBar = showTopControls && showSearchInTopBar;

  const finalColumns = useMemo(() => {
    const builtColumns: AppTableColumn<T>[] = [];

    if (withNumbering) {
      const numberingConfig =
        typeof withNumbering === "object" ? withNumbering : {};
      const formatter =
        numberingConfig.format ??
        ((index: number) => String(index + 1).padStart(2, "0"));

      builtColumns.push({
        key: "_numbering",
        label: numberingConfig.label ?? "NO",
        width: numberingConfig.width ?? "5rem",
        render: (_row, index) => formatter(index),
      });
    }

    builtColumns.push(...columns);

    if (withToggle) {
      builtColumns.push({
        key: "_toggle",
        label: withToggle.label ?? "",
        width: withToggle.width ?? "6rem",
        render: (row) => (
          <Switch
            checked={withToggle.getValue(row)}
            onChange={(event) =>
              withToggle.onChange(row, event.currentTarget.checked)
            }
            disabled={withToggle.disabled?.(row)}
            color={withToggle.color ?? "green"}
            size="md"
            onClick={(event) => event.stopPropagation()}
            withThumbIndicator={false}
          />
        ),
      });
    }

    if (withEdit) {
      builtColumns.push({
        key: "_edit",
        label: withEdit.label ?? "",
        width: withEdit.width ?? "4rem",
        render: (row) => {
          const editButton = (
            <ActionIcon
              variant="subtle"
              color="dark"
              disabled={withEdit.disabled?.(row)}
              onClick={(event) => {
                event.stopPropagation();
                withEdit.onClick(row);
              }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {withEdit.icon ?? <Edit width={24} height={24} />}
            </ActionIcon>
          );

          return withEdit.tooltip ? (
            <Tooltip label={withEdit.tooltip}>{editButton}</Tooltip>
          ) : (
            editButton
          );
        },
      });
    }

    if (withDelete) {
      builtColumns.push({
        key: "_delete",
        label: withDelete.label ?? "",
        width: withDelete.width ?? "4rem",
        render: (row) => {
          const onDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            if (!withDelete.confirmMessage) {
              withDelete.onClick(row);
              return;
            }

            const message =
              typeof withDelete.confirmMessage === "function"
                ? withDelete.confirmMessage(row)
                : withDelete.confirmMessage;

            const confirmed = window.confirm(message);

            if (confirmed) {
              withDelete.onClick(row);
            }
          };

          const deleteButton = (
            <ActionIcon
              variant="subtle"
              color="red"
              disabled={withDelete.disabled?.(row)}
              onClick={onDeleteClick}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {withDelete.icon ?? <Delete width={24} height={24} />}
            </ActionIcon>
          );

          return withDelete.tooltip ? (
            <Tooltip label={withDelete.tooltip}>{deleteButton}</Tooltip>
          ) : (
            deleteButton
          );
        },
      });
    }

    return builtColumns;
  }, [columns, withDelete, withEdit, withNumbering, withToggle]);

  const handleSearchChange = (val: string) => {
    if (!isSearchControlled) setInternalSearch(val);
    onSearchChange?.(val);
  };

  const renderCell = (col: AppTableColumn<T>, row: T, index: number) => {
    if (col.render) return col.render(row, index);

    const rawValue = String(
      (row as Record<string, unknown>)[String(col.key)] ?? "",
    );

    if (col.type === "select") {
      const currentValue = col.selectValue ? col.selectValue(row) : rawValue;
      return (
        <Select
          data={col.selectOptions ?? []}
          value={currentValue}
          onChange={(val) => val && col.onSelectChange?.(row, val)}
          allowDeselect={false}
          rightSection={<ChevronRight />}
          size="xs"
          styles={{
            root: {
              width: "9.375rem",
            },
            input: {
              fontSize: "0.75rem",
              border: 0,
              height: "1.8rem",
              minHeight: "1.8rem",
              cursor: "pointer",
            },
            dropdown: { fontSize: "0.75rem" },
            option: { fontSize: "0.75rem" },
          }}
        />
      );
    }

    return rawValue;
  };

  return (
    <Box>
      {/* ── Top bar: Show N entries (left) + Search (right) ── */}
      {showTopControls && (
        <Group justify="space-between" align="center" mb="0.75rem">
          <Group gap="0.4rem" align="center">
            <Text size="0.8rem" c="dimmed">
              Show
            </Text>
            <Select
              data={entryOptions}
              value={entryOptions.includes("All") && perPage === 0 ? "All" : String(perPage)}
              onChange={(val) => {
                if (!val) return;
                const parsed = val.toString().toLowerCase() === "all" ? 0 : Number(val);
                onPerPageChange?.(parsed);
              }}
              size="xs"
              w="4rem"
              allowDeselect={false}
              styles={{
                input: {
                  textAlign: "center",
                  fontSize: "0.75rem",
                  height: "1.6rem",
                  minHeight: "1.6rem",
                  padding: "0 0.5rem",
                },
              }}
            />
            <Text size="0.8rem" c="dimmed">
              entries
            </Text>
          </Group>

          {showSearchBar && (
            <SearchBar
              placeholder={searchPlaceholder}
              value={currentSearch}
              onChange={handleSearchChange}
              onSearch={onSearch}
            />
          )}
        </Group>
      )}

      {/* ── Table ── */}
      <Table
        withRowBorders={false}
        highlightOnHover
        styles={{
          table: { width: "100%", borderCollapse: "collapse" },
          thead: { backgroundColor: "#1e2235" },
          th: {
            color: "#ffffff",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            padding: "0.65rem 1rem",
            whiteSpace: "nowrap",
          },
          td: {
            fontSize: "0.75rem",
            padding: "0.65rem 1rem",
            color: "var(--mantine-color-dark-7)",
          },
          tr: {
            borderBottom: "1px solid var(--mantine-color-gray-2)",
          },
        }}
      >
        <Table.Thead>
          <Table.Tr>
            {finalColumns.map((col) => (
              <Table.Th
                key={String(col.key)}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </Table.Th>
            ))}
            {hasActions && <Table.Th style={{ width: "3rem" }} />}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {data.map((row, idx) => {
            const extraRowProps =
              typeof getRowProps === "function" ? getRowProps(row, idx) : {};
            return (
              <Table.Tr
                key={rowKey ? rowKey(row) : idx}
                onMouseEnter={onRowHover ? () => onRowHover(row) : undefined}
                {...extraRowProps}
              >
                {finalColumns.map((col) => (
                  <Table.Td
                    key={String(col.key)}
                    onClick={
                      onRowClick && col.type !== "select"
                        ? () => onRowClick(row)
                        : undefined
                    }
                    style={
                      onRowClick && col.type !== "select"
                        ? { cursor: "pointer" }
                        : undefined
                    }
                  >
                    <>{renderCell(col, row, idx)}</>
                  </Table.Td>
                ))}
                {hasActions && (
                  <Table.Td
                    style={{ textAlign: "right" }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Menu shadow="md" width="10rem" position="left-start">
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          color="dark"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <MoreVert width={18} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {actions!.map((action) => (
                          <Menu.Item
                            key={action.label}
                            color={action.color}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            leftSection={action.icon}
                            styles={{ item: { fontSize: "0.75rem" } }}
                          >
                            {action.label}
                          </Menu.Item>
                        ))}
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                )}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      {/* ── Footer ── */}
      {(showBottomControls || hasPagination) && (
        <Group justify="space-between" align="center" mt="0.75rem">
          <Group gap="0.4rem" align="center">
            {showBottomControls && (
              <>
                <Text size="0.8rem" c="dimmed">
                  Show
                </Text>
                <Select
                  data={entryOptions}
                  value={entryOptions.includes("All") && perPage === 0 ? "All" : String(perPage)}
                  onChange={(val) => {
                    if (!val) return;
                    const parsed = val.toString().toLowerCase() === "all" ? 0 : Number(val);
                    onPerPageChange?.(parsed);
                  }}
                  size="xs"
                  w="4rem"
                  allowDeselect={false}
                  styles={{
                    input: {
                      textAlign: "center",
                      fontSize: "0.75rem",
                      height: "1.6rem",
                      minHeight: "1.6rem",
                      padding: "0 0.5rem",
                    },
                  }}
                />
                <Text size="0.8rem" c="dimmed">
                  entries
                </Text>
              </>
            )}
            <Text size="0.75rem" c="dimmed">
              Showing {showingCount} out of {totalCount} entries
            </Text>
          </Group>
          {hasPagination && page !== undefined && onPageChange && (
            <TablePagination
              page={page}
              totalPages={perPage === 0 ? 1 : Math.max(1, Math.ceil(totalCount / perPage))}
              onPageChange={onPageChange}
            />
          )}
        </Group>
      )}
    </Box>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function TablePagination({
  page,
  totalPages,
  onPageChange,
}: TablePaginationProps) {
  // Build the page number list with ellipsis for large ranges
  const pages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }, [page, totalPages]);

  return (
    <Group gap="0.25rem">
      <Button
        variant="outline"
        size="xs"
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
        leftSection={
          <ChevronRight width={14} style={{ transform: "rotate(180deg)" }} />
        }
      >
        Previous
      </Button>

      {pages.map((p, i) =>
        p === "..." ? (
          <Text key={`ellipsis-${i}`} size="0.75rem" c="dimmed">
            ...
          </Text>
        ) : (
          <Button
            key={p}
            variant={p === page ? "filled" : "default"}
            size="xs"
            onClick={() =>
              typeof p === "number" && p !== page && onPageChange(p)
            }
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="xs"
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
        rightSection={<ChevronRight width={14} />}
      >
        Next
      </Button>
    </Group>
  );
}
