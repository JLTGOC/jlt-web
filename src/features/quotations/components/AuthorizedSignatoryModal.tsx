import { zodResolver } from "@hookform/resolvers/zod";
import {
  Checkbox,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  Button,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { CloudUpload } from "@nine-thirty-five/material-symbols-react/outlined";
import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { TextInputField } from "@/components/form/textFields";
import {
  signatorySchema,
  type SignatoryValues,
} from "@/features/quotations/schemas/compose.schema";
import type { ViewerSignatoryValues } from "@/features/quotations/types/compose.types";

interface AuthorizedSignatoryModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (values: ViewerSignatoryValues) => void;
  currentUserName?: string;
  currentUserPositionTitle?: string;
  initialValues?: ViewerSignatoryValues | null;
}

type SignatoryFormInput = z.input<typeof signatorySchema>;

export function AuthorizedSignatoryModal({
  opened,
  onClose,
  onSave,
  currentUserName,
  currentUserPositionTitle,
  initialValues,
}: AuthorizedSignatoryModalProps) {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState,
  } = useForm<SignatoryFormInput, unknown, SignatoryValues>({
    resolver: zodResolver(signatorySchema),
    mode: "onChange",
    defaultValues: {
      complementary_close: "",
      is_authorized_signatory: false,
      authorized_signatory_name: "",
      position_title: "",
      signature_file: null,
    },
  });

  const signatureFile = useWatch({ control, name: "signature_file" }) ?? null;

  const previewUrl = useMemo(
    () => (signatureFile ? URL.createObjectURL(signatureFile) : null),
    [signatureFile],
  );
  const previewSrc = previewUrl ?? initialValues?.signature_file_url ?? null;
  const hasSignature = Boolean(
    signatureFile || initialValues?.signature_file_url,
  );

  useEffect(() => {
    if (!opened) {
      return;
    }

    reset({
      complementary_close: initialValues?.complementary_close ?? "",
      is_authorized_signatory: initialValues?.is_authorized_signatory ?? false,
      authorized_signatory_name: initialValues?.authorized_signatory_name ?? "",
      position_title: initialValues?.position_title ?? "",
      signature_file: initialValues?.signature_file ?? null,
    });
  }, [initialValues, opened, reset]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (hasSignature) {
      clearErrors("signature_file");
    }
  }, [clearErrors, hasSignature]);

  function handleModalClose() {
    reset();
    onClose();
  }

  function handleFileDrop(files: File[]) {
    const file = files[0] ?? null;
    setValue("signature_file", file, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleReject() {
    setValue("signature_file", null, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleSave(values: SignatoryValues) {
    if (!hasSignature) {
      setError("signature_file", {
        type: "required",
        message: "Upload a signature before saving.",
      });
      return;
    }

    onSave({
      ...values,
      signature_file_url: values.signature_file
        ? null
        : (initialValues?.signature_file_url ?? null),
    });
  }

  return (
    <Modal
      opened={opened}
      onClose={handleModalClose}
      title="AUTHORIZED SIGNATORY"
      centered
      size="sm"
      styles={{
        title: { fontWeight: 600, width: "100%", textAlign: "center" },
      }}
    >
      <Divider mb="sm" />
      <form id="signatory-form" onSubmit={handleSubmit(handleSave)}>
        <Stack gap="sm">
          <TextInputField
            control={control}
            name="complementary_close"
            placeholder="COMPLEMENTARY CLOSE"
          />

          <Controller
            control={control}
            name="is_authorized_signatory"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(event) => {
                  const checked = event.currentTarget.checked;
                  field.onChange(checked);
                  setValue(
                    "authorized_signatory_name",
                    checked ? (currentUserName ?? "") : "",
                    { shouldDirty: true, shouldValidate: true },
                  );
                  setValue(
                    "position_title",
                    checked ? (currentUserPositionTitle ?? "") : "",
                    { shouldDirty: true, shouldValidate: true },
                  );
                }}
                label="I AM THE AUTHORIZED SIGNATORY"
              />
            )}
          />

          <TextInputField
            control={control}
            name="authorized_signatory_name"
            placeholder="AUTHORIZED SIGNATORY NAME"
          />

          <TextInputField
            control={control}
            name="position_title"
            placeholder="POSITION/TITLE"
          />

          <Dropzone
            onDrop={handleFileDrop}
            onReject={handleReject}
            accept={["image/png", "image/jpeg"]}
            maxFiles={1}
            multiple={false}
            maxSize={2 * 1024 ** 2}
            radius="md"
          >
            {previewSrc ? (
              <Stack align="center" gap="xs" py="sm">
                <img
                  src={previewSrc}
                  alt="Signature preview"
                  style={{
                    width: "8rem",
                    height: "8rem",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <Text size="xs" c="dimmed">
                  {signatureFile?.name ?? "Current signature"}
                </Text>
              </Stack>
            ) : (
              <Stack
                align="center"
                justify="center"
                gap="xs"
                py="md"
                style={{ minHeight: "10rem", pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <CloudUpload
                      width="2rem"
                      height="2rem"
                      color="var(--mantine-color-jltBlue-8)"
                    />
                  </div>
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <CloudUpload
                      width="3rem"
                      height="3rem"
                      color="var(--mantine-color-red-6)"
                    />
                  </div>
                  <Text size="xs" c="red" ta="center">
                    Only PNG or JPG files are accepted
                  </Text>
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <CloudUpload
                      width="3rem"
                      height="3rem"
                      color="var(--mantine-color-gray-6)"
                    />
                  </div>
                  <Text size="sm" fw={500} ta="center">
                    Upload Signature
                  </Text>
                </Dropzone.Idle>
              </Stack>
            )}
          </Dropzone>
          {formState.errors.signature_file?.message && (
            <Text size="xs" c="red">
              {formState.errors.signature_file.message}
            </Text>
          )}
        </Stack>
      </form>
      <Group justify="center">
        <Button
          type="submit"
          color="jltAccent.6"
          form="signatory-form"
          disabled={!hasSignature || !formState.isValid}
          mt="md"
          style={{ alignSelf: "center", display: "flex", margin: "0 auto" }}
        >
          SAVE
        </Button>
      </Group>
    </Modal>
  );
}
