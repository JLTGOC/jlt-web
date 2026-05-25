import { notifications } from "@mantine/notifications";

type NotificationTone = "success" | "error" | "warning";

const TONE_CONFIG: Record<NotificationTone, { title: string; color: string }> =
  {
    success: { title: "Success", color: "teal" },
    error: { title: "Error", color: "red" },
    warning: { title: "Validation", color: "orange" },
  };

export const toolNotifications = {
  success(message: string) {
    const config = TONE_CONFIG.success;
    notifications.show({
      title: config.title,
      message,
      color: config.color,
    });
  },
  error(message: string) {
    const config = TONE_CONFIG.error;
    notifications.show({
      title: config.title,
      message,
      color: config.color,
    });
  },
  warning(message: string) {
    const config = TONE_CONFIG.warning;
    notifications.show({
      title: config.title,
      message,
      color: config.color,
    });
  },
};
