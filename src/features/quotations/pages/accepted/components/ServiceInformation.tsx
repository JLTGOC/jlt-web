import { Controller, useFormContext } from "react-hook-form";
import { Grid, Select, TextInput } from "@mantine/core";
import { IconTruck } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useWatch } from "react-hook-form";

import { DateInputField } from "@/components/form/valueFields";
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
  const today = dayjs().startOf("day").toDate();
  const etaValue = useWatch({ control, name: "service.eta" });
  const etaMinDate = etaValue ? new Date(`${etaValue}T00:00:00`) : today;

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
          <DateInputField
            control={control}
            name="service.eta"
            label="ETA"
            placeholder="MM/DD/YYYY"
            valueFormat="MM/DD/YYYY"
            clearable
            minDate={today}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <DateInputField
            control={control}
            name="service.etd"
            label="ETD"
            placeholder="MM/DD/YYYY"
            valueFormat="MM/DD/YYYY"
            clearable
            minDate={etaMinDate}
          />
        </Grid.Col>
      </Grid>
    </PaperLayout>
  );
}
