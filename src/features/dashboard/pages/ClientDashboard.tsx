import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import { isClientDashboard } from "../types/dashboard";
import type { User } from "@/types/api";
import { Loader } from "@mantine/core";

interface ClientDashboardProps {
  user: User;
}

export function ClientDashboard({ user }: ClientDashboardProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "client"],
    queryFn: () => dashboardService.getDashboardData(),
  });

  if (isLoading) {
    return <Loader size={"lg"} color="jltBlue" />;
  }

  if (error) {
    return (
      <div>
        <p>Failed to load dashboard</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data?.data || !isClientDashboard(data.data)) {
    return (
      <div>
        <p>Invalid dashboard data</p>
      </div>
    );
  }

  const dashboardData = data.data;

  return <div>Client Dashboard</div>;
}
