import { zodResolver } from "@hookform/resolvers/zod";
import {
  Checkbox,
  Box,
  Group,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Image,
} from "@mantine/core";
import { ArrowForward } from "@nine-thirty-five/material-symbols-react/rounded";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { AppButton } from "@/components/ui/AppButton";
import { useMakeQuotationEnums } from "@/features/quotations/hooks/useMakeQuotationEnums";
import { useMakeQuotationContext } from "../MakeQuotationContext";
import container20 from "@/assets/containers/20ft.webp";
import container40 from "@/assets/containers/40ft.webp";

const logisticsServiceSchema = z
  .object({
    serviceType: z.string().min(1, "Service type is required"),
    serviceOptions: z.array(z.string()).min(1, "Select at least one service"),
    transportMode: z.enum(["SEA", "AIR"]),
    commodity: z.string().min(1, "Commodity is required"),
    cargoType: z.enum(["CONTAINERIZED", "LCL"]),
    containerSize: z.string().optional(),
    origin: z.string().min(1, "Origin is required"),
    destination: z.string().min(1, "Destination is required"),
    remarks: z.string().optional(),
  })
  .refine(
    (data) =>
      data.cargoType !== "CONTAINERIZED" ||
      data.transportMode !== "SEA" ||
      Boolean(data.containerSize),
    {
      message: "Container size is required for containerized cargo",
      path: ["containerSize"],
    },
  );

type LogisticsServiceFormValues = z.infer<typeof logisticsServiceSchema>;

