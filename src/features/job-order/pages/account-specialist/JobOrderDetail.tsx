import {
  Box,
  Stack,
  Text,
  Group,
  Anchor,
  Grid,
  UnstyledButton,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import {
  Article,
  Person,
  LocalShipping,
  Inventory,
  ArrowBack,
  Commit,
  Receipt,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { DetailCard } from "@/components/DetailCard";
import { DetailGrid } from "@/components/DetailGrid";
import type { JobOrderDetail } from "../../types/jobOrderDetail";

// ─── Mock data ────────────────────────────────────────────────────────────────
// Replace with API call / react-query hook

const MOCK_DETAIL: JobOrderDetail = {
  id: 1,
  reference_number: "SJO-04-2026-013",
  quotation_reference: "QT-09-2026-052",
  quotation_id: "QT-09-2026-052",

  jo_information: {
    subject: "Pre-Alert Incoming-23",
    date: "2026-04-27",
    message:
      "Hi operations team,\nPlease see the Pre-Alert shipment Details below for the reference and processing",
  },

  client_information: {
    consignee: "ZESTO",
    client_type: "NEW",
    accredited: "EXPEDITED",
    shipper: "JENNY CARLA DELA CRUZ",
    client_tone:
      "Requires timely updates and fast results. All changes incurred shall be notified to the AS",
    remarks_on_handling: "Please provide consistent updates.",
  },

  service_information: {
    service_level: "CARGO CONSOLIDATION (CC)",
    bl_no: "AMP012863",
    eta: "2026-02-25",
    etd: "2026-05-25",
  },

  shipment_information: {
    commodity: "CASTABLE REFRACTOR 16",
    volume_dimension: "CONTAINERIZED - 1X20",
    hs_code: undefined,
    rod: undefined,
    permits_needed: undefined,
    if_coordinated: undefined,
    special_remarks: undefined,
  },

  commitment_information: {
    target_delivery: "2-3 days after arrival",
    target_completion_period: undefined,
    special_remarks: undefined,
  },

  billing_information: {
    terms_of_payment: "AS AGREED",
    when_to_bill: undefined,
    shall_be_billed: "AS PER QUOTE",
    available_docs_attached: undefined,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const em = "—"; // empty value placeholder

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobOrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const detail = MOCK_DETAIL;

  return (
    <Stack gap="lg" p="lg">
      {/* ── Page header ── */}
      <Group justify="space-between" align="flex-start">
        {/* Left: back + title */}
        <Group>
          <UnstyledButton onClick={() => navigate(-1)} c="jltBlue">
            <ArrowBack width={24} height={24} />
          </UnstyledButton>
          <Box>
            <Text
              size="1.125rem"
              fw={700}
              c="var(--mantine-color-jltBlue-9)"
              lh={1.1}
            >
              {detail.reference_number}
            </Text>
            <Text
              size="sm"
              c="dimmed"
              tt="uppercase"
              lts="0.06em"
              mt="0.125rem"
            >
              Job Order
            </Text>
          </Box>
        </Group>

        {/* Right: accepted quotation chip */}
        {detail.quotation_reference && (
          <Box
            p="0.75rem 1rem"
            style={{
              border: "1px solid var(--mantine-color-gray-3)",
              borderRadius: "0.5rem",
              textAlign: "right",
              minWidth: "12rem",
              backgroundColor: "#fff",
            }}
          >
            <Text size="xs" c="dimmed" tt="uppercase" lts="0.06em" mb="0.25rem">
              From Accepted Quotation
            </Text>
            <Anchor
              href={`/quotations/accepted/${detail.quotation_id}`}
              fw={600}
              size="sm"
            >
              {detail.quotation_reference}
            </Anchor>
          </Box>
        )}
      </Group>

      {/* ── JO Information ── */}
      <DetailCard
        headerLeft={<Article width={20} height={20} />}
        title="JO Information"
        headerBg="#EFF0F4"
      >
        {/* Subject + Date side by side */}
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
                {detail.jo_information.subject || em}
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
                {formatDate(detail.jo_information.date)}
              </Text>
            </Box>
          </Grid.Col>
        </Grid>

        {/* Message */}
        <Box>
          <Text size="xs" c="dimmed" tt="uppercase" lts="0.06em" mb="0.5rem">
            Message
          </Text>
          <Text size="sm" style={{ whiteSpace: "pre-line" }}>
            {detail.jo_information.message || em}
          </Text>
        </Box>
      </DetailCard>

      {/* ── Client Information ── */}
      <DetailCard
        headerLeft={<Person width={20} height={20} />}
        title="Client Information"
        headerBg="#EFF0F4"
      >
        <DetailGrid
          rows={[
            {
              label: "Consignee",
              value: detail.client_information.consignee || em,
            },
            {
              label: "Client Type",
              value: detail.client_information.client_type || em,
            },
            {
              label: "Accredited",
              value: detail.client_information.accredited || em,
            },
            {
              label: "Shipper",
              value: detail.client_information.shipper || em,
            },
            {
              label: "Client Tone/Attitude",
              value: detail.client_information.client_tone || em,
            },
            {
              label: "Remarks on Handling Client",
              value: detail.client_information.remarks_on_handling || em,
            },
          ]}
        />
      </DetailCard>

      {/* ── Service Information ── */}
      <DetailCard
        headerLeft={<LocalShipping width={20} height={20} />}
        title="Service Information"
        headerBg="#EFF0F4"
      >
        <DetailGrid
          rows={[
            {
              label: "Service Level",
              value: detail.service_information.service_level || em,
            },
            { label: "BL No.", value: detail.service_information.bl_no || em },
            { label: "ETA", value: formatDate(detail.service_information.eta) },
            { label: "ETD", value: formatDate(detail.service_information.etd) },
          ]}
        />
      </DetailCard>

      {/* ── Shipment Information ── */}
      <DetailCard
        headerLeft={<Inventory width={20} height={20} />}
        title="Shipment Information"
        headerBg="#EFF0F4"
      >
        <DetailGrid
          rows={[
            {
              label: "Commodity",
              value: detail.shipment_information.commodity || em,
            },
            {
              label: "Volume/Dimension",
              value: detail.shipment_information.volume_dimension || em,
            },
            {
              label: "HS Code, As Verified by TWG:",
              value: detail.shipment_information.hs_code || em,
            },
            { label: "ROD", value: detail.shipment_information.rod || em },
            {
              label: "Permits Needed",
              value: detail.shipment_information.permits_needed || em,
            },
            {
              label: "If Coordinated:",
              value: detail.shipment_information.if_coordinated || em,
            },
            {
              label: "Special Remarks",
              value: detail.shipment_information.special_remarks || em,
            },
          ]}
        />
      </DetailCard>

      {/* ── Commitment Information ── */}
      <DetailCard
        headerLeft={<Commit width={20} height={20} />}
        title="Commitment Information"
        headerBg="#EFF0F4"
      >
        <DetailGrid
          rows={[
            {
              label: "Target Delivery",
              value: detail.commitment_information.target_delivery || em,
            },
            {
              label: "Target Completion Period",
              value:
                detail.commitment_information.target_completion_period || em,
            },
            {
              label: "Special Remarks",
              value: detail.commitment_information.special_remarks || em,
            },
          ]}
        />
      </DetailCard>

      {/* ── Billing Information ── */}
      <DetailCard
        headerLeft={<Receipt width={20} height={20} />}
        title="Billing Information"
        headerBg="#EFF0F4"
      >
        <DetailGrid
          rows={[
            {
              label: "Terms of Payment",
              value: detail.billing_information.terms_of_payment || em,
            },
            {
              label: "When to Bill",
              value: detail.billing_information.when_to_bill || em,
            },
            {
              label: "Shall Be Billed",
              value: detail.billing_information.shall_be_billed || em,
            },
            {
              label: "Available Docs Attached",
              value: detail.billing_information.available_docs_attached || em,
            },
          ]}
        />
      </DetailCard>
    </Stack>
  );
}
