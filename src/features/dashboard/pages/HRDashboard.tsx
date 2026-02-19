import type { User } from "@/types/api";

interface HRDashboardProps {
  user: User;
}

export function HRDashboard({ user }: HRDashboardProps) {
  return <div>HR Dashboard</div>;
}
