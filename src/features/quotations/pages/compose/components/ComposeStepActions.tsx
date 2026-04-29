import { Group } from "@mantine/core";
import { AppButton } from "@/components/ui/AppButton";
import { ArrowForward } from "@nine-thirty-five/material-symbols-react/rounded";

interface ComposeStepActionsProps {
  step: number;
  isStep0Valid: boolean;
  canProceedStep2: boolean;
  previewReady: boolean;
  isSending: boolean;
  quotationDetailsFormId: string;
  billingDetailsFormId: string;
  onStep2Next: () => void;
  onOpenSendConfirm: () => void;
}

export function ComposeStepActions({
  step,
  isStep0Valid,
  canProceedStep2,
  previewReady,
  isSending,
  quotationDetailsFormId,
  billingDetailsFormId,
  onStep2Next,
  onOpenSendConfirm,
}: ComposeStepActionsProps) {
  return (
    <>
      {step < 2 && (
        <Group
          justify="flex-end"
          mt="lg"
          style={{ marginTop: "auto", flexShrink: 0 }}
        >
          {step === 0 ? (
            <AppButton
              variant="primary"
              type="submit"
              form={quotationDetailsFormId}
              disabled={!isStep0Valid}
              w="10rem"
              icon={ArrowForward}
            >
              Next
            </AppButton>
          ) : (
            <AppButton
              variant="primary"
              type="submit"
              form={billingDetailsFormId}
              w="10rem"
              icon={ArrowForward}
            >
              Next
            </AppButton>
          )}
        </Group>
      )}

      {step === 2 && !previewReady && (
        <Group
          justify="flex-end"
          mt="lg"
          style={{ marginTop: "auto", flexShrink: 0 }}
        >
          <AppButton
            variant="primary"
            onClick={onStep2Next}
            disabled={!canProceedStep2}
            w="10rem"
            icon={ArrowForward}
          >
            Next
          </AppButton>
        </Group>
      )}

      {step === 2 && previewReady && (
        <Group justify="flex-end" mt="lg" style={{ flexShrink: 0 }}>
          <AppButton
            variant="primary"
            onClick={onOpenSendConfirm}
            disabled={isSending}
            icon={ArrowForward}
          >
            Send
          </AppButton>
        </Group>
      )}
    </>
  );
}
