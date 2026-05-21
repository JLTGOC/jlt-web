import { useNavigate } from "react-router";
import { Group } from "@mantine/core";
import { FolderButton } from "@/components/FolderButton";
import { TOOL_ITEMS } from "../config/toolsConfig";
import { useAuthStore } from "@/stores/authStore";
import { toUser, hasRole } from "@/lib/mappers/user.mapper";

export function ToolsDashboard() {
  const navigate = useNavigate();
  const userResource = useAuthStore((state) => state.user);
  const user = userResource ? toUser(userResource) : null;

  // Filter tools by role if allowedRoles is specified
  const visibleTools = TOOL_ITEMS.filter((tool) => {
    if (!tool.allowedRoles || !user) return true;
    return tool.allowedRoles.some((role) => hasRole(user, role));
  });

  return (
    <Group gap={"md"}>
      {visibleTools.map((tool) => (
        <FolderButton
          key={tool.id}
          icon={tool.icon}
          label={tool.label}
          description={tool.description}
          onClick={() => navigate(tool.path)}
        />
      ))}
    </Group>
  );
}
