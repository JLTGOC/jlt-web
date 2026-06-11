import { useLocation } from "react-router";
import { Table, Paper, Text, Group, Button, Divider  } from "@mantine/core";
import { PageCard } from "@/components/PageCard";

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

  const columns = [
    "#",
    "PROCESS",
    "TASK",
    "PIC",
    "SELLING COST",
    "FORECASTED COST",
    "ACTUAL COST",
    "TIMELINE",
    "TARGET DATE & TIME",
    "ACTUAL DATE & TIME",
    "PIC REMARKS",
  ];

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
        <Table>
          <Table.Thead bg="#17314B" c="white">
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column}>{column}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody style={{ border: "1px solid #dee2e6" }}>
            {sampleData.map((row, rowIdx) => {
              const taskCount = Array.isArray(row.task) ? row.task.length : 1;
              const tasks = Array.isArray(row.task) ? row.task : [row.task];
              
              return tasks.map((task, taskIdx) => (
                <Table.Tr key={`${row.id}-${taskIdx}`} style={{ borderBottom: "1px solid #dee2e6" }}>
                  {taskIdx === 0 && (
                    <>
                      <Table.Td style={{ borderRight: "1px solid #dee2e6" }} rowSpan={taskCount}>{row.id}</Table.Td>
                      <Table.Td style={{ borderRight: "1px solid #dee2e6" }} rowSpan={taskCount}>{row.process}</Table.Td>
                    </>
                  )}
                  <Table.Td style={{ borderRight: "1px solid #dee2e6" }}>{task}</Table.Td>
                  {taskIdx === 0 && (
                    <>
                      <Table.Td style={{ borderRight: "1px solid #dee2e6" }} rowSpan={taskCount}>{row.pic}</Table.Td>
                      <Table.Td style={{ borderRight: "1px solid #dee2e6" }} rowSpan={taskCount}>{row.sellingCost}</Table.Td>
                      <Table.Td style={{ borderRight: "1px solid #dee2e6" }} rowSpan={taskCount}>{row.forecastedCost}</Table.Td>
                      <Table.Td style={{ borderRight: "1px solid #dee2e6" }} rowSpan={taskCount}>{row.actualCost}</Table.Td>
                      <Table.Td style={{ borderRight: "1px solid #dee2e6" }} rowSpan={taskCount}>{row.timeline}</Table.Td>
                      <Table.Td style={{ borderRight: "1px solid #dee2e6" }} rowSpan={taskCount}>{row.targetDateTime}</Table.Td>
                      <Table.Td style={{ borderRight: "1px solid #dee2e6" }} rowSpan={taskCount}>{row.actualDateTime}</Table.Td>
                      <Table.Td rowSpan={taskCount}>{row.remarks}</Table.Td>
                    </>
                  )}
                </Table.Tr>
              ));
            })}
          </Table.Tbody>
        </Table>
      </Paper>  
    </PageCard>
  );
}
