import { Box, Text, Grid } from "@mantine/core";
import {
  Article,
  Person,
  LocalShipping,
  Inventory,
  Commit,
  Receipt,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { DetailCard } from "@/components/DetailCard";
import { DetailGrid } from "@/components/DetailGrid";
import type { JobOrderDetail } from "../../../types/jobOrderDetail";

type JobOrderDetailSectionsProps = {
  detail: JobOrderDetail;
  isRegulatory: boolean;
};

const em = "—"; // empty value placeholder

function formatDate(value?: string) {
  if (!value) return em;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatVolumeDimension(detail: JobOrderDetail) {
  const shipment = detail.shipment;
  if (!shipment) return em;
  const parts = [shipment.cargo_type, shipment.container_size].filter(Boolean);
  return parts.length ? parts.join(" - ") : em;
}

export function JobOrderDetailSections({
  detail,
  isRegulatory,
}: JobOrderDetailSectionsProps) {
  return (
    <>
      <DetailCard
        headerLeft={<Article width={20} height={20} />}
        title="JO Information"
        headerBg="#EFF0F4"
      >
        <Grid mb="lg" gutter="xl">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Box>
              <Text
                size="xs"
                c="dimmed"
                tt="uppercase"
                lts="0.06em"
                mb="0.25rem"
              >
                Subject
              </Text>
              <Text size="sm" tt="uppercase" c="var(--mantine-color-jltBlue-8)">
                {detail.subject || em}
              </Text>
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Box>
              <Text
                size="xs"
                c="dimmed"
                tt="uppercase"
                lts="0.06em"
                mb="0.25rem"
              >
                Date
              </Text>
              <Text size="sm" tt="uppercase" c="var(--mantine-color-jltBlue-8)">
                {formatDate(detail.date)}
              </Text>
            </Box>
          </Grid.Col>
        </Grid>

        <Box>
          <Text size="xs" c="dimmed" tt="uppercase" lts="0.06em" mb="0.5rem">
            Message
          </Text>
          <Text size="sm" style={{ whiteSpace: "pre-line" }}>
            {detail.email_body || em}
          </Text>
        </Box>
      </DetailCard>

      <DetailCard
        headerLeft={<Person width={20} height={20} />}
        title="Client Information"
        headerBg="#EFF0F4"
      >
        <DetailGrid
          rows={[
            {
              label: "Consignee",
              value: detail.client.consignee || em,
            },
            {
              label: "Client Type",
              value: detail.client.client_type || em,
            },
            {
              label: "Accredited",
              value: detail.client.accredited || em,
            },
            {
              label: "Shipper",
              value: detail.client.shipper || em,
            },
            {
              label: "Client Tone/Attitude",
              value: detail.client.tone_and_attitude || em,
            },
            {
              label: "Remarks on Handling Client",
              value: detail.client.remarks || em,
            },
          ]}
        />
      </DetailCard>

      <DetailCard
        headerLeft={<LocalShipping width={20} height={20} />}
        title="Service Information"
        headerBg="#EFF0F4"
      >
        <DetailGrid
          rows={[
            {
              label: "Service Level",
              value: detail.service?.service_level || em,
            },
            { label: "BL No.", value: detail.service?.bl_no || em },
            { label: "ETA", value: formatDate(detail.service?.eta) },
            { label: "ETD", value: formatDate(detail.service?.etd) },
          ]}
        />
      </DetailCard>

      {!isRegulatory && (
        <>
          <DetailCard
            headerLeft={<Inventory width={20} height={20} />}
            title="Shipment Information"
            headerBg="#EFF0F4"
          >
            <DetailGrid
              rows={[
                {
                  label: "Commodity",
                  value: detail.shipment?.commodity || em,
                },
                {
                  label: "Volume/Dimension",
                  value: formatVolumeDimension(detail),
                },
                {
                  label: "HS Code, As Verified by TWG:",
                  value: detail.shipment?.hs_code || em,
                },
                { label: "ROD", value: detail.shipment?.rod || em },
                {
                  label: "Permits Needed",
                  value: detail.shipment?.permits || em,
                },
                {
                  label: "If Coordinated:",
                  value: detail.shipment?.if_coordinated || em,
                },
                {
                  label: "Special Remarks",
                  value: detail.shipment?.special_remarks || em,
                },
              ]}
            />
          </DetailCard>

          <DetailCard
            headerLeft={<Commit width={20} height={20} />}
            title="Commitment Information"
            headerBg="#EFF0F4"
          >
            <DetailGrid
              rows={[
                {
                  label: "Target Delivery",
                  value: detail.target?.target_delivery_date || em,
                },
                {
                  label: "Target Completion Period",
                  value: detail.target?.target_completion_date || em,
                },
                {
                  label: "Special Remarks",
                  value: detail.target?.special_remarks || em,
                },
              ]}
            />
          </DetailCard>

          <DetailCard
            headerLeft={<Receipt width={20} height={20} />}
            title="Billing Information"
            headerBg="#EFF0F4"
          >
            <DetailGrid
              rows={[
                {
                  label: "Terms of Payment",
                  value: detail.billing_details?.terms_of_payment || em,
                },
                {
                  label: "When to Bill",
                  value: em,
                },
                {
                  label: "Shall Be Billed",
                  value: detail.billing_details?.shall_be_billed || em,
                },
                {
                  label: "Available Docs Attached",
                  value: em,
                },
              ]}
            />
          </DetailCard>
        </>
      )}
    </>
  );
}
