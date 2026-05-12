import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack, Flex, Pagination, Card, Group, Box, Text } from "@mantine/core";
import { PageCard } from "@/components/PageCard";
import { fetchShipments } from "@/features/shipments/services/shipments.service";
import { ShipmentStatusTabs } from "./components/ShipmentStatusTabs";
import { ShipmentFilterTable } from "./components/ShipmentFilterTable";
import { ShipmentTable } from "./components/ShipmentTable";
import {
  SHIPMENT_STATUS_DESCRIPTIONS,
  SHIPMENT_STATUS_COLORS,
  type ShipmentStatus,
  type ShipmentsIndexResponse,
  type ShipmentListItem,
} from "@/features/shipments/types/shipments.types";

export function ShipmentList() {
  const navigate = useNavigate();

  const formatStatusLabel = (status: string) =>
    status
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Filter states
  const [activeStatus, setActiveStatus] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [eta, setEta] = useState("");
  const [shipmentType, setShipmentType] = useState("");
  const [personInCharge, setPersonInCharge] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "shipments",
      activeStatus,
      searchQuery,
      eta,
      shipmentType,
      personInCharge,
      perPage,
      currentPage,
    ],
    queryFn: () =>
      fetchShipments({
        search: searchQuery || undefined,
        perPage,
        status:
          activeStatus === "ALL"
            ? undefined
            : (activeStatus as ShipmentStatus),
        eta: eta || undefined,
        personInCharge: personInCharge || undefined,
      }),
  });

  const { data: allShipmentsData } = useQuery<ShipmentsIndexResponse>({
    queryKey: [
      "shipments",
      "statusCounts",
      searchQuery,
      eta,
      shipmentType,
      personInCharge,
    ],
    queryFn: () =>
      fetchShipments({
        search: searchQuery || undefined,
        perPage: 1000,
        eta: eta || undefined,
        personInCharge: personInCharge || undefined,
      }),
  });

  const rows = data?.shipments ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? rows.length;

  // Filter rows based on shipment type
  const filteredRows = rows.filter((row: ShipmentListItem) => {
    if (!shipmentType || shipmentType === "") return true; // Show all if no filter or "All Types"
    return row.service_type === shipmentType; // Filter by service_type
  });

  const allRows = allShipmentsData?.shipments ?? [];
  const statusCounts = allRows.reduce<Record<string, number>>((acc, row: ShipmentListItem) => {
    const statusKey = row.status?.toUpperCase() ?? "";
    if (!statusKey) return acc;

    acc[statusKey] = (acc[statusKey] ?? 0) + 1;
    return acc;
  }, {
    ALL: allRows.length,
    ...Object.fromEntries(
      Object.keys(SHIPMENT_STATUS_DESCRIPTIONS).map((key) => [key, 0] as const),
    ),
  });

  const handleReset = () => {
    setSearch("");
    setSearchQuery("");
    setEta("");
    setShipmentType("");
    setPersonInCharge("");
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleRowClick = (shipmentId: number) => {
    navigate(`/shipments/logistics/client/0/${shipmentId}`);
  };

  return (
    <Stack gap="lg">
      <PageCard title="LIST OF SHIPMENTS">
        <ShipmentStatusTabs
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          statusCounts={statusCounts}
        />

        <ShipmentFilterTable
          searchValue={search}
          onSearchChange={setSearch}
          onSearch={handleSearch}
          etaValue={eta}
          onEtaChange={setEta}
          shipmentTypeValue={shipmentType}
          onShipmentTypeChange={setShipmentType}
          personInChargeValue={personInCharge}
          onPersonInChargeChange={setPersonInCharge}
          onReset={handleReset}
          perPage={perPage}
          setPerPage={setPerPage}
          total={total}
        />

        <ShipmentTable
          rows={filteredRows}
          isLoading={isLoading || isFetching}
          total={total}
          showingCount={filteredRows.length}
          onRowClick={handleRowClick}
        />

        <Flex justify="flex-end" align="center" mt="md">
          {Math.ceil(total / perPage) > 1 && (
            <Pagination
              value={currentPage}
              onChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              total={Math.ceil(total / perPage)}
              size="sm"
            />
          )}
        </Flex>
      </PageCard>

      <PageCard>
        <Card
          withBorder
          radius="md"
          p={0}
          mt={0}
          shadow="none"
          style={{
            backgroundColor: "#fff",
            border: "none",
            width: "100%",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Group gap="lg" wrap="wrap">
            {Object.entries(SHIPMENT_STATUS_DESCRIPTIONS).map(
              ([status, description], index, arr) => (
                <Group key={status} gap="sm" align="flex-start">
                  <Group gap="sm" align="flex-start">
                    <Box
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: SHIPMENT_STATUS_COLORS[status] || "#999",
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                    <div>
                      <Text fz="0.85rem" fw={600} c="#2c3f55">
                        {formatStatusLabel(status)}
                      </Text>
                      <Text fz="0.8rem" c="#7a808a">
                        {description}
                      </Text>
                    </div>
                  </Group>
                  {index < arr.length - 1 && (
                    <Text fz="1rem" c="#e2e6eb" fw={700} mx="sm">
                      |
                    </Text>
                  )}
                </Group>
              )
            )}
          </Group>
        </Card>
      </PageCard>
    </Stack>
  );
}
