import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import { isMarketingDashboard } from "../types/dashboard";
import type { User } from "@/types/api";
import { Loader } from "@mantine/core";

interface MarketingDashboardProps {
  user: User;
}

export function MarketingDashboard({ user }: MarketingDashboardProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "marketing"],
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

  if (!data?.data || !isMarketingDashboard(data.data)) {
    return (
      <div>
        <p>Invalid dashboard data</p>
      </div>
    );
  }

  const dashboardData = data.data;

  return <div>Marketing Dashboard</div>;
}
