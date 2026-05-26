import { useFormContext } from "react-hook-form";
import { Grid, TextInput, Textarea } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";

import { type RequestBody } from "@/features/quotations/schemas/acceptedForm.schema";

import PaperLayout from "./PaperLayout";

export default function CommitmentInformation() {
  
    const {register, formState: {errors}} = useFormContext<RequestBody>()
  
    return (
    <PaperLayout title="COMMITMENT INFORMATION" icon={<IconClock size={20} />}>
      <Grid gutter="md">
        <Grid.Col span={6}>
          <TextInput
            label="TARGET DELIVERY"
            placeholder=""
            radius="md"
            size="sm"
            {...register("target.delivery_date")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="TARGET COMPLETION PERIOD"
            placeholder=""
            radius="md"
            size="sm"
            {...register("target.completion_date")}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="SPECIAL REMARKS"
            placeholder=""
            minRows={4}
            radius="md"
            size="sm"
            {...register("target.special_remarks")}
          />
        </Grid.Col>
      </Grid>
    </PaperLayout>
  );
}
