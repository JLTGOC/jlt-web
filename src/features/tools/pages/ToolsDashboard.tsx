import { useState } from "react";
import { useNavigate } from "react-router";
import { SimpleGrid } from "@mantine/core";
import { TOOL_ITEMS } from "../config/toolsConfig";
import { useAuthStore } from "@/stores/authStore";
import { toUser, hasRole } from "@/lib/mappers/user.mapper";
import { ToolDashboardTile } from "../components/ToolDashboardTile";
import ServiceTypeModal from "../components/planning-timeline/modals/ServiceType";

export function ToolsDashboard() {
  const navigate = useNavigate();
  const [isServiceTypeModalOpen, setIsServiceTypeModalOpen] = useState(false);
  const userResource = useAuthStore((state) => state.user);
  const user = userResource ? toUser(userResource) : null;

  // Filter tools by role if allowedRoles is specified
  const visibleTools = TOOL_ITEMS.filter((tool) => {
    if (!tool.allowedRoles || !user) return true;
    return tool.allowedRoles.some((role) => hasRole(user, role));
  });

  return (
    <>
      <SimpleGrid spacing={"xs"} cols={{ base: 1, sm: 2, lg: 4, xl: 5 }}>
        {visibleTools.map((tool) => (
          <ToolDashboardTile
            key={tool.id}
            icon={tool.icon}
            label={tool.label}
            description={tool.description}
            onClick={() => {
              if (tool.id === "planning-timeline") {
                setIsServiceTypeModalOpen(true);
                return;
              }

              navigate(tool.path);
            }}
          />
        ))}
      </SimpleGrid>
      <ServiceTypeModal
        opened={isServiceTypeModalOpen}
        onClose={() => setIsServiceTypeModalOpen(false)}
      />
    </>
  );
}
