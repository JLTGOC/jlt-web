import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, Stack, Divider, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { PasswordInputField } from "@/components/form/textFields";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas/accountSettings.schema";
import { accountSettingsService } from "../services/accountSettings.service";
import { CheckCircle } from "@nine-thirty-five/material-symbols-react/outlined";
interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
  userId: number;
}

export function ChangePasswordModal({
  opened,
  onClose,
  userId,
}: ChangePasswordModalProps) {
  const [succeeded, setSucceeded] = useState(false);

  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const changeMutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      accountSettingsService.changePassword(userId, values),
    onSuccess: () => {
      setSucceeded(true);
    },
    onError: () => {
      notifications.show({
        title: "Failed",
        message: "Incorrect current password or server error.",
        color: "red",
      });
    },
  });

  function handleClose() {
    reset();
    setSucceeded(false);
    onClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={!succeeded ? "CHANGE PASSWORD" : undefined}
      centered
      size="sm"
      withCloseButton={!succeeded}
      styles={{
        title: { width: "100%", textAlign: "center", fontWeight: 500 },
      }}
    >
      {succeeded ? (
        <Stack align="center" gap="sm" py="md">
          <Text fw={500} size="lg" ta="center">
            CHANGE PASSWORD
          </Text>
          <Divider w="100%" />

          <CheckCircle width={"5rem"} height={"5rem"} color="green" />

          <Text fw={500} size="lg">
            Password Updated!
          </Text>
          <Text size="sm" c="dimmed" ta="center" maw={322}>
            Your password has been changed successfully. Use your new password
            to log in.
          </Text>

          <Button mt="lg" w={"7.688rem"} h={"2.625rem"} onClick={handleClose}>
            OKAY
          </Button>
        </Stack>
      ) : (
        <form
          onSubmit={handleSubmit((v) => changeMutation.mutate(v))}
          autoComplete="off"
        >
          <Stack gap="sm">
            <Divider mb="xs" />

            <PasswordInputField
              control={control}
              name="current_password"
              label="Current Password"
              autoComplete="current-password"
            />
            <PasswordInputField
              control={control}
              name="new_password"
              label="New Password"
              autoComplete="new-password"
            />
            <PasswordInputField
              control={control}
              name="new_password_confirmation"
              label="Confirm New Password"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              loading={changeMutation.isPending}
              mt="md"
              w={"13rem"}
              h={"2.625rem"}
              fz={"0.938rem"}
              style={{ alignSelf: "center" }}
              color="jltAccent.6"
            >
              UPDATE PASSWORD
            </Button>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
