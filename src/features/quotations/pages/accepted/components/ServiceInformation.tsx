import { Controller, useFormContext } from "react-hook-form";
import { Grid, Select, TextInput } from "@mantine/core";
import { IconTruck } from "@tabler/icons-react";

import type { AcceptedFormEnumsResponse } from "@/features/quotations/types/acceptedForm.types";
import { type RequestBody } from "@/features/quotations/schemas/acceptedForm.schema";

import PaperLayout from "./PaperLayout";

type ServiceInformationProps = {
  enums?: AcceptedFormEnumsResponse;
};

export default function ServiceInformation({ enums }: ServiceInformationProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<RequestBody>();

  return (
    <PaperLayout title="SERVICE INFORMATION" icon={<IconTruck size={20} />}>
      <Grid gutter="md">
        <Grid.Col span={12}>
          <Controller
            name="service.service_level"
            control={control}
            render={({ field }) => (
              <Select
                label="SERVICE LEVEL"
                placeholder="SELECT SERVICE LEVEL"
                radius="md"
                size="sm"
                data={enums?.service_levels}
                value={field.value ?? null}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.service?.service_level?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <TextInput
            label="BL NO."
            placeholder=""
            radius="md"
            size="sm"
            {...register("service.bl_no")}
            error={errors?.service?.bl_no?.message}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="ETD"
            type="date"
            placeholder=""
            radius="md"
            size="sm"
            {...register("service.etd")}
            error={errors.service?.etd?.message}
          />
        </Grid.Col>
        
        <Grid.Col span={6}>
          <TextInput
            label="ETA"
            type="date"
            placeholder=""
            radius="md"
            size="sm"
            {...register("service.eta")}
            error={errors.service?.eta?.message}
          />
        </Grid.Col>

      </Grid>
    </PaperLayout>
  );
}
