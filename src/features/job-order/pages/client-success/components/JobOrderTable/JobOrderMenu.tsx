import {
  ActionIcon,
  Menu,
} from "@mantine/core";

import {
  MoreVert,
  Folder,
  Visibility
} from "@nine-thirty-five/material-symbols-react/rounded";


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
          leftSection={<Visibility width={16} />}
          onClick={(e) => {
            e.stopPropagation();
            handleUnderLinedRefNumberCLick?.(row);
          }}
        >
          View Details
        </Menu.Item>

        <Menu.Item leftSection={<Folder width={16} />}>
          Documents
        </Menu.Item>

        <Menu.Divider />

      </Menu.Dropdown>
    </Menu>
  );
}