import { useNavigate, useLocation } from "react-router";
import {
  Text,
  Table,
  Group,
  Switch,
  Checkbox,
  Flex,
  Loader,
} from "@mantine/core";

import { usePlanningConfigurations } from "@/features/tools/hooks/planningTImeline";

import { PageCard } from "@/components/PageCard";
export default function SelectProcess() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceType = location.state?.serviceType;

  const { data, isLoading } = usePlanningConfigurations(serviceType);

  const rows = data?.processes.map((phase, i) => (
    <Table.Tr key={i}>
      <Table.Td>{phase.id}</Table.Td>
      <Table.Td>{phase.name}</Table.Td>
      <Table.Td ta={"center"}>
        <Group align="center" justify="end">
          <Checkbox />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <PageCard
        title="Select Process"
        showDivider
        showNextButton
        nextButtonAction={() =>
          navigate("/tools/planning-timeline/add-template/task", {
            state: { serviceType },
          })
        }
      >
        <Table highlightOnHover striped>
          <Table.Thead bg="#17314B" c="white">
            <Table.Tr>
              <Table.Th>NO</Table.Th>
              <Table.Th style={{ width: "75%" }}>PROCESS</Table.Th>
              <Table.Th ta={"right"}></Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        {isLoading && (
          <Flex justify="center" align="center">
            <Loader color="blue" size="xs" type="dots" />
          </Flex>
        )}
      </PageCard>
    </>
  );
}
