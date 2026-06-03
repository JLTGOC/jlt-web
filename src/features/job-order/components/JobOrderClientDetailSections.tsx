import {
  Accordion,
  ActionIcon,
  Anchor,
  Avatar,
  Grid,
  Stack,
  Text,
} from "@mantine/core";
import {
  Chat,
  Folder,
  History,
  Inventory,
  LocalShipping,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { DetailCard } from "@/components/DetailCard";
import { DetailGrid } from "@/components/DetailGrid";
import { JobOrderDocumentsSection } from "./JobOrderDocumentsSection";
import { JobOrderHistorySection } from "./JobOrderHistorySection";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import type { JobOrderDetail } from "../types/jobOrderDetail";
import { Link } from "react-router";

type JobOrderClientDetailSectionsProps = {
  detail: JobOrderDetail;
};

const em = "—";

export default function JobOrderClientDetailSections({
  detail,
}: JobOrderClientDetailSectionsProps) {
  const company = detail.company;
  const quotationId = detail.quotation_id;
  const consigneeRows = [
    {
      label: "Company Name",
      value: company?.name ?? detail.client.consignee ?? em,
    },
    { label: "Company Address", value: company?.address ?? em },
    { label: "Contact Person", value: company?.contact_person ?? em },
    { label: "Contact Number", value: company?.contact_number ?? em },
    { label: "Email Address", value: company?.email ?? em },
  ];

  const shipmentRows = [
    { label: "Service Type", value: detail.service?.service_type || em },
    { label: "Freight Transport Mode", value: detail.service?.type || em },
    { label: "Service", value: detail.service?.service_level || em },
    { label: "Commodity", value: detail.shipment?.commodity || em },
    {
      label: "Volume (Dimension)",
      value:
        [detail.shipment?.cargo_type, detail.shipment?.container_size]
          .filter(Boolean)
          .join(" - ") || em,
    },
    { label: "Origin", value: detail.shipment?.origin || em },
    { label: "Destination", value: detail.shipment?.destination || em },
    { label: "Details/Remarks", value: detail.shipment?.special_remarks || em },
  ];

  return (
    <Stack gap="lg">
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DetailCard
            headerLeft={
              <Avatar radius="xl" size="md" color="jltBlue">
                C
              </Avatar>
            }
            title={detail.client.full_name || "Client Name"}
            headerRight={
              <ActionIcon
                variant="subtle"
                color="jltBlue"
                aria-label="Open chat"
              >
                <Chat width={24} height={24} />
              </ActionIcon>
            }
            headerBg="#EFF0F4"
          >
            <DetailGrid
              rows={[
                {
                  label: "Company Name",
                  value: detail.client.company_name || em,
                },
                {
                  label: "Contact No.",
                  value: detail.client.contact_number || em,
                },
                { label: "Email", value: detail.client.email || em },
              ]}
            />
          </DetailCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DetailCard title=" " headerBg="#EFF0F4">
            <DetailGrid
              rows={[
                {
                  label: "Job Order",
                  value: detail.job_order?.reference_number ?? em,
                },
                {
                  label: "Quotation",
                  value:
                    quotationId && detail.reference_number ? (
                      <Anchor
                        component={Link}
                        to={quotationRoutes.viewer({
                          tab: "accepted",
                          quotationId: String(quotationId),
                        })}
                        underline="always"
                      >
                        {detail.reference_number}
                      </Anchor>
                    ) : (
                      detail.reference_number ?? em
                    ),
                },
                {
                  label: "PIC",
                  value: detail.job_order?.person_in_charge ?? em,
                },
              ]}
            />
          </DetailCard>
        </Grid.Col>
      </Grid>

      <Accordion variant="separated" radius="md">
        <Accordion.Item value="consignee">
          <Accordion.Control
            bg="#EFF0F4"
            icon={<Inventory width={18} height={18} />}
          >
            <Text
              fw={700}
              tt="uppercase"
              size="sm"
              c="var(--mantine-color-jltBlue-8)"
            >
              Consignee Details
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <DetailGrid rows={consigneeRows} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="shipment">
          <Accordion.Control
            bg="#EFF0F4"
            icon={<LocalShipping width={18} height={18} />}
          >
            <Text
              fw={700}
              tt="uppercase"
              size="sm"
              c="var(--mantine-color-jltBlue-8)"
            >
              Shipment Details
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <DetailGrid rows={shipmentRows} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="documents">
          <Accordion.Control
            bg="#EFF0F4"
            icon={<Folder width={18} height={18} />}
          >
            <Text
              fw={700}
              tt="uppercase"
              size="sm"
              c="var(--mantine-color-jltBlue-8)"
            >
              Documents
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <JobOrderDocumentsSection detail={detail} previewLimit={2} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="history">
          <Accordion.Control
            bg="#EFF0F4"
            icon={<History width={18} height={18} />}
          >
            <Text
              fw={700}
              tt="uppercase"
              size="sm"
              c="var(--mantine-color-jltBlue-8)"
            >
              History
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <JobOrderHistorySection detail={detail} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
