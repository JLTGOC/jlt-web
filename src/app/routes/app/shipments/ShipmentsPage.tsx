import { Navigate, useParams } from "react-router";
import { ShipmentLogistics } from "@/features/shipments/components/Logistics/ShipmentLogistics";
import { ShipmentRegulatory } from "@/features/shipments/components/Regulatory/ShipmentRegulatory";
import { PlanningTimelineUnderConstruction } from "@/features/shipments/pages/logistics/PlanningTimelineUnderConstruction";

export default function ShipmentsPage() {
  const { category, subCategory } = useParams();

  // Default route: /shipments -> redirect to /shipments/logistics
  if (!category) {
    return <Navigate to="/shipments/logistics" replace />;
  }

  // Logistics routes
  if (category === "logistics") {
    if (subCategory === "planning-timeline") {
      return <PlanningTimelineUnderConstruction />;
    }
    return <ShipmentLogistics />;
  }

  // Regulatory routes
  if (category === "regulatory") {
    return <ShipmentRegulatory />;
  }

  return <Navigate to="/shipments/logistics" replace />;
}
