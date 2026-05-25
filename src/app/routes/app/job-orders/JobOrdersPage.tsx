import { RoleGuard } from "@/components/guards/RoleGuard";
import { ROLES } from "@/types/roles";
import ASJobOrderListPage from "@/features/job-order/pages/account-specialist/JobOrderListPage";
import OPSJobOrderListPage from "@/features/job-order/pages/operations/JobOrderListPage";
import CSJobOrderListPage from "@/features/job-order/pages/client-success/JobOrderListPage";
import JobOrderDetailPage from "@/features/job-order/pages/shared/JobOrderDetailPage";
import { useParams } from "react-router";

/**
 * JobOrders Page
 *
 * Routes different job order types based on user role:
 * - Operations: Operational job orders
 * - Lead Account Specialist: Account specialist job orders
 */
export default function JobOrdersPage() {
  const { jobOrderId } = useParams<{ jobOrderId?: string }>();

  if (jobOrderId) {
    return (
      <RoleGuard
        allowedRoles={[
          ROLES.LEAD_OPERATIONS,
          ROLES.OPERATIONS,
          ROLES.CLIENT_SUCCESS,
          ROLES.LEAD_ACCOUNT_SPECIALIST,
        ]}
        fallback={<></>}
      >
        <JobOrderDetailPage />
      </RoleGuard>
    );
  }

  return (
    <>
      {/* Operations role */}
      <RoleGuard
        allowedRoles={[ROLES.LEAD_OPERATIONS, ROLES.OPERATIONS]}
        fallback={<></>}
      >
        <OPSJobOrderListPage />
      </RoleGuard>

      {/* Lead Account Specialist role */}
      <RoleGuard
        allowedRoles={[ROLES.LEAD_ACCOUNT_SPECIALIST]}
        fallback={<></>}
      >
        <ASJobOrderListPage />
      </RoleGuard>

       {/* CLient Success role */}
      <RoleGuard
        allowedRoles={[ROLES.CLIENT_SUCCESS]}
        fallback={<></>}
      >
        <CSJobOrderListPage />
      </RoleGuard>
    </>
  );
}
