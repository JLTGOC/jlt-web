import { useFormContext } from "react-hook-form";
import { Grid, TextInput, Textarea } from "@mantine/core";
import { IconPackage } from "@tabler/icons-react";

import type { AcceptedFormEnumsResponse } from "../../../types/acceptedForm.types";
import { type RequestBody } from "@/features/quotations/schemas/acceptedForm.schema";

import PaperLayout from "./PaperLayout";

type ShipmentInformationProps = {
  autofill_data?: AcceptedFormEnumsResponse["autofill_details"];
};

export default function ShipmentInformation({
  autofill_data,
}: ShipmentInformationProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestBody>();

  return (
    <PaperLayout title="SHIPMENT INFORMATION" icon={<IconPackage size={20} />}>
      <Grid gutter="md">
        <Grid.Col span={12}>
          <TextInput
            label="COMMODITY"
            placeholder=""
            radius="md"
            size="sm"
            value={autofill_data?.commodity}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <TextInput
            label="VOLUME/DIMENSION"
            placeholder=""
            radius="md"
            size="sm"
            value={`${autofill_data?.cargo_type} - ${autofill_data?.container_size}`}
            onChange={()=>{}}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <TextInput
            label="HS CODE/CLASSIFICATION"
            placeholder=""
            radius="md"
            size="sm"
            {...register("shipment.hs_code")}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <TextInput
            label="ROD"
            placeholder=""
            radius="md"
            size="sm"
            {...register("shipment.rod")}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <TextInput
            label="PERMITS NEEDED"
            placeholder=""
            radius="md"
            size="sm"
            {...register("shipment.permits")}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="IF COORDINATED"
            placeholder=""
            minRows={3}
            radius="md"
            size="sm"
            {...register("shipment.if_coordinated")}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="SPECIAL REMARKS"
            placeholder=""
            minRows={3}
            radius="md"
            size="sm"
            {...register("shipment.special_remarks")}
          />
        </Grid.Col>
      </Grid>
    </PaperLayout>
  );
}
