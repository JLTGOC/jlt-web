import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Group, Paper, Select, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { ArrowForward } from "@nine-thirty-five/material-symbols-react/rounded";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { AppButton } from "@/components/ui/AppButton";
import { useMakeQuotationEnums } from "@/features/quotations/hooks/useMakeQuotationEnums";
import { useMakeQuotationContext } from "../MakeQuotationContext";

const logisticsServiceSchema = z.object({
  serviceType: z.string().min(1, "Service type is required"),
  serviceOptions: z.array(z.string()).min(1, "Select at least one service"),
  transportMode: z.enum(["SEA", "AIR"]),
  commodity: z.string().min(1, "Commodity is required"),
  cargoType: z.enum(["CONTAINERIZED", "LCL"]),
  containerSize: z.string().optional(),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  remarks: z.string().optional(),
}).refine(
  (data) => data.cargoType !== "CONTAINERIZED" || data.transportMode !== "SEA" || Boolean(data.containerSize),
  { message: "Container size is required for containerized cargo", path: ["containerSize"] },
);

type LogisticsServiceFormValues = z.infer<typeof logisticsServiceSchema>;

function ToggleCard({ label, active, onClick, description }: { label: string; active: boolean; onClick: () => void; description?: string }) {
  return (
    <Paper withBorder radius="md" p="md" onClick={onClick} style={{ cursor: "pointer", borderColor: active ? "#4E6174" : undefined, flex: 1 }}>
      <Text fw={700}>{active ? "✓ " : "□ "}{label}</Text>
      {description && <Text size="xs" c="dimmed">{description}</Text>}
    </Paper>
  );
}

export function LogisticsServiceForm() {
  const { state, actions } = useMakeQuotationContext();
  const { control, handleSubmit, setValue, formState } = useForm<LogisticsServiceFormValues>({
    resolver: zodResolver(logisticsServiceSchema),
    mode: "onChange",
    defaultValues: {
      serviceType: "",
      serviceOptions: [],
      transportMode: undefined,
      commodity: "",
      cargoType: undefined,
      containerSize: "",
      origin: "",
      destination: "",
      remarks: "",
      ...state.serviceInfo,
    },
  });
  const serviceType = useWatch({ control, name: "serviceType" });
  const serviceOptions = useWatch({ control, name: "serviceOptions" }) ?? [];
  const transportMode = useWatch({ control, name: "transportMode" });
  const cargoType = useWatch({ control, name: "cargoType" });
  const containerSize = useWatch({ control, name: "containerSize" });
  const baseEnums = useMakeQuotationEnums({ service: "LOGISTICS" });
  const filteredEnums = useMakeQuotationEnums({ service: "LOGISTICS", service_type: serviceType || undefined });
  const enumOptions = filteredEnums.data ?? baseEnums.data;
  const allServiceOptions = enumOptions?.service_options ?? [];
  const allInChecked = allServiceOptions.length > 0 && allServiceOptions.every((option) => serviceOptions.includes(option));
  const containerCards = useMemo(() => [
    { value: "1x20", title: "1 x 20", subtitle: "20FT CONTAINER", code: "(20GP)" },
    { value: "1x40", title: "1 x 40", subtitle: "40FT CONTAINER", code: "(40GP)" },
  ], []);

  function submit(values: LogisticsServiceFormValues) {
    actions.submitServiceInfo(values);
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Stack gap="md">
        <Controller control={control} name="serviceType" render={({ field, fieldState }) => <Select label="SERVICE TYPE" data={baseEnums.data?.service_types ?? []} value={field.value ?? null} onChange={(value) => { field.onChange(value ?? ""); setValue("serviceOptions", [], { shouldValidate: true }); }} error={fieldState.error?.message} />} />
        {serviceType && (
          <Stack gap="xs">
            <Checkbox checked={allInChecked} label="ALL IN" onChange={(event) => setValue("serviceOptions", event.currentTarget.checked ? allServiceOptions : [], { shouldValidate: true, shouldDirty: true })} />
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
              {allServiceOptions.map((option) => (
                <Checkbox key={option} checked={serviceOptions.includes(option)} label={option} onChange={(event) => setValue("serviceOptions", event.currentTarget.checked ? [...serviceOptions, option] : serviceOptions.filter((item) => item !== option), { shouldValidate: true, shouldDirty: true })} />
              ))}
            </SimpleGrid>
            {formState.errors.serviceOptions?.message && <Text size="xs" c="red">{formState.errors.serviceOptions.message}</Text>}
          </Stack>
        )}
        <Stack gap="xs"><Text fw={700}>TRANSPORT MODE</Text><Group grow><ToggleCard label="SEA" active={transportMode === "SEA"} onClick={() => setValue("transportMode", "SEA", { shouldValidate: true })} /><ToggleCard label="AIR" active={transportMode === "AIR"} onClick={() => { setValue("transportMode", "AIR", { shouldValidate: true }); setValue("containerSize", "", { shouldValidate: true }); }} /></Group></Stack>
        <Controller control={control} name="commodity" render={({ field, fieldState }) => <TextInput {...field} value={field.value ?? ""} label="COMMODITY" error={fieldState.error?.message} />} />
        <Stack gap="xs"><Text fw={700}>SHIPMENT MODE</Text><Group grow><ToggleCard label="CONTAINERIZED" active={cargoType === "CONTAINERIZED"} onClick={() => setValue("cargoType", "CONTAINERIZED", { shouldValidate: true })} /><ToggleCard label="LESS THAN CONTAINER LOAD (LCL)" active={cargoType === "LCL"} onClick={() => { setValue("cargoType", "LCL", { shouldValidate: true }); setValue("containerSize", "", { shouldValidate: true }); }} /></Group></Stack>
        {cargoType === "CONTAINERIZED" && transportMode === "SEA" && (
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {containerCards.map((card) => (
              <Paper key={card.value} withBorder radius="md" p="lg" onClick={() => setValue("containerSize", card.value, { shouldValidate: true })} style={{ cursor: "pointer", borderColor: containerSize === card.value ? "#4E6174" : undefined }}>
                <Group justify="space-between"><div><Text fw={800}>{card.title}</Text><Text fw={700}>{card.subtitle}</Text><Text size="sm" c="dimmed">{card.code}</Text></div><Checkbox checked={containerSize === card.value} readOnly /></Group>
              </Paper>
            ))}
          </SimpleGrid>
        )}
        {formState.errors.containerSize?.message && <Text size="xs" c="red">{formState.errors.containerSize.message}</Text>}
        <Controller control={control} name="origin" render={({ field, fieldState }) => <TextInput {...field} value={field.value ?? ""} label="ORIGIN" error={fieldState.error?.message} />} />
        <Controller control={control} name="destination" render={({ field, fieldState }) => <TextInput {...field} value={field.value ?? ""} label="DESTINATION" error={fieldState.error?.message} />} />
        <Controller control={control} name="remarks" render={({ field }) => <Textarea {...field} value={field.value ?? ""} label="REMARKS" />} />
        <Group justify="flex-end"><AppButton type="submit" variant="primary" icon={ArrowForward} disabled={!formState.isValid}>NEXT</AppButton></Group>
      </Stack>
    </form>
  );
}
