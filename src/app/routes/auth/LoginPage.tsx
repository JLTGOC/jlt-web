import { useNavigate } from "react-router";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth.service";
import LoginForm from "@/features/auth/components/LoginForm";
import { useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "@/types/api";
import {
  Box,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Group,
  Center,
} from "@mantine/core";
import jlt from "@/assets/logos/jlt-dark.webp";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      login(response.data.user);
      navigate("/", { replace: true });
    },
    onError: () => {
      notifications.show({
        title: "Login failed",
        message: "Invalid username/email or password. Please try again.",
        color: "red",
      });
    },
  });

  function handleSubmit(values: LoginRequest) {
    mutate(values);
  }

  return (
    <SimpleGrid cols={2} h="100vh" p="1.75rem">
      <Box pos="relative">
        {/* Logo */}
        <Group gap="md" align="center">
          <Image src={jlt} h={76} w="auto" fit="contain" />

          <Stack gap={0}>
            <Text fw={700} fz="1.75rem" lh={1} tt="uppercase">
              Jill L. Tolentino
            </Text>

            <Text
              fz="0.875rem"
              fw={500}
              tt="uppercase"
              style={{ letterSpacing: "0.35em" }}
            >
              Group of Companies
            </Text>
          </Stack>
        </Group>

        {/* Form */}
        <Center mt={150}>
          <Box w="27.438rem">
            <LoginForm onSubmit={handleSubmit} isLoading={isPending} />
          </Box>
        </Center>
      </Box>

      <Box
        bg={"blue"}
        style={{
          borderRadius: "1.5rem",
          boxShadow: "4px 0px 11px rgba(79, 97, 116, 0.59)",
          overflow: "hidden",
        }}
      >
        {/* Right side carousel */}
      </Box>
    </SimpleGrid>
  );
}
