import { useNavigate } from "react-router";

import { Switch, Table, Group, Button } from "@mantine/core";
import { PageCard } from "@/components/PageCard";
import {
  Edit,
  Settings,
  Add,
} from "@nine-thirty-five/material-symbols-react/rounded";

import { usePlanningTemplateList } from "@/features/tools/hooks/planningTImeline";

type LogisticsTemplatesProps = {
  serviceType: string;
};

export default function LogisticsTemplates({
  serviceType,
}: LogisticsTemplatesProps) {
  const navigate = useNavigate();

  const { data, isLoading } = usePlanningTemplateList();
  console.log("khate", data);

  return (
    <>
      <PageCard
        title="list of logistics templates"
        showDivider
        action={
          <Group wrap="nowrap">
            <Button
              style={{
                width: "2.5rem",
                height: "2.3rem",
                minWidth: "2.5rem",
                padding: 0,
                borderRadius: "10px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() =>
                navigate("/tools/planning-timeline/templates-configuration", {
                  state: { serviceType },
                })
              }
            >
              <Settings />
            </Button>
            <Button
              onClick={() =>
                navigate("/tools/planning-timeline/add-template", {
                  state: { serviceType },
                })
              }
              leftSection={
                <Add width="1.25rem" height="1.25rem" fill="currentColor" />
              }
            >
              ADD TEMPLATE
            </Button>
          </Group>
        }
      >
        <Table>
          <Table.Thead bg="#17314B" c="white">
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th style={{ width: "75%" }}>TEMPLATE NAME</Table.Th>
              <Table.Th style={{width: "9%" }} ta={"right"}>SERVICE TYPE</Table.Th>
              <Table.Th ta={"right"}>ACTIONS</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.map((template: any, i: number) => {
              const handleRowClick = (e: React.MouseEvent) => {
                // Prevent navigation if clicking on Switch or Edit button
                if ((e.target as HTMLElement).closest('[role="switch"]') || (e.target as HTMLElement).closest('svg')) {
                  return;
                }
                navigate("/tools/planning-timeline/view-templates-table", {
                  state: { template, serviceType },
                });
              };

              return (
                <Table.Tr 
                  key={i}
                  onClick={handleRowClick}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Td>{template.id}</Table.Td>
                  <Table.Td>{template.name}</Table.Td>
                  <Table.Td ta={"center"}>{template.service_type}</Table.Td>
                  <Table.Td ta={"center"} onClick={(e) => e.stopPropagation()}>
                    <Group align="center" justify="end">
                      <Switch checked={!!template.is_active} />
                      <Button
                        variant="subtle"
                        p={0}
                        onClick={() =>
                          navigate("/tools/planning-timeline/edit-template", {
                            state: { template, serviceType },
                          })
                        }
                      >
                        <Edit />
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </PageCard>
    </>
  );
}
