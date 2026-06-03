import { Controller, useFormContext } from "react-hook-form";
import { Grid, Select, TextInput, Textarea } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

import type { AcceptedFormEnumsResponse } from "../../../types/acceptedForm.types";
import { type RequestBody } from "@/features/quotations/schemas/acceptedForm.schema";

import PaperLayout from "./PaperLayout";

type ClientInformationProps = {
  enums?: AcceptedFormEnumsResponse;
};

export default function ClientInformation({ enums }: ClientInformationProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<RequestBody>();

  return (
    <PaperLayout title="CLIENT INFORMATION" icon={<IconUser size={20} />}>
      <Grid gutter="md">
        <Grid.Col span={12}>
          <TextInput
            label="CONSIGNEE"
            placeholder=""
            radius="md"
            size="sm"
            value={enums?.autofill_details?.full_name}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Controller
            name="client.client_type"
            control={control}
            render={({ field }) => (
              <Select
                label="CLIENT TYPE"
                placeholder="SELECT CLIENT TYPE"
                radius="md"
                size="sm"
                data={enums?.client_types}
                value={field.value ?? null}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.client?.client_type?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Controller
            name="client.accredited"
            control={control}
            render={({ field }) => (
              <Select
                label="ACCREDITED"
                placeholder="SELECT ACCREDITED"
                radius="md"
                size="sm"
                data={enums?.accredited}
                value={field.value ?? null}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.client?.accredited?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <TextInput
            label="SHIPPER"
            placeholder=""
            radius="md"
            size="sm"
            value={enums?.autofill_details?.company_name}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="REMARKS ON HANDLING CLIENT"
            placeholder=""
            minRows={5}
            radius="md"
            size="sm"
            {...register("client.remarks")}
          />
        </Grid.Col>
      </Grid>
    </PaperLayout>
  );
}
