import { RoleGuard } from "@/components/guards/RoleGuard";
import { ROLES } from "@/types/roles";
import { QuotationsRequested } from "@/features/quotations/pages/requested/QuotationsRequested";
import JobOrderListPage from "@/features/job-order/pages/account-specialist/JobOrderListPage";

/**
 * JobOrders Page
 *
 * Routes different job order types based on user role:
 * - Operations: Operational job orders
 * - Lead Account Specialist: Account specialist job orders
 */
export default function JobOrdersPage() {
  return (
    <>
      {/* Operations role */}
      <RoleGuard allowedRoles={[ROLES.OPERATIONS]} fallback={<></>}>
        <div>Operational Job Orders View</div>
        <QuotationsRequested />
      </RoleGuard>

      {/* Lead Account Specialist role */}
      <RoleGuard
        allowedRoles={[ROLES.LEAD_ACCOUNT_SPECIALIST]}
        fallback={<></>}
      >
        <JobOrderListPage />
      </RoleGuard>
    </>
  );
}
