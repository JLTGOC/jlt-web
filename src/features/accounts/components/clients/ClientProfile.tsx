import {
  Card,
  Stack,
  Text,
  Avatar,
  Group,
  SimpleGrid,
  TextInput,
  Divider,
} from "@mantine/core";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { accountsService } from "../../services/accounts.service";
import type { AccountDetails } from "../../types/accounts.types";
import { AppButton } from "@/components/ui/AppButton";
import classes from "../AccountProfile.module.css";

export function ClientProfile() {
  const { id } = useParams();
  const [client, setClient] = useState<AccountDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      accountsService.getClientDetails(Number(id)).then(setClient).catch(() => {
        setClient(null);
      });
    }
  }, [id]);

  if (!client) return <div>Client not found</div>;

  const initials = client.accountInfo.fullName
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
              src={client.identification.profileImageUrl ?? undefined}
              alt={client.accountInfo.fullName}
              size={"5.375rem"}
              color="jltOrange"
            >
              {initials}
            </Avatar>
            <Stack gap={2}>
              <Text fw={700} size="xl" tt="uppercase">
                {client.accountInfo.fullName}
              </Text>
              <Text size="sm" c="dimmed" fw={600} tt="uppercase">
                {client.companyInfo.companyName}
              </Text>
            </Stack>
          </Group>

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

        <Divider />

        {/* Account Information */}
        <Stack gap="sm">
          <Text fw={600}>Account Information</Text>
          <SimpleGrid cols={2}>
            <TextInput
              label="EMAIL"
              value={client.accountInfo.email}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
            <TextInput
              label="CONTACT NUMBER"
              value={client.accountInfo.contactNumber}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
          </SimpleGrid>
        </Stack>

        {/* Security */}
        <Stack gap="sm">
          <Text fw={600}>Security</Text>
          <SimpleGrid cols={2}>
            <TextInput
              label="USERNAME"
              value={client.accountInfo.username}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
            <Stack gap={4}>
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  PASSWORD
                </Text>
                <Text
                  size="sm"
                  c="jltOrange.5"
                  fs="italic"
                  style={{ cursor: "pointer" }}
                  onClick={() => alert("Generate new password placeholder")}
                >
                  Reset password
                </Text>
              </Group>
              <TextInput
                label=""
                value="••••••••••••"
                type="password"
                readOnly
                variant="filled"
              />
            </Stack>
          </SimpleGrid>
        </Stack>

        <Divider />

        {/* Company Information */}
        <Stack gap="sm">
          <Text fw={600}>Company Information</Text>
          <SimpleGrid cols={2}>
            <TextInput
              label="COMPANY"
              value={client.companyInfo.companyName}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
            <TextInput
              label="POSITION"
              value={client.companyInfo.position}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
          </SimpleGrid>
          <SimpleGrid cols={2} mt="md">
            <TextInput
              label="ADDRESS"
              value={client.companyInfo.companyAddress}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
            <TextInput
              label="BUSINESS TYPE"
              value={client.companyInfo.businessType}
              readOnly={readOnly}
              variant={readOnly ? "filled" : "default"}
            />
          </SimpleGrid>
        </Stack>

        <Divider />

        {/* Identification */}
        <Stack gap="sm">
          <Text fw={600}>ID (Verified)</Text>
          {client.identification.idImageUrl && (
            <img
              src={client.identification.idImageUrl}
              alt="ID"
              style={{ maxWidth: 200, borderRadius: 8 }}
            />
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
