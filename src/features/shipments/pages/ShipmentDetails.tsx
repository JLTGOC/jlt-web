import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mantine/core";
import { useState } from "react";
import { PageCard } from "@/components/PageCard";
import { fetchShipment } from "@/features/shipments/services/shipments.service";
import { ReferenceHeader } from "@/features/shipments/components/details/ReferenceHeader";
import { StatusUpdate } from "@/features/shipments/components/details/StatusUpdate";
import { ShipmentFiles } from "@/features/shipments/components/details/ShipmentFiles";
import { ShipmentInformation } from "@/features/shipments/components/details/ShipmentInfo";
import { ConsigneeDetails } from "@/features/shipments/components/details/ConsigneeDetails";
import { Documents } from "@/features/shipments/components/details/Documents";
import { ShipmentHistory } from "@/features/shipments/components/details/ShipmentHistory";

interface ExpandedSections {
  shipment: boolean;
  consignee: boolean;
  documents: boolean;
  shipmentHistory: boolean;
}

export function ShipmentDetailsPage() {
  const { shipmentId } = useParams<{
    tab: string;
    clientId: string;
    shipmentId: string;
  }>();

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    shipment: false,
    consignee: false,
    documents: false,
    shipmentHistory: false,
  });

  const {
    data: shipment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shipment", shipmentId],
    queryFn: () => fetchShipment(shipmentId!),
    enabled: !!shipmentId,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    return (
      <PageCard title="Shipment Details" showDivider>
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--mantine-color-red-6)",
          }}
        >
          <p>Failed to load shipment details. Please try again.</p>
          <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </PageCard>
    );
  }

  if (!shipment) return <div>No shipment data available</div>;

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <PageCard 
      title="SHIPMENTS OVERVIEW"
      subtitle="View shipments details and tracking information"
      bgColor="transparent"
      shadow={false}
    >
      <Stack gap="lg">
        {/* Reference Header */}
        <div style={{ marginTop: "-1rem" }}>
          <ReferenceHeader shipment={shipment} />
        </div>

        {/* Status Update */}
        <StatusUpdate 
          shipment={shipment} 
          customMargins={{ 1: "200px", 2: "200px", 3: "200px", 4: "200px", 5: "200px" }}
        />

        {/* Shipment Files - Positioned absolutely to the right */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: '-25.6rem',
              right: '0',
              width: '400px',
              zIndex: 10
            }}
          >
            <ShipmentFiles shipment={shipment} />
          </div>
        </div>

        {/* Consignee Details */}
        <div style={{ marginTop: "-1rem" }}>
          <ConsigneeDetails
            shipment={shipment}
            expanded={expandedSections.consignee}
            onToggle={() => toggleSection("consignee")}
          />
        </div>

        {/* Shipment Information */}
        <ShipmentInformation
          shipment={shipment}
          expanded={expandedSections.shipment}
          onToggle={() => toggleSection("shipment")}
        />

        {/* Documents */}
        <Documents
          documents={[...(shipment?.documents ?? []), ...(shipment?.client_documents ?? [])]}
          expanded={expandedSections.documents}
          onToggle={() => toggleSection("documents")}
        />

        {/* Shipment History */}
        <ShipmentHistory
          shipment={shipment}
          expanded={expandedSections.shipmentHistory}
          onToggle={() => toggleSection("shipmentHistory")}
        />
      </Stack>
    </PageCard>
  );
}
