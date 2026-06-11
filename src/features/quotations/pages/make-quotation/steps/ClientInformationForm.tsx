import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Paper, Select, Stack, Text, TextInput } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { ArrowForward, Search } from "@nine-thirty-five/material-symbols-react/rounded";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { AppButton } from "@/components/ui/AppButton";
import { accountsService } from "@/features/accounts/services/accounts.service";
import type { AccountListItem } from "@/features/accounts/types/accounts.types";
import { useMakeQuotationEnums } from "@/features/quotations/hooks/useMakeQuotationEnums";
import type { ClientInfoValues } from "../MakeQuotationContext";

const clientInfoSchema = z.object({
  clientType: z.enum(["existing", "prospect"]),
  clientId: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  services: z.enum(["LOGISTICS", "REGULATORY"]),
  company: z.object({
    name: z.string().min(1, "Company name is required"),
    address: z.string().min(1, "Address is required"),
    contactPerson: z.string().min(1, "Contact person is required"),
    contactNumber: z
      .string()
      .regex(/^09\d{9}$/, "Must be a valid 11-digit PH mobile number starting with 09"),
    email: z.string().email("Invalid email address"),
    position: z.string().optional(),
    businessType: z.string().optional(),
  }),
});

interface ClientInformationFormProps {
  defaultValues?: Partial<ClientInfoValues>;
  onSubmit: (values: ClientInfoValues) => void;
  onValidityChange: (valid: boolean) => void;
}

function ChoiceButton({ label, description, active, onClick }: { label: string; description?: string; active: boolean; onClick: () => void }) {
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      onClick={onClick}
      style={{ cursor: "pointer", borderColor: active ? "#4E6174" : undefined, flex: 1 }}
    >
      <Text fw={700}>{active ? "✓ " : "□ "}{label}</Text>
      {description && <Text size="xs" c="dimmed">{description}</Text>}
    </Paper>
  );
}

function applyClientDetails(values: ClientInfoValues, item: AccountListItem): ClientInfoValues {
  return {
    ...values,
    clientId: String(item.id),
    fullName: item.name,
    company: {
      ...values.company,
      name: item.client?.companyName ?? "",
      contactPerson: item.name,
      contactNumber: item.contactNumber,
      email: item.email,
    },
  };
}

