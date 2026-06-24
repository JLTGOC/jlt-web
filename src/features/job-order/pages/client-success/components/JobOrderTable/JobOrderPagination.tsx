import { Button, Group, Text } from "@mantine/core";
import { ChevronRight } from "@nine-thirty-five/material-symbols-react/outlined";
import { useMemo } from "react";

interface JobOrderPaginationProps {
  total?: number;
  totalPages?: number;
  showingCount?: number;
  perPaginationPage?: number;
  setPerPaginationPage?: (page: number) => void;
}

export function JobOrderPagination({
  total,
  totalPages,
  showingCount,
  perPaginationPage,
  setPerPaginationPage,
}: JobOrderPaginationProps) {
  const currentShowingCount = showingCount ?? 0;
  const currentTotal = total ?? 0;
  const currentPage = perPaginationPage ?? 1;
  const resolvedTotalPages = Math.max(totalPages ?? 1, 1);

  const pages = useMemo(() => {
    if (resolvedTotalPages <= 5) {
      return Array.from(
        { length: resolvedTotalPages },
        (_, index) => index + 1,
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", resolvedTotalPages];
    }

    if (currentPage >= resolvedTotalPages - 2) {
      return [
        1,
        "...",
        resolvedTotalPages - 2,
        resolvedTotalPages - 1,
        resolvedTotalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      resolvedTotalPages,
    ];
  }, [currentPage, resolvedTotalPages]);

  return (
    <Group align="center" justify="space-between" mt="md">
      <Text c="#8a8f99" fz="0.813rem">
        Showing {currentShowingCount} out of {currentTotal} entries
      </Text>

      {resolvedTotalPages > 1 && setPerPaginationPage ? (
        <Group gap={6} wrap="nowrap">
          <Button
            variant="outline"
            size="xs"
            radius="sm"
            leftSection={
              <ChevronRight
                width={14}
                style={{ transform: "rotate(180deg)" }}
              />
            }
            onClick={() => {
              if (currentPage > 1) {
                setPerPaginationPage(currentPage - 1);
              }
            }}
            disabled={currentPage === 1}
            styles={{
              root: {
                minWidth: 92,
                height: 30,
                borderColor: "#D1D5DB",
                color: "#4B5563",
                fontWeight: 500,
                paddingInline: 12,
              },
              section: {
                marginRight: 4,
              },
            }}
          >
            Previous
          </Button>

          {pages.map((page, index) =>
            page === "..." ? (
              <Text
                key={`ellipsis-${index}`}
                c="#8a8f99"
                fz="0.813rem"
              >
                ...
              </Text>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "filled" : "outline"}
                size="xs"
                radius="sm"
                onClick={() => {
                  if (
                    typeof page === "number" &&
                    page !== currentPage
                  ) {
                    setPerPaginationPage(page);
                  }
                }}
                styles={{
                  root: {
                    minWidth: 30,
                    height: 30,
                    borderColor:
                      page === currentPage
                        ? "#1D274E"
                        : "#D1D5DB",
                    backgroundColor:
                      page === currentPage
                        ? "#1D274E"
                        : "#FFFFFF",
                    color:
                      page === currentPage
                        ? "#FFFFFF"
                        : "#4B5563",
                    fontWeight: 600,
                    paddingInline: 10,
                  },
                }}
              >
                {page}
              </Button>
            ),
          )}

          <Button
            variant="outline"
            size="xs"
            radius="sm"
            rightSection={<ChevronRight width={14} />}
            onClick={() => {
              if (currentPage < resolvedTotalPages) {
                setPerPaginationPage(currentPage + 1);
              }
            }}
            disabled={currentPage === resolvedTotalPages}
            styles={{
              root: {
                minWidth: 74,
                height: 30,
                borderColor: "#D1D5DB",
                color: "#4B5563",
                fontWeight: 500,
                paddingInline: 12,
              },
              section: {
                marginLeft: 4,
              },
            }}
          >
            Next
          </Button>
        </Group>
      ) : null}
    </Group>
  );
}