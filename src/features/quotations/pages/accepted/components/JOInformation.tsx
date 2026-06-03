import { TextInput, Textarea, Grid } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";

import { type RequestBody } from "../../../schemas/acceptedForm.schema";

import PaperLayout from "./PaperLayout";

export default function JOInformation() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<RequestBody>();

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
          <TextInput
            label="DATE"
             type="date"
            placeholder=""
            radius="md"
            size="sm"
            {...register("subject.date")}
            error={errors.subject?.date?.message}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <TextInput
            label="SUBJECT"
            placeholder=""
            radius="md"
            size="sm"
            {...register("subject.subject")}
            error={errors.subject?.subject?.message}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="MESSAGE"
            placeholder=""
            minRows={10}
            radius="md"
            size="sm"
            {...register("subject.email_body")}
            error={errors.subject?.email_body?.message}
          />
        </Grid.Col>
      </Grid>
    </PaperLayout>
  );
}
