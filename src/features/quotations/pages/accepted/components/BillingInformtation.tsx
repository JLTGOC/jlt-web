import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, Grid, List, Select, Text, TextInput, Textarea } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, type FileWithPath } from "@mantine/dropzone";
import { IconReceipt } from "@tabler/icons-react";

import { type RequestBody } from "@/features/quotations/schemas/acceptedForm.schema";
import type { AcceptedFormEnumsResponse } from "@/features/quotations/types/acceptedForm.types";

import PaperLayout from "./PaperLayout";

type BillingInformationProps = {
  enums?: AcceptedFormEnumsResponse;
};

export default function BillingInformation({ enums }: BillingInformationProps) {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<RequestBody>();
  const [attachedDocs, setAttachedDocs] = useState<FileWithPath[]>([]);

  console.log(attachedDocs)

  return (
    <PaperLayout title="BILLING INFORMATION" icon={<IconReceipt size={20} />}>
      <Grid gutter="md">
        <Grid.Col span={6}>
          <TextInput
            label="TERMS OF PAYMENT"
            placeholder=""
            radius="md"
            size="sm"
            {...register("billing.terms_of_payment")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="WHEN TO BILL"
            placeholder=""
            radius="md"
            size="sm"
            {...register("billing.billing_date")}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Controller
            name={"billing.shall_be_billed"}
            control={control}
            render={({ field }) => (
              <Select
                label="SHALL BE BILLED"
                placeholder="SELECT SHALL BE BILLED"
                radius="md"
                size="sm"
                data={enums?.shall_be_billed}
                value={field.value ?? null}
                onChange={field.onChange}
                error={errors.billing?.shall_be_billed?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="LIST OF DOCS ATTACHED"
            placeholder=""
            minRows={4}
            radius="md"
            size="sm"
            {...register("billing.listed_docs")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm" fw={600} mb={6}>
            DOCS ATTACHED
          </Text>
          <Dropzone
            multiple
            accept={[
              ...IMAGE_MIME_TYPE,
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ]}
            onDrop={(files) => {
              const nextFiles = [...attachedDocs, ...files];
              setAttachedDocs(nextFiles);
              setValue(
                "billing.attached_docs",
                attachedDocs,
              );
            }}
          >
            <Box
              p="md"
              style={{
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <Dropzone.Accept>
                <Text size="sm" fw={600} c="green">
                  Drop files to attach
                </Text>
              </Dropzone.Accept>
              <Dropzone.Reject>
                <Text size="sm" fw={600} c="red">
                  Some files were rejected
                </Text>
              </Dropzone.Reject>
              <Dropzone.Idle>
                <Text size="sm" fw={600}>
                  Drag and drop files here
                </Text>
                <Text size="xs" c="dimmed">
                  Or click to browse
                </Text>
              </Dropzone.Idle>

              {attachedDocs.length ? (
                <Box mt="xs">
                  <List spacing={4} size="sm">
                    {attachedDocs.map((file, index) => (
                      <List.Item key={`${file.name}-${index}`}>
                        {file.name}
                      </List.Item>
                    ))}
                  </List>
                </Box>
              ) : null}
            </Box>
          </Dropzone>
        </Grid.Col>
        
      </Grid>
    </PaperLayout>
  );
}
