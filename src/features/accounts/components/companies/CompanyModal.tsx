import { Modal, Box, Text, Button } from "@mantine/core";
import { Apartment, CheckCircle, Cancel } from "@nine-thirty-five/material-symbols-react/outlined";

export type CompanyModalMode = "add" | "edit";
export type CompanyModalStage = "confirm" | "success" | "error";

interface CompanyModalProps {
  opened: boolean;
  mode: CompanyModalMode;
  stage: CompanyModalStage;
  isLoading?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const modeConfig = {
  add: {
    headerTitle: "ADD COMPANY",
    confirmTitle: "ARE YOU SURE YOU WANT TO ADD THIS COMPANY?",
    confirmSubtitle:
      " Please review the information you’ve entered before saving.\nOnce added, you can update company details, addresses, compliance record, and documents anytime.",
    confirmButtonText: "SAVE",
    confirmIconColor: "#007406",
    successSubtitle:
      " The company has been added to the system.\nYou can now view, manage, and update the company details anytime.",
  },
  edit: {
    headerTitle: "EDIT COMPANY",
    confirmTitle: "ARE YOU SURE YOU WANT TO UPDATE THIS COMPANY?",
    confirmSubtitle:
      " Please review the changes before saving.\nOnce submitted, everything will be overwritten.",
    confirmButtonText: "UPDATE",
    confirmIconColor: "#FF9933",
    successSubtitle:
      " The company has been updated successfully.\nYou can now view, manage, and update the company details anytime.",
  },
};

export function CompanyModal({
  opened,
  mode,
  stage,
  isLoading = false,
  errorMessage,
  onClose,
  onConfirm,
}: CompanyModalProps) {
  const config = modeConfig[mode];
  const isConfirm = stage === "confirm";
  const isSuccess = stage === "success";
  const isError = stage === "error";

  const confirmIcon = (
    <Apartment
      width={56}
      height={56}
      color={config.confirmIconColor}
      style={{ marginBottom: 16 }}
    />
  );

  const successIcon = (
    <CheckCircle width={56} height={56} color="#007406" style={{ marginBottom: 16 }} />
  );

  const errorIcon = (
    <Cancel width={56} height={56} color="#FF0004" style={{ marginBottom: 16 }} />
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      title={null}
      size="lg"
      styles={{ content: { maxWidth: 520, width: "100%" } }}
    >
      <Box
        style={{
          backgroundColor: "#EBEBEB",
          borderRadius: 5,
          padding: "1rem 1.25rem",
          textAlign: "center",
        }}
      >
        <Text size="lg" fw={700}>
          {config.headerTitle}
        </Text>
      </Box>

      <Box style={{ marginTop: 24, textAlign: "center" }}>
        {isConfirm && confirmIcon}
        {isSuccess && successIcon}
        {isError && errorIcon}

        {isConfirm && (
          <>
            <Text fw={700} size="lg" style={{ marginBottom: 12 }}>
              {config.confirmTitle}
            </Text>
            <Text c="dimmed" size="sm" style={{ whiteSpace: "pre-line", marginBottom: 24 }}>
              {config.confirmSubtitle}
            </Text>
            <Button
              fullWidth
              style={{ backgroundColor: "#1D274E" }}
              onClick={onConfirm}
              loading={isLoading}
            >
              {config.confirmButtonText}
            </Button>
          </>
        )}

        {isSuccess && (
          <>
            <Text fw={700} size="lg" style={{ marginBottom: 12 }}>
              SUCCESSFULLY SUBMITTED!
            </Text>
            <Text c="dimmed" size="sm" style={{ whiteSpace: "pre-line", marginBottom: 24 }}>
              {config.successSubtitle}
            </Text>
            <Button fullWidth style={{ backgroundColor: "#1D274E" }} onClick={onClose}>
              OK
            </Button>
          </>
        )}

        {isError && (
          <>
            <Text fw={700} size="lg" style={{ marginBottom: 12 }}>
              THERE WAS AN ERROR
            </Text>
            <Text c="dimmed" size="sm" style={{ whiteSpace: "pre-line", marginBottom: 12 }}>
              please check the details carefully
            </Text>
            {errorMessage ? (
              <Text c="red" size="sm" style={{ textAlign: "center", marginBottom: 24 }}>
                {errorMessage}
              </Text>
            ) : null}
            <Button fullWidth style={{ backgroundColor: "#1D274E" }} onClick={onClose}>
              OK
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}
