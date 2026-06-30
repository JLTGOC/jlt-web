import { Button, Group, Modal, Text } from "@mantine/core";
import type { ModalType } from "@/features/job-order/types/operations";

type AcceptProps = {
   activeModal: ModalType;
    onConfirm: () => void;
    onClose: () => void;
    isSubmitting?: boolean;
}

export default function AcceptModal({
  activeModal,
  onClose,
  onConfirm,
  isSubmitting = false,
}: AcceptProps) {
    return(
        <>
        <Modal
        opened={activeModal === "accept"}
        onClose={onClose}
        title="ACCEPT REQUEST"
        centered
        size={600}
        overlayProps={{ color: "#121f4a", opacity: 0.55 }}
        styles={{
          content: {
            borderRadius: "0.375rem",
            overflow: "hidden",
          },
          header: {
            background: "#e8e8e8",
            borderBottom: "1px solid #d7d7d7",
            minHeight: "3.125rem",
            padding: "0.75rem 1.5rem",
          },
          title: {
            color: "#16345b",
            fontSize: "1.2rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          },
          close: {
            color: "#0f1427",
          },
          body: {
            padding: "1.5rem",
          },
        }}
      >
        <Text c="#1f1f1f" fz=".9rem" lh={1.4} mb="1.75rem">
          You are about to <strong>ACCEPT</strong> this request.
          <br />
          <br />
          This request will be assigned to you,
          <br />
          and you will be responsible for generating shipment.
          <br />
          <br />
          Do you want to proceed?
        </Text>
        <Group justify="center">
          <Button
            radius={12}
            h={40}
            miw={320}
            tt="uppercase"
            styles={{
              root: {
                background: "#1a2556",
                "&:hover": {
                  background: "#17214c",
                },
                "&:focusVisible": {
                  outline: "2px solid #2d458f",
                  outlineOffset: "2px",
                },
              },
              label: {
                color: "#ffffff",
                fontSize: ".9rem",
                fontWeight: 500,
                letterSpacing: "0.01em",
              },
            }}
            onClick={onConfirm}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            ACCEPT
          </Button>
        </Group>
      </Modal></>
    )
}