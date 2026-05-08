import { Avatar, Group, Text } from "@mantine/core";

interface PersonInChargeCellProps {
  person?: { name: string; avatar_url?: string };
}

export function PersonInChargeCell({ person }: PersonInChargeCellProps) {
  if (!person) {
    return (
      <Group gap="xs">
        <Avatar radius="xl" color="gray" size="2rem">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="#adb5bd" />
            <rect x="4" y="16" width="16" height="4" rx="2" fill="#dee2e6" />
          </svg>
        </Avatar>
        <Text size="sm" c="dimmed">
          Unassigned
        </Text>
      </Group>
    );
  }
  return (
    <Group gap="xs" c="jltBlue">
      <Avatar src={person.avatar_url} radius="xl" size="2rem" color="blue">
        {person.name[0]}
      </Avatar>
      <Text size="sm">{person.name}</Text>
    </Group>
  );
}
