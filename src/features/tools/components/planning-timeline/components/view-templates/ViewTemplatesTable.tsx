import { useLocation } from "react-router";
import { Table, Paper, Text, Group, Button, Divider, Box, Flex } from "@mantine/core";
import { Settings } from "@nine-thirty-five/material-symbols-react/rounded";
import { PageCard } from "@/components/PageCard";
import AddNewHeadingModal from "../../modals/AddNewHeadingModal";
import { useEffect, useRef, useState } from "react";

interface Template {
  id: number;
  name: string;
  version_number?: number;
  service_type?: string;
  is_active?: boolean;
}

export default function ViewTemplatesTable() {
  const location = useLocation();
  const template = (location.state as { template?: Template })?.template;
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default columns - first 3 are frozen
  const frozenColumns = ["#", "PROCESS", "TASK"];
  const defaultScrollableColumns = [
    "PIC",
    "SELLING COST",
    "FORECASTED COST",
    "ACTUAL COST",
    "TIMELINE",
    "TARGET DATE & TIME",
    "ACTUAL DATE & TIME",
    "PIC REMARKS",
    "STATUS",
    "PRIORITY",
    "NOTES",
    "APPROVAL",
    "VERIFICATION",
    "RISK LEVEL",
    "DEPENDENCIES",
    "DOCUMENT LINK",
    "COMPLETED BY",
  ];

  const [scrollableColumns, setScrollableColumns] = useState(defaultScrollableColumns);

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
    // Extract only the names from the reordered headings
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

  // Sample data - replace with real data from API
  const sampleData = [
    {
      id: 1,
      process: "Planning",
      task: ["Initial Assessment", "Requirement Gathering", "Scope Definition"],
      pic: "John Doe",
      sellingCost: "$1,000",
      forecastedCost: "$950",
      actualCost: "$900",
      timeline: "5 days",
      targetDateTime: "2026-06-15 10:00 AM",
      actualDateTime: "2026-06-14 02:30 PM",
      remarks: "Completed early",
      status: "Completed",
      priority: "High",
      notes: "Approved by manager",
      approval: "Yes",
      verification: "Passed",
      riskLevel: "Low",
      dependencies: "None",
      documentLink: "doc-001.pdf",
      completedBy: "John Doe",
    },
    {
      id: 2,
      process: "Execution",
      task: ["Implementation Setup", "Configuration", "Integration Testing"],
      pic: "Jane Smith",
      sellingCost: "$2,500",
      forecastedCost: "$2,300",
      actualCost: "$2,400",
      timeline: "10 days",
      targetDateTime: "2026-06-25 09:00 AM",
      actualDateTime: "2026-06-24 04:15 PM",
      remarks: "On track",
      status: "In Progress",
      priority: "High",
      notes: "Awaiting client feedback",
      approval: "Pending",
      verification: "In Review",
      riskLevel: "Medium",
      dependencies: "Planning Phase",
      documentLink: "doc-002.pdf",
      completedBy: "Jane Smith",
    },
    {
      id: 3,
      process: "Delivery",
      task: ["Final Testing & QA", "Documentation", "Deployment"],
      pic: "Mike Johnson",
      sellingCost: "$1,800",
      forecastedCost: "$1,750",
      actualCost: "$1,650",
      timeline: "7 days",
      targetDateTime: "2026-07-02 02:00 PM",
      actualDateTime: "Pending",
      remarks: "In progress",
      status: "In Progress",
      priority: "Medium",
      notes: "Ready for review",
      approval: "No",
      verification: "Pending",
      riskLevel: "High",
      dependencies: "Execution Phase",
      documentLink: "doc-003.pdf",
      completedBy: "Pending",
    },
  ];

  return (
    <PageCard
      title={template?.name || "View Templates"} 
      bgColor="transparent"
      shadow={false}
    >
      <Paper p="md" mt="-1rem">
        <Group justify="space-between" align="center" gap="xs" wrap="nowrap" mb="md">
          <Text fw={800} c="jltBlue.8">PLANNING & TIMELINE</Text>
          <Button variant="filled" h="40px" bg="#4E6174">EDIT TEMPLATE</Button>
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
              {sampleData.map((row) => {
                const taskCount = Array.isArray(row.task) ? row.task.length : 1;
                const tasks = Array.isArray(row.task) ? row.task : [row.task];
                
                return tasks.map((task, taskIdx) => (
                  <Table.Tr key={`${row.id}-${taskIdx}`} style={{ borderBottom: "1px solid #dee2e6" }}>
                    {taskIdx === 0 && (
                      <>
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
                          rowSpan={taskCount}
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
                          rowSpan={taskCount}
                        >
                          {row.process}
                        </Table.Td>
                      </>
                    )}
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
                      {task}
                    </Table.Td>
                    {taskIdx === 0 && (
                      <>
                        {/* Render scrollable columns in their current order */}
                        {scrollableColumns.map((colName) => (
                          <Table.Td
                            key={colName}
                            style={{ minWidth: "120px", borderRight: "1px solid #dee2e6" }}
                            rowSpan={taskCount}
                          >
                            {getRowData(row, colName)}
                          </Table.Td>
                        ))}
                      </>
                    )}
                  </Table.Tr>
                ));
              })}
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
