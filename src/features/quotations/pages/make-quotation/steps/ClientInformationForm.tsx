import { zodResolver } from "@hookform/resolvers/zod";
import {
  Combobox,
  Group,
  Loader,
  UnstyledButton,
  Radio,
  Box,
  Select,
  Stack,
  Text,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  ArrowForward,
  Search,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { useEffect, useState, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { AppButton } from "@/components/ui/AppButton";
import { useMakeQuotationEnums } from "@/features/quotations/hooks/useMakeQuotationEnums";
import type { ClientInfoValues } from "../MakeQuotationContext";

const clientInfoSchema = z.object({
  clientType: z.enum(["existing", "prospect"]),
  clientId: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  services: z.enum(["LOGISTICS", "REGULATORY"]),
  company: z.object({
    name: z.string().min(1, "Company name is required"),
    consignee: z.string().min(1, "Consignee is required"),
    address: z.string().min(1, "Address is required"),
    contactPerson: z.string().min(1, "Contact person is required"),
    contactNumber: z
      .string()
      .regex(
        /^09\d{9}$/,
        "Must be a valid 11-digit PH mobile number starting with 09",
      ),
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

function ChoiceButton({
  label,
  description,
  active,
  onClick,
}: {
  label: string;
  description?: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <UnstyledButton
      flex={1}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "0.875rem 1rem",
        border: `1.5px solid ${
          active
            ? "var(--mantine-color-jltBlue-8)"
            : hovered
              ? "var(--mantine-color-jltAccent-4)"
              : "var(--mantine-color-gray-3)"
        }`,
        borderRadius: "var(--mantine-radius-md)",
        backgroundColor: active
          ? "#f0f3f8"
          : hovered
            ? "var(--mantine-color-gray-0)"
            : "#fff",
        transition:
          "border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease",
        boxShadow: active
          ? "0 0 0 3px rgba(29, 39, 78, 0.08)"
          : hovered
            ? "0 2px 8px rgba(0,0,0,0.06)"
            : "none",
      }}
    >
      <Radio
        checked={active}
        onChange={() => {}}
        color="jltBlue.8"
        size="sm"
        tabIndex={-1}
        style={{ pointerEvents: "none", flexShrink: 0, marginTop: "0.1rem" }}
      />

      <Box style={{ flex: 1 }}>
        <Text
          size="sm"
          fw={active ? 600 : 500}
          c={active ? "jltBlue.8" : "dark.4"}
        >
          {label}
        </Text>
        {description && (
          <Text size="xs" c="dimmed" mt="0.2rem" lh={1.4}>
            {description}
          </Text>
        )}
      </Box>

      {active && (
        <Box
          style={{
            position: "absolute",
            bottom: 0,
            left: "0.875rem",
            right: "0.875rem",
            height: "2.5px",
            borderRadius: "2px 2px 0 0",
            backgroundColor: "var(--mantine-color-jltOrange-5)",
          }}
        />
      )}
    </UnstyledButton>
  );
}

export function ClientInformationForm({
  defaultValues,
  onSubmit,
  onValidityChange,
}: ClientInformationFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [debouncedSearch] = useDebouncedValue(searchTerm, 300);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const { data: searchData, isFetching } = useMakeQuotationEnums({
    client_search:
      debouncedSearch.trim().length >= 2 ? debouncedSearch : undefined,
  });

  const { data: autofillData } = useMakeQuotationEnums({
    client_id: selectedClientId ?? undefined,
  });

  const clientOptions = useMemo(
    () =>
      Object.entries(searchData?.clients ?? {}).map(([id, name]) => ({
        value: id,
        label: name,
      })),
    [searchData?.clients],
  );

  const { control, handleSubmit, formState, setValue } =
    useForm<ClientInfoValues>({
      resolver: zodResolver(clientInfoSchema),
      mode: "onChange",
      defaultValues: {
        clientType: "existing",
        fullName: "",
        services: "LOGISTICS",
        company: {
          name: "",
          consignee: "",
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
  const { data: regulatoryEnums } = useMakeQuotationEnums({
    service: services === "REGULATORY" ? "REGULATORY" : undefined,
  });

  useEffect(() => {
    if (!autofillData?.autofill_details || !selectedClientId) return;
    const { full_name, company } = autofillData.autofill_details;
    setValue("fullName", full_name, { shouldValidate: true });
    setValue("company.name", company.name ?? "", { shouldValidate: true });
    setValue("company.address", company.address ?? "", {
      shouldValidate: true,
    });
    setValue("company.contactNumber", company.contact_number, {
      shouldValidate: true,
    });
    setValue("company.email", company.email, { shouldValidate: true });
    setValue("company.position", company.position ?? "", {
      shouldValidate: true,
    });
    setValue("company.businessType", company.business_type ?? "", {
      shouldValidate: true,
    });
  }, [autofillData?.autofill_details, selectedClientId, setValue]);

  useEffect(() => {
    onValidityChange(formState.isValid);
  }, [formState.isValid, onValidityChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Group grow align="stretch">
          <ChoiceButton
            label="Existing Client"
            active={clientType === "existing"}
            onClick={() =>
              setValue("clientType", "existing", { shouldValidate: true })
            }
          />
          <ChoiceButton
            label="Prospect Client"
            description="No existing account."
            active={clientType === "prospect"}
            onClick={() =>
              setValue("clientType", "prospect", { shouldValidate: true })
            }
          />
        </Group>

        {clientType === "existing" && (
          <Combobox
            store={combobox}
            onOptionSubmit={(value) => {
              setSelectedClientId(value);
              setValue("clientId", value, { shouldValidate: true });
              setSearchTerm(searchData?.clients[value] ?? searchTerm);
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <TextInput
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.currentTarget.value);
                  combobox.openDropdown();
                }}
                onFocus={() => combobox.openDropdown()}
                placeholder="SEARCH CLIENT NAME OR ID NUMBER"
                rightSection={
                  isFetching ? (
                    <Loader size="xs" />
                  ) : (
                    <Search width={18} height={18} />
                  )
                }
              />
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>
                {clientOptions.length > 0 ? (
                  clientOptions.map((option) => (
                    <Combobox.Option key={option.value} value={option.value}>
                      <Text size="sm">{option.label}</Text>
                    </Combobox.Option>
                  ))
                ) : (
                  <Combobox.Empty>
                    {isFetching
                      ? "Searching..."
                      : debouncedSearch.trim().length >= 2
                        ? "No clients found"
                        : "Type to search clients"}
                  </Combobox.Empty>
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        )}

        <Group grow justify="center" align="flex-start">
          <Controller
            control={control}
            name="fullName"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value ?? ""}
                label="FULL NAME"
                readOnly={clientType === "existing"}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="company.name"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value ?? ""}
                label="COMPANY NAME"
                error={fieldState.error?.message}
              />
            )}
          />
        </Group>
        {services === "REGULATORY" && (
          <>
            <Controller
              control={control}
              name="company.position"
              render={({ field }) => (
                <TextInput
                  {...field}
                  value={field.value ?? ""}
                  label="POSITION"
                />
              )}
            />
            <Controller
              control={control}
              name="company.businessType"
              render={({ field }) => (
                <Select
                  value={field.value ?? null}
                  onChange={(value) => field.onChange(value ?? "")}
                  label="BUSINESS TYPE"
                  searchable
                  data={regulatoryEnums?.business_types ?? []}
                />
              )}
            />
          </>
        )}

        <Stack gap={4}>
          <Text fw={700}>SERVICE REQUESTED</Text>
          <Text size="sm" c="dimmed">
            Select the service(s) requested by the client.
          </Text>
          <Group grow align="stretch">
            <ChoiceButton
              label="LOGISTICS SERVICES"
              description="End-to-end logistics solutions for your cargo"
              active={services === "LOGISTICS"}
              onClick={() =>
                setValue("services", "LOGISTICS", { shouldValidate: true })
              }
            />
            <ChoiceButton
              label="REGULATORY SERVICES"
              description="permits, licenses, and compliances for import and export"
              active={services === "REGULATORY"}
              onClick={() =>
                setValue("services", "REGULATORY", { shouldValidate: true })
              }
            />
          </Group>
        </Stack>

        <Group grow justify="center" align="flex-start">
          <Controller
            control={control}
            name="company.consignee"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value ?? ""}
                label="CONSIGNEE"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="company.address"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value ?? ""}
                label="COMPANY ADDRESS"
                error={fieldState.error?.message}
              />
            )}
          />
        </Group>
        <Group grow justify="center" align="flex-start">
          <Controller
            control={control}
            name="company.contactPerson"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value ?? ""}
                label="CONTACT PERSON"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="company.contactNumber"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value ?? ""}
                label="CONTACT NUMBER"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="company.email"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value ?? ""}
                label="EMAIL"
                error={fieldState.error?.message}
              />
            )}
          />
        </Group>

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
