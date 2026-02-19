import { Center, Title, Text, Button, Stack } from "@mantine/core";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Center h="100vh">
      <Stack align="center">
        <Title order={1} size={100}>
          404
        </Title>
        <Text size="xl" c="dimmed">
          Page not found
        </Text>
        <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
      </Stack>
    </Center>
  );
}
