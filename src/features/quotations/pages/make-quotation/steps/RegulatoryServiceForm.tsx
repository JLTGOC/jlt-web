import { zodResolver } from "@hookform/resolvers/zod";
import { Group, MultiSelect, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { ArrowForward } from "@nine-thirty-five/material-symbols-react/rounded";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { AppButton } from "@/components/ui/AppButton";
import { useMakeQuotationEnums } from "@/features/quotations/hooks/useMakeQuotationEnums";
import { useMakeQuotationContext } from "../MakeQuotationContext";

const regulatoryServiceSchema = z.object({
  regulatoryServiceType: z.string().min(1, "Regulatory service type is required"),
  serviceRequests: z.array(z.string()).min(1, "Select at least one service request"),
  commodity: z.string().optional(),
  transportMode: z.enum(["SEA", "AIR"]).optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  regulatoryAuthorities: z.array(z.string()).optional(),
  message: z.string().optional(),
});

type RegulatoryServiceFormValues = z.infer<typeof regulatoryServiceSchema>;

function TransportChoice({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} style={{ flex: 1, padding: "1rem", borderRadius: "0.75rem", border: `1px solid ${active ? "#4E6174" : "#d6dbe1"}`, background: "white", cursor: "pointer", fontWeight: 700 }}>{active ? "✓ " : "□ "}{label}</button>;
}

export function RegulatoryServiceForm() {
  const { state, actions } = useMakeQuotationContext();
  const { control, handleSubmit, setValue, formState } = useForm<RegulatoryServiceFormValues>({
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
  const regulatoryServiceType = useWatch({ control, name: "regulatoryServiceType" });
  const transportMode = useWatch({ control, name: "transportMode" });
  const baseEnums = useMakeQuotationEnums({ service: "REGULATORY" });
  const filteredEnums = useMakeQuotationEnums({ service: "REGULATORY", service_type: regulatoryServiceType || undefined });
  const enumOptions = filteredEnums.data ?? baseEnums.data;

  return (
    <form onSubmit={handleSubmit((values) => actions.submitServiceInfo(values))}>
      <Stack gap="md">
        <Controller control={control} name="regulatoryServiceType" render={({ field, fieldState }) => <Select label="REGULATORY SERVICES" data={baseEnums.data?.service_types ?? []} value={field.value ?? null} onChange={(value) => { field.onChange(value ?? ""); setValue("serviceRequests", [], { shouldValidate: true }); }} error={fieldState.error?.message} />} />
        <Controller control={control} name="serviceRequests" render={({ field, fieldState }) => <MultiSelect label="SERVICE REQUEST" data={enumOptions?.service_options ?? []} value={field.value ?? []} onChange={field.onChange} searchable hidePickedOptions error={fieldState.error?.message} />} />
        <Controller control={control} name="commodity" render={({ field }) => <TextInput {...field} value={field.value ?? ""} label="COMMODITY (If Applicable)" />} />
        <Stack gap="xs"><Text fw={700}>TRANSPORT MODE</Text><Group grow><TransportChoice label="SEA" active={transportMode === "SEA"} onClick={() => setValue("transportMode", "SEA", { shouldValidate: true })} /><TransportChoice label="AIR" active={transportMode === "AIR"} onClick={() => setValue("transportMode", "AIR", { shouldValidate: true })} /></Group></Stack>
        <Controller control={control} name="origin" render={({ field }) => <TextInput {...field} value={field.value ?? ""} label="ORIGIN" />} />
        <Controller control={control} name="destination" render={({ field }) => <TextInput {...field} value={field.value ?? ""} label="DESTINATION" />} />
        <Controller control={control} name="regulatoryAuthorities" render={({ field }) => <MultiSelect label="REGULATORY AUTHORITY / AGENCY (If known)" data={enumOptions?.regulatory_assistance_types ?? []} value={field.value ?? []} onChange={field.onChange} searchable hidePickedOptions />} />
        <Controller control={control} name="message" render={({ field }) => <Textarea {...field} value={field.value ?? ""} label="MESSAGE / REMARKS" />} />
        <Group justify="flex-end"><AppButton type="submit" variant="primary" icon={ArrowForward} disabled={!formState.isValid}>NEXT</AppButton></Group>
      </Stack>
    </form>
  );
}
