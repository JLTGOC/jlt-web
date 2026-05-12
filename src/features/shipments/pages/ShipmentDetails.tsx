import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Box, Group, Stack } from "@mantine/core";
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
        <Group align="flex-start" gap="lg" wrap="wrap" style={{ width: "100%" }}>
          <Box style={{ flex: "1 1 680px", minWidth: 0 }}>
            <ReferenceHeader shipment={shipment} />
            <Box mt="md">
              <StatusUpdate shipment={shipment} />
            </Box>
          </Box>

          <Box style={{ flex: "0 0 min(360px, 100%)", minWidth: 320, width: "100%" }}>
            <ShipmentFiles shipment={shipment} />
          </Box>
        </Group>

        {/* Consignee Details */}
        <div style={{}}>
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
