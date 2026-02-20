/**
 * src/components/form/index.tsx
 *
 * React Hook Form + Mantine v8 connected form field components.
 * All components accept a `control` prop from useForm() and wire up
 * value, onChange, onBlur, and error automatically.
 *
 * Usage:
 * ```tsx
 * const { control } = useForm<FormValues>({ resolver: zodResolver(schema) });
 *
 * <TextInputField control={control} name="email" label="Email" />
 * <PasswordInputField control={control} name="password" label="Password" />
 * <SelectField control={control} name="role" label="Role" data={roleOptions} />
 * ```
 */

import {
  TextInput,
  PasswordInput,
  Select,
  MultiSelect,
  Textarea,
  NumberInput,
  Checkbox,
  Switch,
  Radio,
  FileInput,
  type TextInputProps,
  type PasswordInputProps,
  type SelectProps,
  type MultiSelectProps,
  type TextareaProps,
  type NumberInputProps,
  type CheckboxProps,
  type SwitchProps,
  type FileInputProps,
} from "@mantine/core";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

// ============================================
// Shared base props for all field components
// ============================================

interface BaseFieldProps<T extends FieldValues> {
  /** react-hook-form control object from useForm() */
  control: Control<T>;
  /** Field name — must match a key in your form schema */
  name: Path<T>;
  /** Validation rules (optional — prefer Zod schema validation) */
  rules?: RegisterOptions<T>;
}

// ============================================
// TextInputField
// ============================================

type TextInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<TextInputProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function TextInputField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: TextInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextInput
          {...rest}
          {...field}
          value={field.value ?? ""}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ============================================
// PasswordInputField
// ============================================

type PasswordInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<PasswordInputProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function PasswordInputField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: PasswordInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <PasswordInput
          {...rest}
          {...field}
          value={field.value ?? ""}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ============================================
// SelectField
// ============================================

type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<SelectProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function SelectField<T extends FieldValues>({
  control,
  name,
  rules,
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
          value={field.value ?? null}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ============================================
// MultiSelectField
// ============================================

type MultiSelectFieldProps<T extends FieldValues> = BaseFieldProps<T> &
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

// ============================================
// TextareaField
// ============================================

type TextareaFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<TextareaProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function TextareaField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: TextareaFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Textarea
          {...rest}
          {...field}
          value={field.value ?? ""}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ============================================
// NumberInputField
// ============================================

type NumberInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<NumberInputProps, "value" | "onChange" | "onBlur" | "error" | "name">;

export function NumberInputField<T extends FieldValues>({
  control,
  name,
  rules,
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
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ============================================
// CheckboxField
// ============================================

type CheckboxFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<CheckboxProps, "checked" | "onChange" | "onBlur" | "error" | "name">;

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: CheckboxFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Checkbox
          {...rest}
          checked={field.value ?? false}
          onChange={(event) => field.onChange(event.currentTarget.checked)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ============================================
// SwitchField
// ============================================

type SwitchFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<SwitchProps, "checked" | "onChange" | "onBlur" | "error" | "name">;

export function SwitchField<T extends FieldValues>({
  control,
  name,
  rules,
  ...rest
}: SwitchFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Switch
          {...rest}
          checked={field.value ?? false}
          onChange={(event) => field.onChange(event.currentTarget.checked)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

// ============================================
// RadioGroupField
// ============================================

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupFieldProps<
  T extends FieldValues,
> extends BaseFieldProps<T> {
  label?: string;
  description?: string;
  options: RadioOption[];
  /** Layout direction */
  direction?: "row" | "column";
}

export function RadioGroupField<T extends FieldValues>({
  control,
  name,
  rules,
  label,
  description,
  options,
  direction = "column",
}: RadioGroupFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Radio.Group
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          label={label}
          description={description}
          error={fieldState.error?.message}
        >
          <div
            style={{
              display: "flex",
              flexDirection: direction,
              gap: "var(--mantine-spacing-xs)",
              marginTop: "var(--mantine-spacing-xs)",
            }}
          >
            {options.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
              />
            ))}
          </div>
        </Radio.Group>
      )}
    />
  );
}

// ============================================
// FileInputField
// ============================================

type FileInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
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

// ============================================
// Re-exports for convenience
// ============================================

export type {
  TextInputFieldProps,
  PasswordInputFieldProps,
  SelectFieldProps,
  MultiSelectFieldProps,
  TextareaFieldProps,
  NumberInputFieldProps,
  CheckboxFieldProps,
  SwitchFieldProps,
  RadioGroupFieldProps,
  FileInputFieldProps,
};
