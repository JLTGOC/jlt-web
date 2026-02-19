import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import { isAccountSpecialistDashboard } from "../types/dashboard";
import type { User } from "@/types/api";
import { Loader } from "@mantine/core";

interface AccountSpecialistDashboardProps {
  user: User;
}

export function AccountSpecialistDashboard({
  user,
}: AccountSpecialistDashboardProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "account-specialist"],
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

  if (!data?.data || !isAccountSpecialistDashboard(data.data)) {
    return <div>Invalid dashboard data</div>;
  }

  const dashboardData = data.data;

  return <div>Account specialist dashboard</div>;
}
