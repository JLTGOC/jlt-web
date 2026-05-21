// src/features/accounts/components/companies/CompaniesList.tsx
import { Paper, Stack, Text } from "@mantine/core";

export function CompaniesList() {
  // Temporary mock data
  const companies = [
    {
      id: 1,
      name: "JLT Global Trade & Business Solutions Corporation",
      address: "123 Business Park, Angeles City",
      businessType: "Logistics",
    },
    {
      id: 2,
      name: "Default Co",
      address: "N/A",
      businessType: "General",
    },
    {
      id: 3,
      name: "Acme Manufacturing",
      address: "456 Industrial Zone, Clark",
      businessType: "Manufacturing",
    },
  ];

  return (
    <Stack>
      {companies.map((company) => (
        <Paper
          key={company.id}
          shadow="xs"
          radius="md"
          p="md"
          withBorder
        >
          <Text fw={600} size="lg">
            {company.name}
          </Text>
          <Text size="sm" c="dimmed">
            Address: {company.address}
          </Text>
          <Text size="sm" c="dimmed">
            Business Type: {company.businessType}
          </Text>
        </Paper>
      ))}
    </Stack>
  );
}
