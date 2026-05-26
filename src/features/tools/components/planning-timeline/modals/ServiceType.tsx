import { Divider, Modal, Stack, Text } from "@mantine/core";
import { NumberedOptionButton } from "@/components/NumberedOptionButton";

interface ServiceTypeProps {
    opened: boolean;
    onClose: () => void;
    onSelect?: (serviceType: "REGULATORY" | "LOGISTICS") => void;
}

const SERVICE_TYPES = [
    {
        number: 1,
        label: "REGULATORY SERVICES",
        value: "REGULATORY" as const,
    },
    {
        number: 2,
        label: "LOGISTICS SERVICES",
        value: "LOGISTICS" as const,
    },
];

export default function ServiceTypeModal({ opened, onClose, onSelect }: ServiceTypeProps) {
    const handleSelect = (serviceType: "REGULATORY" | "LOGISTICS") => {
        onSelect?.(serviceType);
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            withCloseButton={false}
            padding={0}
            radius="md"
            size={380}
        >
            <Stack gap={0} px="lg" py="md">
                <Text ta="center" fw={500} size="sm" c="dimmed" tt="uppercase">
                    CHOOSE TYPE OF SERVICE
                </Text>
                <Divider my="sm" />

                <Stack gap="lg" py="xs">
                    {SERVICE_TYPES.map((serviceType) => (
                        <NumberedOptionButton
                            key={serviceType.value}
                            number={serviceType.number}
                            label={serviceType.label}
                            onClick={() => handleSelect(serviceType.value)}
                        />
                    ))}
                </Stack>
            </Stack>
        </Modal>
    );
}