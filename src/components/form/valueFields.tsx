import {
  FileInput,
  NumberInput,
  type FileInputProps,
  type NumberInputProps,
} from "@mantine/core";
import { DateInput, type DateInputProps } from "@mantine/dates";
import dayjs from "dayjs";
import { Controller, type FieldValues } from "react-hook-form";
import type { BaseFieldProps } from "./fieldTypes";

function toDateValue(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  return null;
}

export type NumberInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<NumberInputProps, "value" | "onChange" | "onBlur" | "error" | "name"> & {
    readOnly?: boolean;
  };

export function NumberInputField<T extends FieldValues>({
  control,
  name,
  rules,
  readOnly,
  ...rest
}: NumberInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <NumberInput
          {...rest}
          value={field.value ?? ""}
          onChange={(value) => {
            if (readOnly) {
              return;
            }
            field.onChange(value);
          }}
          onBlur={field.onBlur}
          readOnly={readOnly}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export type FileInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<FileInputProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function FileInputField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: FileInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <FileInput
          {...rest}
          value={field.value ?? null}
          onChange={(file) => field.onChange(file)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export type DateInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<DateInputProps, "value" | "onChange" | "onBlur" | "error" | "name"> & {
    readOnly?: boolean;
  };

export function DateInputField<T extends FieldValues>({
  control,
  name,
  rules,
  readOnly,
  ...rest
}: DateInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <DateInput
          {...rest}
          value={toDateValue(field.value)}
          onChange={(value) => {
            if (readOnly) {
              return;
            }
            field.onChange(value ? dayjs(value).format("YYYY-MM-DD") : "");
          }}
          onBlur={field.onBlur}
          readOnly={readOnly}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
