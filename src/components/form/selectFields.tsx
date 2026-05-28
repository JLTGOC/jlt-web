import {
  MultiSelect,
  NativeSelect,
  Select,
  type MultiSelectProps,
  type NativeSelectProps,
  type SelectProps,
} from "@mantine/core";
import { Controller, type FieldValues } from "react-hook-form";
import type { BaseFieldProps } from "./fieldTypes";

export type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<SelectProps, "value" | "onChange" | "onBlur" | "error" | "name"> & {
    readOnly?: boolean;
  };

export function SelectField<T extends FieldValues>({
  control,
  name,
  rules,
  readOnly,
  ...rest
}: SelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Select
          {...rest}
          value={
            typeof field.value === "string" && field.value.trim() === ""
              ? null
              : (field.value ?? null)
          }
          onChange={(value) => {
            if (readOnly) {
              return;
            }
            field.onChange(value ?? "");
          }}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export type NativeSelectFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<NativeSelectProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function NativeSelectField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: NativeSelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <NativeSelect
          {...rest}
          {...field}
          value={field.value ?? ""}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export type MultiSelectFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<MultiSelectProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function MultiSelectField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: MultiSelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <MultiSelect
          {...rest}
          value={field.value ?? []}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
