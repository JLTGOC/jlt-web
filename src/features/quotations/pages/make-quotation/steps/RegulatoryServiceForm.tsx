import { zodResolver } from "@hookform/resolvers/zod";
import {
  Group,
  Radio,
  MultiSelect,
  TagsInput,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { ArrowForward } from "@nine-thirty-five/material-symbols-react/rounded";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { AppButton } from "@/components/ui/AppButton";
import { useMakeQuotationEnums } from "@/features/quotations/hooks/useMakeQuotationEnums";
import { useMakeQuotationContext } from "../MakeQuotationContext";
import { useMemo } from "react";

const regulatoryServiceSchema = z.object({
  regulatoryServiceType: z
    .string()
    .min(1, "Regulatory service type is required"),
  serviceRequests: z
    .array(z.string())
    .min(1, "Select at least one service request"),
  commodity: z.string().optional(),
  transportMode: z.enum(["SEA", "AIR"]).optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  regulatoryAuthorities: z.array(z.string()).optional(),
  message: z.string().optional(),
});

type RegulatoryServiceFormValues = z.infer<typeof regulatoryServiceSchema>;

export function RegulatoryServiceForm() {
  const { state, actions } = useMakeQuotationContext();
  const { control, handleSubmit, setValue, formState } =
    useForm<RegulatoryServiceFormValues>({
      resolver: zodResolver(regulatoryServiceSchema),
      mode: "onChange",
      defaultValues: {
        regulatoryServiceType: "",
        serviceRequests: [],
        commodity: "",
        transportMode: undefined,
        origin: "",
        destination: "",
        regulatoryAuthorities: [],
        message: "",
        ...state.serviceInfo,
      },
    });
  const regulatoryServiceType = useWatch({
    control,
    name: "regulatoryServiceType",
  });
  const baseEnums = useMakeQuotationEnums({ service: "REGULATORY" });
  const filteredEnums = useMakeQuotationEnums({
    service: "REGULATORY",
    service_type: regulatoryServiceType || undefined,
  });
  const enumOptions = filteredEnums.data ?? baseEnums.data;

  const uniqueServiceOptions = useMemo(
    () => Array.from(new Set(enumOptions?.service_options ?? [])),
    [enumOptions?.service_options],
  );

  const uniqueRegulatoryAuthorities = useMemo(
    () => Array.from(new Set(enumOptions?.regulatory_assistance_types ?? [])),
    [enumOptions?.regulatory_assistance_types],
  );

  return (
    <form
      onSubmit={handleSubmit((values) => actions.submitServiceInfo(values))}
    >
      <Stack gap="md">
        <Group grow align="flex-start">
          <Controller
            control={control}
            name="regulatoryServiceType"
            render={({ field, fieldState }) => (
              <Select
                label="REGULATORY SERVICES"
                data={baseEnums.data?.service_types ?? []}
                value={field.value ?? null}
                onChange={(value) => {
                  field.onChange(value ?? "");
                  setValue("serviceRequests", [], { shouldValidate: true });
                }}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="serviceRequests"
            render={({ field, fieldState }) => (
              <TagsInput
                label="SERVICE REQUEST"
                placeholder={
                  regulatoryServiceType
                    ? "Select or type a service request"
                    : "Please select a regulatory service type first"
                }
                disabled={!regulatoryServiceType}
                data={regulatoryServiceType ? uniqueServiceOptions : []}
                value={field.value ?? []}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </Group>
        <Controller
          control={control}
          name="commodity"
          render={({ field }) => (
            <TextInput
              {...field}
              value={field.value ?? ""}
              label="COMMODITY (If Applicable)"
            />
          )}
        />
        <Group grow align="flex-start">
          <Controller
            control={control}
            name="transportMode"
            render={({ field, fieldState }) => (
              <Radio.Group
                label="TRANSPORT MODE"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              >
                <Group mt="xs">
                  <Radio value="SEA" label="SEA" />
                  <Radio value="AIR" label="AIR" />
                </Group>
              </Radio.Group>
            )}
          />
          <Controller
            control={control}
            name="origin"
            render={({ field }) => (
              <TextInput {...field} value={field.value ?? ""} label="ORIGIN" />
            )}
          />
          <Controller
            control={control}
            name="destination"
            render={({ field }) => (
              <TextInput
                {...field}
                value={field.value ?? ""}
                label="DESTINATION"
              />
            )}
          />
        </Group>
        <Controller
          control={control}
          name="regulatoryAuthorities"
          render={({ field }) => (
            <MultiSelect
              label="REGULATORY AUTHORITY / AGENCY (If known)"
              placeholder={
                regulatoryServiceType
                  ? "Select regulatory authorities"
                  : "Please select a regulatory service type first"
              }
              disabled={!regulatoryServiceType}
              data={regulatoryServiceType ? uniqueRegulatoryAuthorities : []}
              value={field.value ?? []}
              onChange={field.onChange}
              searchable
              hidePickedOptions
            />
          )}
        />
        <Controller
          control={control}
          name="message"
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value ?? ""}
              label="MESSAGE / REMARKS"
            />
          )}
        />
        <Group justify="flex-end">
          <AppButton
            type="submit"
            variant="primary"
            icon={ArrowForward}
            disabled={!formState.isValid}
          >
            NEXT
          </AppButton>
        </Group>
      </Stack>
    </form>
  );
}
