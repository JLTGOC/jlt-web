import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/loginSchema";
import { TextInputField, PasswordInputField } from "@/components/form";
import { Button, Box, Stack, Title, Text, Image } from "@mantine/core";

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void;
  isLoading?: boolean;
};

export default function LoginForm({
  onSubmit,
  isLoading = false,
}: LoginFormProps) {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Stack gap="lg" w={450}>
      <Title ta="center" c="jltOrange.5">
        LOGIN
      </Title>
      <Box
        py={12}
        pl={12}
        style={(theme) => ({
          boxShadow: `inset 5px 0 0 ${theme.colors.jltOrange[5]}`,
        })}
      >
        <Text
          size="1.6875rem"
          c="jltBlue"
          ta="right"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          Welcome back you’ve been missed!
        </Text>
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap="md" align="stretch">
          <TextInputField
            control={control}
            name="email"
            placeholder="USERNAME"
            type="email"
            required
            size="lg"
          />

          <PasswordInputField
            control={control}
            name="password"
            placeholder="PASSWORD"
            required
            size="lg"
          />

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            mt="sm"
            radius="sm"
            size="lg"
            style={{
              boxShadow: "0 4px 4px #BEBEBE",
            }}
          >
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
