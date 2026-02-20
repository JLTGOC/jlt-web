import { useNavigate } from "react-router";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth.service";
import LoginForm from "@/features/auth/components/LoginForm";
import { useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "@/types/api";
import { Box, Image } from "@mantine/core";
import bgImage from "@/assets/bgImage.png";
import wave1 from "@/assets/wave1.svg?url";
import wave2 from "@/assets/wave2.svg?url";
import wave3 from "@/assets/wave3.svg?url";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      login(response.data.user, response.data.token);
      navigate("/", { replace: true });
    },
    onError: () => {
      notifications.show({
        title: "Login failed",
        message: "Invalid email or password. Please try again.",
        color: "red",
      });
    },
  });

  function handleSubmit(values: LoginRequest) {
    mutate(values);
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
      }}
    >
      <Image
        src={bgImage}
        w={{ base: "45%", lg: 636 }}
        pos="absolute"
        bottom={0}
      />
      <Image src={wave1} w={"71.4%"} pos="absolute" bottom={0} />
      <Image src={wave2} w={"64.5%"} pos="absolute" bottom={0} left={-10} />
      <Image
        src={wave3}
        w={"38.1%"}
        pos="absolute"
        bottom={0}
        right={0}
        style={{ zIndex: -1 }}
      />
      <Box pos="absolute" top={"19.35%"} left={"47.66%"}>
        <LoginForm onSubmit={handleSubmit} isLoading={isPending} />
      </Box>
    </div>
  );
}
