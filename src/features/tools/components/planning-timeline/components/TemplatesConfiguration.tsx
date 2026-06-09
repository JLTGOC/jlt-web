import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

import {
  Text,
  Flex,
  Group,
  Box,
  ActionIcon,
  Table,
  ScrollArea,
  Button,
  UnstyledButton,
  Loader,
} from "@mantine/core";
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
} from "@nine-thirty-five/material-symbols-react/rounded";

import { usePlanningConfigurations } from "@/features/tools/hooks/planningTImeline";
import type { UsedByTemplates } from "@/features/tools/types/planningTimeline";

import AddNewModal from "../modals/AddNewModal";
import InUseModal from "../modals/InUseModal";
import { PageCard } from "@/components/PageCard";

type ConfigKey = "phases" | "processes" | "tasks";

const TYPE_LABELS = {
  phases: "PHASE",
  processes: "PROCESS",
  tasks: "TASK",
} as const;

export default function TemplatesConfiguration() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceType = location.state?.serviceType;

  const { data, isLoading } = usePlanningConfigurations(serviceType);

  const [modalState, setModalState] = useState({
    addOpen: false,
    inUseOpen: false,
    name: "",
    item: "",
    itemName: "",
    templates: [] as UsedByTemplates[],
  });

  const handleInUseClick = (
    type: ConfigKey,
    itemName: string,
    templates: UsedByTemplates[],
  ) => {
    setModalState((prev) => ({
      ...prev,
      inUseOpen: true,
      templates: templates,
      name: TYPE_LABELS[type],
      itemName: itemName
    }));
  };

  const handleAddClick= (name: string) => {
    setModalState((prev) => ({ ...prev, addOpen: true, name: name }));
  };

  const rows = (type: ConfigKey) =>
    data?.[type].map((item, i) => (
      <Table.Tr key={i}>
        <Table.Td width={"8%"} ta={"center"}>
          {item.id}
        </Table.Td>
        <Table.Td>
          <Group justify="space-between">
            {item.name}
            {item.is_locked && (
              <UnstyledButton
                onClick={() =>
                  handleInUseClick(type, item.name, item.used_by_templates)
                }
                bdrs={50}
                px={5}
                bd={"1.5px solid #a5d6a7"}
                bg={"#e8f5e9"}
                fz={8}
                c={"#2e7d32"}
              >
                IN USE
              </UnstyledButton>
            )}
          </Group>
        </Table.Td>
        <Table.Td width={"5%"} ta={"end"} align="center">
          <Flex gap={5} justify={"center"}>
            <UnstyledButton
              disabled={item.is_locked === true}
              onClick={() => {}}
            >
              <Delete color={item.is_locked === true ? "gray" : "black"} />
            </UnstyledButton>
            <UnstyledButton
              disabled={item.is_locked === true}
              onClick={() => {}}
            >
              <Edit color={item.is_locked === true ? "gray" : "black"} />
            </UnstyledButton>
          </Flex>
        </Table.Td>
      </Table.Tr>
    ));

  const table = (type: ConfigKey) => (
    <ScrollArea style={{ flex: 1, minHeight: 0 }}>
      {isLoading ? (
        <Flex justify="center" align="center">
          <Loader color="blue" size="xs" type="dots" />
        </Flex>
      ) : (
        <Table highlightOnHover withColumnBorders withTableBorder>
          <Table.Tbody>{rows(type)}</Table.Tbody>
        </Table>
      )}
    </ScrollArea>
  );

  return (
    <Box>
      <Group my={10} justify="space-between">
        <Group>
          <UnstyledButton
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
          </UnstyledButton>
          <Text fw={700}>TEMPLATE CONFIGURATION</Text>
        </Group>
        <Button size="xs">SAVE CHANGES</Button>
      </Group>

      <Group align="stretch" grow wrap="nowrap" h={"83vh"}>
        <Flex direction="column" h={"83vh"} gap={10}>
          <PageCard
            showDivider
            hideBackButton
            title="LIST OF PHASES"
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => {
                  handleAddClick("PHASE");
                }}
              >
                <Add />
              </ActionIcon>
            }
          >
            {table("phases")}
          </PageCard>

          <PageCard
            showDivider
            hideBackButton
            title="LIST OF PROCESS"
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => {
                  handleAddClick("PROCESS");
                }}
              >
                <Add />
              </ActionIcon>
            }
          >
            {table("processes")}
          </PageCard>
        </Flex>

        <PageCard
          showDivider
          hideBackButton
          title="LIST OF TASKS"
          action={
            <ActionIcon
              color="jltAccent.6"
              onClick={() => {
                handleAddClick("TASK");
              }}
            >
              <Add />
            </ActionIcon>
          }
        >
          {table("tasks")}
        </PageCard>
      </Group>

      <AddNewModal
        opened={modalState.addOpen}
        name={modalState.name}
        onClose={() => setModalState((prev) => ({...prev, addOpen: false}))}
        onConfirm={() => setModalState((prev) => ({...prev, addOpen: false}))}
      />
      <InUseModal
        opened={modalState.inUseOpen}
        name={modalState.name}
        inUseTemplateList={modalState.templates}
        item={modalState.item}
        onClose={() => {
          setModalState((prev) => ({...prev, inUseOpen: false}))
        }}
        onConfirm={() => {
          setModalState((prev) => ({...prev, inUseOpen: false}))
        }}
      />
    </Box>
  );
}
