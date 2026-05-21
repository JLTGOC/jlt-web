// src/features/accounts/components/employees/EmployeeProfile.tsx
import {
  Card,
  Stack,
  Text,
  Avatar,
  Group,
  SimpleGrid,
  TextInput,
  Divider,
  Badge,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconKey } from "@tabler/icons-react"; // reset password icon
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { accountsService } from "../../services/accounts.service";
import type { EmployeeDetails } from "../../types/accounts.types";
import { AppButton } from "@/components/ui/AppButton";
import classes from "../AccountProfile.module.css";

export function EmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      accountsService
        .getEmployeeDetails(Number(id))
        .then(setEmployee)
        .catch(() => setEmployee(null));
    }
  }, [id]);

  if (!employee) return <div>Employee not found</div>;

  const initials = employee.accountInfo.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const readOnly = !isEditing;

  return (
    <Card withBorder radius="lg" className={classes.card} p="xl" shadow="sm">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Group gap="lg">
            <Avatar
              src={employee.identification.profileImageUrl ?? undefined}
              alt={employee.accountInfo.fullName}
              size={"5.375rem"}
              color="jltOrange"
            >
              {initials}
            </Avatar>
            <Stack gap={2}>
              <Text fw={700} size="xl" tt="uppercase">
                {employee.accountInfo.fullName}
              </Text>
              <Text size="sm" c="dimmed" fw={600} tt="uppercase">
                {employee.accountInfo.role}
              </Text>
            </Stack>
          </Group>

          <Group gap="sm">
            {/* Reset password action icon BEFORE edit/save */}
            <Tooltip label="Reset Password" withArrow>
              <ActionIcon
                variant="transparent"
                color="blue"
                size="xl"
                onClick={() => alert("Reset password placeholder")}
              >
                <IconKey size={30} />
              </ActionIcon>
            </Tooltip>

            {isEditing ? (
              <AppButton
                h={"2.625rem"}
                variant="primary"
                onClick={() => setIsEditing(false)}
              >
                SAVE
              </AppButton>
            ) : (
              <AppButton
                h={"2.625rem"}
                variant="primary"
                onClick={() => setIsEditing(true)}
              >
                EDIT
              </AppButton>
            )}
          </Group>
        </Group>

        <Divider />

        {/* Contact Information */}
        <Stack gap="sm">
          <Text fw={600}>Contact Information</Text>
          <SimpleGrid cols={2}>
            <TextInput
              label="EMAIL"
              value={employee.accountInfo.email}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
            <TextInput
              label="CONTACT NUMBER"
              value={employee.accountInfo.contactNumber}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
          </SimpleGrid>
        </Stack>

        <Divider />

        {/* Employment Details */}
        <Stack gap="sm">
          <Text fw={600}>Employment Details</Text>
          <SimpleGrid cols={2}>
            <TextInput
              label="ROLE"
              value={employee.accountInfo.role}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
            <TextInput
              label="LEAD STATUS"
              value={employee.isLead ? "Lead" : "Member"}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
          </SimpleGrid>
          <SimpleGrid cols={2} mt="md">
            <TextInput
              label="EMPLOYEE NUMBER"
              value={employee.employeeNumber ?? ""}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                STATUS
              </Text>
              <Badge
                color={employee.status.state === "ACTIVE" ? "green" : "gray"}
                variant="filled"
                radius="lg"
                size="lg"
              >
                {employee.status.state === "OFFLINE"
                  ? `Offline${
                      employee.status.lastSeen
                        ? ` (last seen ${employee.status.lastSeen.toLocaleString()})`
                        : ""
                    }`
                  : "Active"}
              </Badge>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Stack>
    </Card>
  );
}
