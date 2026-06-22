import { useLocation, useNavigate, useSearchParams } from "react-router";
import { Table, Paper, Text, Group, Button, Divider, Box, Flex } from "@mantine/core";
import { Settings } from "@nine-thirty-five/material-symbols-react/rounded";
import { PageCard } from "@/components/PageCard";
import AddNewHeadingModal from "../../modals/AddNewHeadingModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTemplateDetails } from "@/features/tools/hooks/planningTImeline";

interface Template {
  id: number;
  name: string;
  version_number?: number;
  service_type?: string;
  is_active?: boolean;
}

export default function ViewTemplatesTable() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const template = (location.state as { template?: Template })?.template;
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const templateIdFromQuery = Number(searchParams.get("templateId"));
  const templateId =
    Number.isFinite(templateIdFromQuery) && templateIdFromQuery > 0
      ? templateIdFromQuery
      : template?.id;

  const { data: templateDetails, isLoading, isError } = useTemplateDetails(templateId);

  const frozenColumns = ["#", "PROCESS", "TASK"];

  const apiScrollableColumns = useMemo(() => {
    const headings = templateDetails?.phases?.flatMap((phase) => phase.headings ?? []) ?? [];
    return Array.from(new Set(headings.map((heading) => heading.name)));
  }, [templateDetails]);

  const [scrollableColumns, setScrollableColumns] = useState<string[]>([]);

  useEffect(() => {
    setScrollableColumns(apiScrollableColumns);
  }, [apiScrollableColumns]);

  const columns = [...frozenColumns, ...scrollableColumns];

  // Check if scrolling is needed based on column count or content width
  useEffect(() => {
    const checkScrollNeeded = () => {
      if (columns.length > 9) {
        setShouldScroll(true);
        return;
      }

      if (tableContainerRef.current && tableRef.current) {
        const containerWidth = tableContainerRef.current.clientWidth;
        const containerHeight = tableContainerRef.current.clientHeight;
        // Measure the actual table width, not the container (which might be clipped)
        const tableWidth = tableRef.current.scrollWidth;
        const tableHeight = tableRef.current.scrollHeight;
        
        // Enable scroll if table content is larger than container in any dimension
        setShouldScroll(tableWidth > containerWidth || tableHeight > containerHeight);
      }
    };

    // Check immediately and after a small delay to ensure DOM is rendered
    checkScrollNeeded();
    const timer = setTimeout(checkScrollNeeded, 100);

    // Use ResizeObserver to watch for content changes
    if (tableContainerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        checkScrollNeeded();
      });
      resizeObserver.observe(tableContainerRef.current);

      return () => {
        clearTimeout(timer);
        resizeObserver.disconnect();
      };
    }

    return () => clearTimeout(timer);
  }, [columns.length]);

  // Handle reordered headings from modal
  const handleHeadingsChange = (reorderedHeadings: any[]) => {
    const newOrder = reorderedHeadings.map((h) => h.name);
    setScrollableColumns(newOrder);
  };

  // Map column names to data property keys
  const columnToDataKey: Record<string, string> = {
    "#": "id",
    "PROCESS": "process",
    "TASK": "task",
    "PIC": "pic",
    "SELLING COST": "sellingCost",
    "FORECASTED COST": "forecastedCost",
    "ACTUAL COST": "actualCost",
    "TIMELINE": "timeline",
    "TARGET DATE & TIME": "targetDateTime",
    "ACTUAL DATE & TIME": "actualDateTime",
    "PIC REMARKS": "remarks",
    "STATUS": "status",
    "PRIORITY": "priority",
    "NOTES": "notes",
    "APPROVAL": "approval",
    "VERIFICATION": "verification",
    "RISK LEVEL": "riskLevel",
    "DEPENDENCIES": "dependencies",
    "DOCUMENT LINK": "documentLink",
    "COMPLETED BY": "completedBy",
  };

  // Get data value from row based on column name
  const getRowData = (row: any, columnName: string) => {
    const key = columnToDataKey[columnName];
    return row[key] || "";
  };

  const tableData = useMemo(() => {
    if (!templateDetails?.phases) return [];

    return templateDetails.phases.flatMap((phase) =>
      (phase.processes ?? []).flatMap((process) =>
        (process.tasks ?? []).map((task) => {
          const row: Record<string, string | number> = {
            id: String(task.id ?? `${phase.id}-${process.id}-${task.config_task_id}`),
            process: process.name,
            task: task.name,
          };

          (phase.headings ?? []).forEach((heading) => {
            row[heading.name] = "";
          });

          return row;
        }),
      ),
    );
  }, [templateDetails]);

  if (!templateId) {
    return (
      <PageCard title="View Templates" bgColor="transparent" shadow={false}>
        <Paper p="md">
          <Text c="red">Unable to load template details because the template id is missing.</Text>
        </Paper>
      </PageCard>
    );
  }

  if (isLoading) {
    return (
      <PageCard title={template?.name || "View Templates"} bgColor="transparent" shadow={false}>
        <Paper p="md">
          <Text>Loading template details...</Text>
        </Paper>
      </PageCard>
    );
  }

  if (isError) {
    return (
      <PageCard title={template?.name || "View Templates"} bgColor="transparent" shadow={false}>
        <Paper p="md">
          <Text c="red">Unable to load template details. Please try again.</Text>
        </Paper>
      </PageCard>
    );
  }

  return (
    <PageCard
      title={template?.name || "View Templates"} 
      bgColor="transparent"
      shadow={false}
    >
      <Paper p="md" mt="-1rem">
        <Group justify="space-between" align="center" gap="xs" wrap="nowrap" mb="md">
          <Text fw={800} c="jltBlue.8">PLANNING & TIMELINE</Text>
          <Button
            variant="filled"
            h="40px"
            bg="#4E6174"
            onClick={() =>
              navigate(
                `/tools/planning-timeline/edit-template?templateId=${templateId}`,
                {
                  state: { template, serviceType: template?.service_type },
                },
              )
            }
          >
            EDIT TEMPLATE
          </Button>
        </Group>
        <Divider />
        <Flex justify="space-between" align="center" gap="md" p="sm">
          <Text fw={800} c="#17314B">Current Phase: Phase 1 - Planning</Text>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              border: "none",
              background: "#4E6174",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              color: "white",
            }}
          >
            <Settings width="1.5rem" height="1.5rem" />
          </button>
        </Flex>
        <Box 
          ref={tableContainerRef}
          style={{ 
            overflowX: shouldScroll ? "auto" : "visible",
            overflowY: shouldScroll ? "auto" : "visible",
            cursor: shouldScroll ? "grab" : "default"
          }}
        >
          <Table ref={tableRef}>
            <Table.Thead bg="#17314B" c="white">
              <Table.Tr>
                {columns.map((column, idx) => (
                  <Table.Th
                    key={column}
                    style={{
                      minWidth: idx === 0 ? "30px" : idx === 1 ? "150px" : "180px",
                      ...(idx < 3 && {
                        position: "sticky",
                        left: idx === 0 ? 0 : idx === 1 ? 30 : 180,
                        zIndex: 10,
                        backgroundColor: "#17314B",
                        boxShadow: "2px 0 4px rgba(0, 0, 0, 0.1)",
                      }),
                    }}
                  >
                    {column}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody style={{ border: "1px solid #dee2e6" }}>
              {tableData.map((row) => (
                <Table.Tr key={`${row.id}-${row.process}-${row.task}`} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <Table.Td
                    style={{
                      minWidth: "30px",
                      borderRight: "1px solid #dee2e6",
                      position: "sticky",
                      left: 0,
                      zIndex: 5,
                      backgroundColor: "#f8f9fa",
                      boxShadow: "2px 0 4px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {row.id}
                  </Table.Td>
                  <Table.Td
                    style={{
                      minWidth: "150px",
                      borderRight: "1px solid #dee2e6",
                      position: "sticky",
                      left: 30,
                      zIndex: 5,
                      backgroundColor: "#f8f9fa",
                      boxShadow: "2px 0 4px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {row.process}
                  </Table.Td>
                  <Table.Td
                    style={{
                      minWidth: "180px",
                      borderRight: "1px solid #dee2e6",
                      position: "sticky",
                      left: 180,
                      zIndex: 5,
                      backgroundColor: "#f8f9fa",
                      boxShadow: "2px 0 4px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {row.task}
                  </Table.Td>
                  {scrollableColumns.map((colName) => (
                    <Table.Td
                      key={`${row.id}-${colName}`}
                      style={{ minWidth: "120px", borderRight: "1px solid #dee2e6" }}
                    >
                      {getRowData(row, colName)}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      </Paper>
      
      <AddNewHeadingModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templateName={template?.name}
        onHeadingsChange={handleHeadingsChange}
      />
    </PageCard>
  );
}