export function LogisticsServiceForm() {
  const { state, actions } = useMakeQuotationContext();
  const { control, handleSubmit, setValue, formState } =
    useForm<LogisticsServiceFormValues>({
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
  const baseEnums = useMakeQuotationEnums({ service: "LOGISTICS" });
  const filteredEnums = useMakeQuotationEnums({
    service: "LOGISTICS",
    service_type: serviceType || undefined,
  });
  const enumOptions = filteredEnums.data ?? baseEnums.data;
  const allServiceOptions = Array.from(
    new Set(enumOptions?.service_options ?? []),
  );

  const allInOption = "ALL IN";
  const regularOptions = allServiceOptions.filter((o) => o !== allInOption);
  const hasAllIn = allServiceOptions.includes(allInOption);

  const allInChecked =
    hasAllIn &&
    serviceOptions.includes(allInOption) &&
    regularOptions.every((o) => serviceOptions.includes(o));

  const allInIndeterminate =
    hasAllIn &&
    !allInChecked &&
    (serviceOptions.includes(allInOption) ||
      regularOptions.some((o) => serviceOptions.includes(o)));

  const containerCards = useMemo(
    () => [
      {
        value: "1x20",
        title: "1 × 20",
        subtitle: "20FT CONTAINER",
        code: "20GP",
        image: (
          <Image
            src={container20}
            loading="eager"
            decoding="async"
            alt="20ft container"
            fit="contain"
          />
        ),
      },
      {
        value: "1x40",
        title: "1 × 40",
        subtitle: "40FT CONTAINER",
        code: "40GP",
        image: (
          <Image
            src={container40}
            loading="eager"
            decoding="async"
            alt="40ft container"
            fit="contain"
          />
        ),
      },
    ],
    [],
  );

  function submit(values: LogisticsServiceFormValues) {
    actions.submitServiceInfo(values);
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Stack gap="md">
        <Group grow align="flex-start">
          <Controller
            control={control}
            name="serviceType"
            render={({ field, fieldState }) => (
              <Select
                label="SERVICE TYPE"
                data={baseEnums.data?.service_types ?? []}
                value={field.value ?? null}
                onChange={(value) => {
                  field.onChange(value ?? "");
                  setValue("serviceOptions", [], { shouldValidate: true });
                }}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="transportMode"
            render={({ field, fieldState }) => (
              <Radio.Group
                {...field}
                label="TRANSPORT MODE"
                error={fieldState.error?.message}
                onChange={(value) => {
                  field.onChange(value);
                  if (value === "AIR") {
                    setValue("containerSize", "", { shouldValidate: true });
                  }
                }}
              >
                <Group mt="xs">
                  <Radio value="SEA" label="SEA" />
                  <Radio value="AIR" label="AIR" />
                </Group>
              </Radio.Group>
            )}
          />
        </Group>
        {serviceType && (
          <Stack gap="xs">
            {/* "ALL IN" renders first with select-all behaviour */}
            {hasAllIn && (
              <Checkbox
                label="ALL IN"
                checked={allInChecked}
                indeterminate={allInIndeterminate}
                onChange={(event) => {
                  if (event.currentTarget.checked) {
                    // Select ALL IN + every individual option
                    setValue("serviceOptions", allServiceOptions, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  } else {
                    // Deselect everything
                    setValue("serviceOptions", [], {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }
                }}
              />
            )}

            {/* Individual options below — exclude "ALL IN" from this grid */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
              {regularOptions.map((option) => (
                <Checkbox
                  key={option}
                  label={option}
                  checked={serviceOptions.includes(option)}
                  onChange={(event) => {
                    const next = event.currentTarget.checked
                      ? [...serviceOptions, option]
                      : serviceOptions.filter((o) => o !== option);

                    // If all regular options are now checked,
                    // auto-include "ALL IN" in the selection too
                    const allRegularChecked = regularOptions.every((o) =>
                      next.includes(o),
                    );

                    setValue(
                      "serviceOptions",
                      hasAllIn && allRegularChecked
                        ? [...new Set([...next, allInOption])]
                        : next.filter((o) => o !== allInOption),
                      { shouldValidate: true, shouldDirty: true },
                    );
                  }}
                />
              ))}
            </SimpleGrid>

            {formState.errors.serviceOptions?.message && (
              <Text size="xs" c="red">
                {formState.errors.serviceOptions.message}
              </Text>
            )}
          </Stack>
        )}
        <Controller
          control={control}
          name="commodity"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              value={field.value ?? ""}
              label="COMMODITY"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="cargoType"
          render={({ field, fieldState }) => (
            <Radio.Group
              {...field}
              label="SHIPMENT MODE"
              error={fieldState.error?.message}
              onChange={(value) => {
                field.onChange(value);

                if (value === "LCL") {
                  setValue("containerSize", "", { shouldValidate: true });
                }
              }}
            >
              <Group mt="xs">
                <Radio value="CONTAINERIZED" label="CONTAINERIZED" />
                <Radio value="LCL" label="LESS THAN CONTAINER LOAD (LCL)" />
              </Group>
            </Radio.Group>
          )}
        />
        {cargoType === "CONTAINERIZED" && transportMode === "SEA" && (
          <Controller
            control={control}
            name="containerSize"
            render={({ field, fieldState }) => (
              <Radio.Group
                value={field.value}
                onChange={field.onChange}
                label="CONTAINER SIZE"
                error={fieldState.error?.message}
              >
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xs">
                  {containerCards.map((container) => {
                    const checked = field.value === container.value;

                    return (
                      <Radio.Card
                        key={container.value}
                        value={container.value}
                        checked={checked}
                        withBorder
                        radius="md"
                        p={0}
                        style={{
                          overflow: "hidden",
                          position: "relative",
                          borderColor: checked
                            ? "var(--mantine-color-jltBlue-6)"
                            : undefined,
                          transition: "all 150ms ease",
                        }}
                      >
                        <Radio.Indicator
                          checked={checked}
                          style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            zIndex: 1,
                          }}
                        />

                        <Box px="md" py="sm">
                          <Box
                            style={{
                              borderRadius: 6,
                              maxWidth: "8.025rem",
                              padding: "8px 12px",
                            }}
                            bg={"jltBlue"}
                            ta={"center"}
                          >
                            <Text fw={800} c="white" size="xl" lh={1.3}>
                              {container.title}
                            </Text>
                            <Text fw={600} c="white" size="xs">
                              {container.subtitle}
                            </Text>
                            <Text c="white" size="xs" opacity={0.75}>
                              ({container.code})
                            </Text>
                          </Box>

                          <Box
                            style={{
                              width: "100%",
                              aspectRatio: "5/4",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              lineHeight: 0,
                            }}
                          >
                            {container.image}
                          </Box>
                        </Box>
                      </Radio.Card>
                    );
                  })}
                </SimpleGrid>
              </Radio.Group>
            )}
          />
        )}
        {formState.errors.containerSize?.message && (
          <Text size="xs" c="red">
            {formState.errors.containerSize.message}
          </Text>
        )}
        <Group grow align="flex-start">
          <Controller
            control={control}
            name="origin"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value ?? ""}
                label="ORIGIN"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="destination"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value ?? ""}
                label="DESTINATION"
                error={fieldState.error?.message}
              />
            )}
          />
        </Group>
        <Controller
          control={control}
          name="remarks"
          render={({ field }) => (
            <Textarea {...field} value={field.value ?? ""} label="REMARKS" />
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
