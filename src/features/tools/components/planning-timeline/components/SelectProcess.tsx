import { Text, Table, Group, Switch, Checkbox } from "@mantine/core";
import { PageCard } from "@/components/PageCard";
import { useNavigate } from "react-router";


export default function SelectProcess() {
  const navigate = useNavigate();
  return (
    <>
      <PageCard
        title="Select Process"
        showDivider
        showNextButton
        nextButtonAction={() =>
          navigate("/tools/planning-timeline/add-template/task")
        }
      >
        <Table>
          <Table.Thead bg="#17314B" c="white">
            <Table.Tr>
              <Table.Th>NO</Table.Th>
              <Table.Th style={{ width: "75%" }}>PROCESS</Table.Th>
              <Table.Th ta={"right"}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {
              <Table.Tr>
                <Table.Td>1</Table.Td>
                <Table.Td>element.name</Table.Td>
                <Table.Td ta={"center"}>
                  <Group align="center" justify="end">
                    <Checkbox defaultChecked />
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
