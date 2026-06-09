import { useNavigate } from "react-router";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth.service";
import LoginForm from "@/features/auth/components/LoginForm";
import { useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "@/types/api";
import { Box, Image } from "@mantine/core";
import jlt from "@/assets/jlt.svg";

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
    <div
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "flex-end",
        paddingTop: "25vh",
        paddingRight: "15rem",
      }}
    >
      <Image src={jlt} w="30%" pos="absolute" bottom={0} top={120} left={130} />
    
      <Box>
        <LoginForm onSubmit={handleSubmit} isLoading={isPending} />
      </Box>
    </div>
  );
}
