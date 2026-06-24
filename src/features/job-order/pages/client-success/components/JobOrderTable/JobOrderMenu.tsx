import {
  ActionIcon,
  Menu,
} from "@mantine/core";

import {
  MoreVert,
  FileOpen,
} from "@nine-thirty-five/material-symbols-react/rounded";

import { Delete } from "@nine-thirty-five/material-symbols-react/outlined";

export function JobOrderMenu({
  row,
  handleUnderLinedRefNumberCLick,
}: any) {
  return (
    <Menu position="left">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVert width={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<FileOpen width={16} />}
          onClick={(e) => {
            e.stopPropagation();
            handleUnderLinedRefNumberCLick?.(row);
          }}
        >
          View Details
        </Menu.Item>

        <Menu.Item leftSection={<FileOpen width={16} />}>
          Documents
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<Delete width={16} />}
        >
          Discard
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}