import { Modal, Button, Text, Group, Stack, rem } from '@mantine/core';
import { Warning } from "@nine-thirty-five/material-symbols-react/outlined";

type Props = {
    activeModal: string | null;
    onClose: () => void;
    onConfirm: () => void;
}

export default function CreatePlanningTimelineModal({ activeModal, onClose, onConfirm }: Props) {
  return (
    <Modal
      opened={activeModal === "make"}
      onClose={onClose}
      title="CREATE PLANNING AND TIMELINE"
      centered
      withCloseButton={false} 
      size="md"
      styles={{
        header: {
          backgroundColor: '#f1f3f5', 
          padding: '16px 24px',
          borderBottom: '1px solid #e9ecef',
        },
        title: {
          color: '#1c2438', 
          fontWeight: 700,
          fontSize: '16px',
          letterSpacing: '0.5px',
        },
        body: {
          padding: 0, 
        },
        content: {
          overflow: 'hidden', 
          borderRadius: '8px',
        }
      }}
    >
      {/* Main Content Area */}
      <Stack align="center" gap="sm" pt={40} pb={40} px={32}>
        <Warning 
          width={80} 
          color="#ff0000" 
          strokeWidth={1.5}
          style={{ marginBottom: rem(10) }}
        />
        
        <Text fw={600} size="xl" c="#000" ta="center">
          Create Planning and Timeline?
        </Text>
        
        <Text size="sm" c="dimmed" ta="center" lh={1.5} style={{ maxWidth: 400 }}>
          You're about to Create a Planning and Timeline for this Pre-Alert. Please review all details carefully.
        </Text>
      </Stack>

      {/* Action Buttons Footer */}
      <Group gap={0} grow style={{ borderTop: '1px solid #e9ecef' }}>
        <Button 
          onClick={onConfirm}
          radius={0}
          size="lg"
          styles={{
            root: {
              backgroundColor: '#1c2438', 
              color: '#ffffff',
              height: 60,
              '&:hover': {
                backgroundColor: '#121824',
              }
            },
            label: {
              fontWeight: 600,
              letterSpacing: '1px'
            }
          }}
        >
          YES
        </Button>
        
        <Button 
          onClick={onClose}
          radius={0}
          size="lg"
          styles={{
            root: {
              backgroundColor: '#e9ecef', 
              color: '#1c2438',
              height: 60,
              '&:hover': {
                backgroundColor: '#dee2e6',
              }
            },
            label: {
              fontWeight: 600,
              letterSpacing: '1px'
            }
          }}
        >
          CANCEL
        </Button>
      </Group>
    </Modal>
  );
}