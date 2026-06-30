import { Table, Button, Group, Flex, Loader } from "@mantine/core";
import { useNavigate, useLocation } from "react-router";
import { useTemplateList } from "../hooks/usePlanningTemplate";

import { PageCard } from "@/components/PageCard";
import {
  Add,
  Visibility,
} from "@nine-thirty-five/material-symbols-react/rounded";

export default function ListOfServicesTemplates() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceType = location.state?.serviceType;

  const { data, isLoading } = useTemplateList(serviceType);

  return (
    <>
      <PageCard
        title={`List of ${serviceType} services templates`}
        action={
          <>
            <Button
              onClick={() =>
                navigate("/tools/planning-timeline/add-template", {
                  state: { serviceType: serviceType },
                })
              }
              leftSection={<Add />}
              color="#4E6174"
            >
              ADD TEMPLATE
            </Button>
          </>
        }
      >
        <Table>
          <Table>
            <Table.Thead bg="#17314B" c="white">
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th style={{ width: "75%" }}>TEMPLATE NAME</Table.Th>
                <Table.Th ta={"center"}>SERVICE TYPE</Table.Th>
                <Table.Th ta={"right"}>ACTIONS</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {data?.map((template: any, i: number) => {
                return (
                  <Table.Tr
                    key={i}
                    onClick={() =>
                      navigate(`/tasks/template/${template.id}/details`)
                    }
                  >
                    <Table.Td>{template.id}</Table.Td>
                    <Table.Td>{template.name}</Table.Td>
                    <Table.Td ta={"center"}>{template.service_type}</Table.Td>
                    <Table.Td ta={"center"}>
                      <Group align="center" justify="end">
                        <Visibility />
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
          {isLoading && (
            <Flex justify="center" align="center">
              <Loader color="blue" size="xs" type="dots" />
            </Flex>
          )}
        </Table>
      </PageCard>
    </>
  );
}
