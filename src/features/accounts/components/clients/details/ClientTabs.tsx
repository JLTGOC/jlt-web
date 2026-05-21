// src/features/accounts/components/clients/ClientTabs.tsx
import { Paper, Tabs, Table } from "@mantine/core";
import classes from "./ClientTabs.module.css";
import type { ClientDetails } from "@/features/accounts/types/accounts.types";

interface ClientTablesProps {
  client: ClientDetails;
}

export function ClientTables({ client }: ClientTablesProps) {
  const quotations = Array.isArray(client.quotations) ? client.quotations : [];
  const shipments = Array.isArray(client.shipments) ? client.shipments : [];
  const regulatory = Array.isArray(client.regulatory) ? client.regulatory : [];

  return (
    <Paper shadow="sm" radius="md" p="md">
      <Tabs defaultValue="quotations" variant="unstyled" classNames={{ list: classes.tabsList, tab: classes.tab }}>
        <Tabs.List grow>
          <Tabs.Tab value="quotations">
            <div className={classes.tabContent}>
              <div className={classes.tabText}>
                <span className={classes.tabTitle}>Quotations</span>
                <span className={classes.tabSubtitle}>All client quotations</span>
              </div>
            </div>
          </Tabs.Tab>

          <Tabs.Tab value="shipments">
            <div className={classes.tabContent}>
              <div className={classes.tabText}>
                <span className={classes.tabTitle}>Shipments</span>
                <span className={classes.tabSubtitle}>All client shipments</span>
              </div>
            </div>
          </Tabs.Tab>

          <Tabs.Tab value="regulatory">
            <div className={classes.tabContent}>
              <div className={classes.tabText}>
                <span className={classes.tabTitle}>Regulatory</span>
                <span className={classes.tabSubtitle}>All regulatory cases</span>
              </div>
            </div>
          </Tabs.Tab>

          <Tabs.Tab value="billing">
            <div className={classes.tabContent}>
              <div className={classes.tabText}>
                <span className={classes.tabTitle}>Billing & Invoice</span>
                <span className={classes.tabSubtitle}>Invoices and billing</span>
              </div>
            </div>
          </Tabs.Tab>
        </Tabs.List>

        {/* Quotations Tab */}
        <Tabs.Panel value="quotations" pt="md">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Quotation #</Table.Th>
                <Table.Th>Service Type</Table.Th>
                <Table.Th>Date Quoted</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {quotations.map((q) => (
                <Table.Tr key={q.quotationNumber}>
                  <Table.Td>{q.quotationNumber}</Table.Td>
                  <Table.Td>{q.serviceType}</Table.Td>
                  <Table.Td>{q.dateQuoted}</Table.Td>
                  <Table.Td>{q.status}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>

        {/* Shipments Tab */}
        <Tabs.Panel value="shipments" pt="md">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Reference #</Table.Th>
                <Table.Th>BL #</Table.Th>
                <Table.Th>Origin</Table.Th>
                <Table.Th>Destination</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {shipments.map((s) => (
                <Table.Tr key={s.referenceNumber}>
                  <Table.Td>{s.referenceNumber}</Table.Td>
                  <Table.Td>{s.blNumber}</Table.Td>
                  <Table.Td>{s.origin}</Table.Td>
                  <Table.Td>{s.destination}</Table.Td>
                  <Table.Td>{s.status}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>

        {/* Regulatory Tab */}
        <Tabs.Panel value="regulatory" pt="md">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Regulatory #</Table.Th>
                <Table.Th>Application Type</Table.Th>
                <Table.Th>Issue Date</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {regulatory.map((r) => (
                <Table.Tr key={r.regulatoryNumber}>
                  <Table.Td>{r.regulatoryNumber}</Table.Td>
                  <Table.Td>{r.applicationType}</Table.Td>
                  <Table.Td>{r.issueDate}</Table.Td>
                  <Table.Td>{r.status}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>

        {/* Billing & Invoice Tab */}
        <Tabs.Panel value="billing" pt="md">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Invoice #</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {/* Placeholder until billing type is defined */}
              <Table.Tr>
                <Table.Td>INV-001</Table.Td>
                <Table.Td>2026-05-17</Table.Td>
                <Table.Td>$1200</Table.Td>
                <Table.Td>Paid</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}
