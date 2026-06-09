import { useNavigate } from "react-router";

import { Switch, Table, Group, Button } from "@mantine/core";
import { PageCard } from "@/components/PageCard";
import {
  Edit,
  Settings,
  Add,
} from "@nine-thirty-five/material-symbols-react/rounded";

type LogisticsTemplatesProps = {
  serviceType: string;
};

export default function LogisticsTemplates({
  serviceType,
}: LogisticsTemplatesProps) {
  const navigate = useNavigate();

  console.log("khate", serviceType);

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
              onClick={() => navigate("/tools/planning-timeline/add-template")}
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
              <Table.Th ta={"right"}>SERVICE TYPE</Table.Th>
              <Table.Th ta={"right"}>ACTIONS</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {
              <Table.Tr>
                <Table.Td>1</Table.Td>
                <Table.Td>element.name</Table.Td>
                <Table.Td ta={"right"}>element.symbol</Table.Td>
                <Table.Td ta={"center"}>
                  <Group align="center" justify="end">
                    <Switch defaultChecked />
                    <Edit />
                  </Group>
                </Table.Td>
              </Table.Tr>
            }
          </Table.Tbody>
        </Table>
      </PageCard>
    </>
  );
}