export function ClientInformationForm({ defaultValues, onSubmit, onValidityChange }: ClientInformationFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const { control, handleSubmit, formState, setValue, getValues, reset } = useForm<ClientInfoValues>({
    resolver: zodResolver(clientInfoSchema),
    mode: "onChange",
    defaultValues: {
      clientType: "existing",
      fullName: "",
      services: "LOGISTICS",
      company: {
        name: "",
        address: "",
        contactPerson: "",
        contactNumber: "",
        email: "",
        position: "",
        businessType: "",
      },
      ...defaultValues,
    },
  });
  const clientType = useWatch({ control, name: "clientType" });
  const services = useWatch({ control, name: "services" });
  const { data: regulatoryEnums } = useMakeQuotationEnums({ service: services === "REGULATORY" ? "REGULATORY" : undefined });
  const { data: clientsData, isFetching } = useQuery({
    queryKey: ["make-quotation-client-search", submittedSearch],
    queryFn: () => accountsService.getClientAccountsList(1, 10, { search: submittedSearch }),
    enabled: submittedSearch.trim().length > 0,
  });

  useEffect(() => {
    onValidityChange(formState.isValid);
  }, [formState.isValid, onValidityChange]);

  async function handleClientSelect(id: string | null) {
    if (!id) return;
    const selected = clientsData?.data.find((client) => String(client.id) === id);
    if (!selected) return;
    reset(applyClientDetails(getValues(), selected));
    try {
      const details = await accountsService.getClientFullDetails(Number(id));
      setValue("company.address", details.companyAddress ?? "", { shouldDirty: true, shouldValidate: true });
      setValue("company.position", details.position ?? "", { shouldDirty: true, shouldValidate: true });
      setValue("company.businessType", details.businessType ?? "", { shouldDirty: true, shouldValidate: true });
    } catch {
      // Keep list-level autofill if full detail lookup is unavailable.
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Group grow align="stretch">
          <ChoiceButton label="Existing Client" active={clientType === "existing"} onClick={() => setValue("clientType", "existing", { shouldValidate: true })} />
          <ChoiceButton label="Prospect Client" description="no existing account" active={clientType === "prospect"} onClick={() => setValue("clientType", "prospect", { shouldValidate: true })} />
        </Group>

        {clientType === "existing" && (
          <Stack gap="xs">
            <Text fw={700} size="sm">EXISTING CLIENT</Text>
            <Group align="end">
              <TextInput value={searchTerm} onChange={(event) => setSearchTerm(event.currentTarget.value)} placeholder="SEARCH CLIENT NAME OR ID NUMBER" style={{ flex: 1 }} />
              <Button leftSection={<Search width={18} height={18} />} loading={isFetching} onClick={() => setSubmittedSearch(searchTerm)}>Search</Button>
            </Group>
            <Select
              data={(clientsData?.data ?? []).map((client) => ({ value: String(client.id), label: `${client.name} · ${client.client?.companyName ?? "No company"}` }))}
              placeholder="Select client result"
              searchable
              onChange={handleClientSelect}
            />
          </Stack>
        )}

        <Controller control={control} name="fullName" render={({ field, fieldState }) => <TextInput {...field} value={field.value ?? ""} label="FULL NAME" readOnly={clientType === "existing"} error={fieldState.error?.message} />} />
        <Controller control={control} name="company.name" render={({ field, fieldState }) => <TextInput {...field} value={field.value ?? ""} label="COMPANY NAME" error={fieldState.error?.message} />} />
        {services === "REGULATORY" && (
          <>
            <Controller control={control} name="company.position" render={({ field }) => <TextInput {...field} value={field.value ?? ""} label="POSITION" />} />
            <Controller control={control} name="company.businessType" render={({ field }) => <Select value={field.value ?? null} onChange={(value) => field.onChange(value ?? "")} label="BUSINESS TYPE" searchable data={regulatoryEnums?.business_types ?? []} />} />
          </>
        )}

        <Stack gap={4}>
          <Text fw={700}>SERVICE REQUESTED</Text>
          <Text size="sm" c="dimmed">Select the service(s) requested by the client.</Text>
          <Group grow align="stretch">
            <ChoiceButton label="LOGISTICS SERVICES" description="End-to-end logistics solutions for your cargo" active={services === "LOGISTICS"} onClick={() => setValue("services", "LOGISTICS", { shouldValidate: true })} />
            <ChoiceButton label="REGULATORY SERVICES" description="permits, licenses, and compliances for import and export" active={services === "REGULATORY"} onClick={() => setValue("services", "REGULATORY", { shouldValidate: true })} />
          </Group>
        </Stack>

        <Controller control={control} name="company.name" render={({ field, fieldState }) => <TextInput {...field} value={field.value ?? ""} label="CONSIGNEE" readOnly={clientType === "existing"} error={fieldState.error?.message} />} />
        <Controller control={control} name="company.address" render={({ field, fieldState }) => <TextInput {...field} value={field.value ?? ""} label="COMPANY ADDRESS" error={fieldState.error?.message} />} />
        <Controller control={control} name="company.contactPerson" render={({ field, fieldState }) => <TextInput {...field} value={field.value ?? ""} label="CONTACT PERSON" error={fieldState.error?.message} />} />
        <Controller control={control} name="company.contactNumber" render={({ field, fieldState }) => <TextInput {...field} value={field.value ?? ""} label="CONTACT NUMBER" error={fieldState.error?.message} />} />
        <Controller control={control} name="company.email" render={({ field, fieldState }) => <TextInput {...field} value={field.value ?? ""} label="EMAIL" error={fieldState.error?.message} />} />

        <Group justify="flex-end"><AppButton type="submit" variant="primary" icon={ArrowForward} disabled={!formState.isValid}>NEXT</AppButton></Group>
      </Stack>
    </form>
  );
}
