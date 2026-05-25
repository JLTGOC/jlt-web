import { Stack } from "@mantine/core";
import SocialMediaCards from "../components/SocialMediaCards";
import StatsOverview from "../components/StatsOverview";
import ClientsTable from "../components/ClientsTable";
import { useAccountSpecialistDashboard } from "../hooks/useAccountSpecialistDashboard";

export default function ClientSuccessDashboard() {
    const { quotations, shipments, clients, clientsTotalCount } =
        useAccountSpecialistDashboard();
    
      return (
        <Stack gap={"1rem"} px={"lg"}>
          <SocialMediaCards />
    
          <StatsOverview quotations={quotations} shipments={shipments} />
    
          <ClientsTable clients={clients} totalCount={clientsTotalCount} />
        </Stack>
      );
}