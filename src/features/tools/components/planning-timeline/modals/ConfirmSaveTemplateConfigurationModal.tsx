import React from 'react';
import { Modal, Text, Button, Stack, Box, rem, Loader } from '@mantine/core';
import { IconFileText, IconAlertCircle, IconSend } from '@tabler/icons-react';
interface CreateTemplateModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  isPending: boolean;
}

export function ConfirmSaveTemplate({ opened, onClose, onConfirm, isPending }: CreateTemplateModalProps) {

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton
      size="md"
      radius="md"
      title="CREATE TEMPLATE"
      styles={{
        header: {
          borderBottom: '1px solid #E9ECEF',
          padding: `${rem(16)} ${rem(24)}`,
        },
        title: {
          fontWeight: 700,
          fontSize: rem(16),
          color: '#1A1B1F',
          textAlign: 'center',
        },
        body: {
          padding: `${rem(40)} ${rem(32)}`,
        },
      }}
    >
      <Stack align="center" gap="lg">
        {/* Custom Red Document Icon Illustration from image_ffc404.png */}
        <Box style={{ position: 'relative', color: '#B04147' }}>
          <IconFileText 
            size={100} 
            strokeWidth={1.5} 
            style={{ display: 'block' }} 
          />
          <Box
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              backgroundColor: '#FFF',
              borderRadius: '50%',
            }}
          >
            <IconAlertCircle 
              size={28} 
              fill="#B04147" 
              color="#FFF" 
              strokeWidth={2} 
            />
          </Box>
        </Box>

        {/* Main Content Texts */}
        <Stack gap="xs" align="center" style={{ textAlign: 'center' }}>
          <Text 
            fw={800} 
            size="md" 
            c="#1A1B1F" 
            style={{ letterSpacing: '0.5px' }}
          >
            ARE YOU SURE YOU WANT TO CREATE THIS TEMPLATE?
          </Text>
          
          <Stack gap={4}>
            <Text size="sm" c="#666A73">
              You are about to create a new workflow template.
            </Text>
            <Text size="sm" c="#666A73">
              Please ensure all template details and configurations
            </Text>
            <Text size="sm" c="#666A73">
              are complete before proceeding.
            </Text>
          </Stack>
        </Stack>

        {/* Action Button */}
        <Button
          leftSection={<IconSend size={16} />}
          size="md"
          radius="sm"
          fullWidth
          loading ={isPending}
          onClick={onConfirm}
          styles={{
            root: {
              backgroundColor: '#1F2A4A',
              height: rem(48),
              transition: 'background-color 150ms ease',
              '&:hover': {
                backgroundColor: '#151C33',
              },
            },
            label: {
              fontWeight: 600,
              letterSpacing: '1px',
            },
          }}
        >
          CREATE TEMPLATE
        </Button>
      </Stack>
    </Modal>
  );
}