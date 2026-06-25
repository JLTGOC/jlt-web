import * as z from "zod";
import { Button, Box, Stack, Title, Text } from "@mantine/core";
import {
  TextInputField,
  PasswordInputField,
} from "@/components/form/textFields";
import { Person, Lock } from "@nine-thirty-five/material-symbols-react/rounded";
import { loginSchema } from "@/features/auth/schemas/loginSchema";
import type { FormEventHandler } from "react";
import type { Control } from "react-hook-form";

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormViewProps {
  control: Control<LoginFormValues>;
  isLoading: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function LoginFormView({
  control,
  isLoading,
  onSubmit,
}: LoginFormViewProps) {
  return (
    <Stack gap={0}>
      {/* Header */}
      <Box>
        <Title ta="center" c="black" fz={"1.875rem"} fw={600}>
          Welcome to JLT!
        </Title>
        <Text
          fz="0.938rem"
          c="#828282"
          ta="center"
          style={{ whiteSpace: "nowrap" }}
        >
          Please sign-in to access your account
        </Text>
      </Box>

      {/* Form */}
      <form onSubmit={onSubmit} noValidate>
        <Stack gap="md" align="stretch" pt={10} c={"#1D274E"}>
          <TextInputField
            control={control}
            name="email"
            label="Username"
            leftSection={<Person />}
            placeholder="Username or Email"
            type="text"
            required
            size="lg"
          />

          <PasswordInputField
            control={control}
            name="password"
            label="Password"
            leftSection={<Lock />}
            placeholder="Password"
            required
            size="lg"
          />

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            mt="sm"
            radius="sm"
            size="md"
            fw="400"
            pt={5}
            style={{ boxShadow: "0 4px 4px #BEBEBE" }}
          >
            SIGN IN
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
