import { useMemo, useState } from "react";
import { Button, Group, Stack, TextInput, Textarea } from "@mantine/core";
import { ToolModal } from "@/features/tools/components/ToolModal";
import type { MessageTemplateResource } from "@/features/tools/api/message-templates.service";

interface MessageTemplateFormValues {
  template_name: string;
  message: string;
}

interface MessageTemplateModalProps {
  opened: boolean;
  mode: "create" | "edit";
  initialValues?: Pick<MessageTemplateResource, "template_name" | "message">;
  isSubmitting?: boolean;
  fieldErrors?: Partial<Record<keyof MessageTemplateFormValues, string>>;
  onClose: () => void;
  onSubmit: (values: MessageTemplateFormValues) => void;
}

export function MessageTemplateModal({
  opened,
  mode,
  initialValues,
  isSubmitting = false,
  fieldErrors,
  onClose,
  onSubmit,
}: MessageTemplateModalProps) {
  const [values, setValues] = useState<MessageTemplateFormValues>(() => ({
    template_name: initialValues?.template_name ?? "",
    message: initialValues?.message ?? "",
  }));
  const [localErrors, setLocalErrors] = useState<
    Partial<Record<keyof MessageTemplateFormValues, string>>
  >({});

  const mergedErrors = useMemo(
    () => ({ ...localErrors, ...fieldErrors }),
    [localErrors, fieldErrors],
  );

  const title =
    mode === "create" ? "Create Message Template" : "Edit Message Template";
  const submitLabel = mode === "create" ? "Create" : "Update";

  const validate = () => {
    const errors: Partial<Record<keyof MessageTemplateFormValues, string>> = {};

    if (!values.template_name.trim()) {
      errors.template_name = "Template name is required";
    } else if (values.template_name.trim().length > 255) {
      errors.template_name = "Template name must be at most 255 characters";
    }

    if (!values.message.trim()) {
      errors.message = "Message is required";
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({
      template_name: values.template_name.trim(),
      message: values.message.trim(),
    });
  };

  return (
    <ToolModal
      opened={opened}
      onClose={onClose}
      title={title}
      titleColor="jltAccent.9"
      headerBgColor="#EBEBEB"
    >
      <Stack gap="md">
        <TextInput
          label="Template Name"
          placeholder="Enter template name"
          value={values.template_name}
          maxLength={255}
          withAsterisk
          error={mergedErrors.template_name}
          onChange={(event) => {
            const nextValue = event.currentTarget.value;
            setValues((current) => ({
              ...current,
              template_name: nextValue,
            }));
          }}
        />
        <Textarea
          label="Message"
          placeholder="Enter message"
          value={values.message}
          minRows={5}
          autosize
          withAsterisk
          error={mergedErrors.message}
          onChange={(event) => {
            const nextValue = event.currentTarget.value;
            setValues((current) => ({
              ...current,
              message: nextValue,
            }));
          }}
        />
        <Group justify="end" mt="sm">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            color="jltAccent.6"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </ToolModal>
  );
}
