import { Table, Group, Stack } from "@mantine/core";

import { PreAlertCell } from "./cells/PreAlert";
import { DetailsCell } from "./cells/DetailsCell";
import { ServiceTypeCell } from "./cells/ServiceTypeCell";
import { StatusCell } from "./cells/StatusCell";
import { JobOrderMenu } from "./JobOrderMenu";

export function JobOrderTableRow({
  row,
  index,
  userID,
  onAcceptClick,
  handleUnderLinedRefNumberCLick,
}: any) {
  return (
    <Table.Tr
      style={{
        backgroundColor:
          index % 2 === 0 ? "#FFFFFF" : "#F1F3F4",
      }}
    >
      <PreAlertCell row={row} />

      <DetailsCell row={row} />

      <ServiceTypeCell row={row} />

      <Table.Td>
        <Group
          justify="space-between"
          align="flex-start"
          wrap="nowrap"
        >
          <Stack gap={4}>
            <StatusCell
              row={row}
              userID={userID}
              onAcceptClick={onAcceptClick}
            />
          </Stack>

          <JobOrderMenu
            row={row}
            handleUnderLinedRefNumberCLick={
              handleUnderLinedRefNumberCLick
            }
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}