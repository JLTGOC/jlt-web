import { useAuthStore } from "@/stores/authStore";
import { toUser, getUserRole } from "@/lib/mappers/user.mapper";
import { ROLES } from "@/types/roles";
import AccountSpecialistDashboard from "@/features/dashboard/pages/AccountSpecialistDashboard";
import OperationsDashboard from "@/features/dashboard/pages/OperationsDashboard";
import ClientDashboard from "@/features/dashboard/pages/ClientDashboard";
import ClientSuccessDashboard from "@/features/dashboard/pages/ClientSuccessDashBoard";
// import { MarketingDashboard } from "@/features/dashboard/pages/MarketingDashboard";
// import { HRDashboard } from "@/features/dashboard/pages/HRDashboard";

/**
 * Main Dashboard Page
 *
 * Routes to role-specific dashboard based on user's role
 */
export default function DashboardPage() {
  const userResource = useAuthStore((state) => state.user);

  if (!userResource) {
    return (
      <div>
        <div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  const user = toUser(userResource);
  const role = getUserRole(user);

  // Route to appropriate dashboard based on role
  switch (role) {
    case ROLES.CLIENT:
      return <ClientDashboard />;

    case ROLES.ACCOUNT_SPECIALIST:
      return <AccountSpecialistDashboard />;

    case ROLES.LEAD_ACCOUNT_SPECIALIST:
      return <AccountSpecialistDashboard />;

     case ROLES.LEAD_OPERATIONS:
      return <ClientSuccessDashboard />;
    
      case ROLES.OPERATIONS:
      return <ClientSuccessDashboard />;

      case ROLES.LEAD_CLIENT_SUCCESS:
      return <OperationsDashboard />;
    
      case ROLES.CLIENT_SUCCESS:
      return <OperationsDashboard />;

    case ROLES.MARKETING:
      return <h1>Marketing Dashboard</h1>;

    case ROLES.HUMAN_RESOURCE:
      return <h1>HR Dashboard</h1>;

    default:
      return (
        <div>
          <div>
            <h2>Unknown Role</h2>
            <p>Your role "{role}" doesn't have a dashboard configured.</p>
          </div>
        </div>
      );
  }
}
