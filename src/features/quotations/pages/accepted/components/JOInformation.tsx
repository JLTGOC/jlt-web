import { Grid, TextInput } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";

import { DateInputField } from "@/components/form/valueFields";
import { type RequestBody } from "../../../schemas/acceptedForm.schema";

import PaperLayout from "./PaperLayout";

export default function JOInformation() {
  const { control } = useFormContext<RequestBody>();
  const today = dayjs().startOf("day").toDate();

  return (
    <PaperLayout title="JO INFORMATION" icon={<IconFileText size={20} />}>
      <Grid gutter="md">
        <Grid.Col span={8}>
          <TextInput
            label="JOB ORDER NO."
            placeholder="Auto-generate"
            radius="md"
            size="sm"
            disabled
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <DateInputField
            control={control}
            name="subject.date"
            label="DATE"
            placeholder="MM/DD/YYYY"
            valueFormat="MM/DD/YYYY"
            clearable
            minDate={today}
          />
        </Grid.Col>
      </Grid>
    </PaperLayout>
  );
}
