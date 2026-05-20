import { Box, Button, Group, Modal, Stack, Text } from "@mantine/core";

type Props = {
	opened: boolean;
	onClose: () => void;
};

export default function GenerateShipmentConfirmModal({ opened, onClose }: Props) {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="CONFIRM GENERATE SHIPMENT"
			centered
			size={520}
			overlayProps={{ color: "#121f4a", opacity: 0.55 }}
			withCloseButton
			styles={{
				content: {
					borderRadius: "0.375rem",
					overflow: "hidden",
				},
				header: {
					background: "#ececec",
					borderBottom: "1px solid #d7d7d7",
					minHeight: "3.125rem",
					padding: "0.75rem 1.5rem",
				},
				title: {
					color: "#16345b",
					fontSize: "1.05rem",
					fontWeight: 700,
					letterSpacing: "0.02em",
					textTransform: "uppercase",
				},
				close: {
					color: "#0f1427",
				},
				body: {
					padding: 0,
					background: "#ffffff",
				},
			}}
		>
			<Stack gap="0.9rem" py="1.2rem" px="1.5rem" align="center">
				<Group gap="md" justify="center" align="center" wrap="nowrap">
					<svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect x="3" y="4" width="14" height="18" rx="2" fill="#E6F7EA" />
						<path d="M9 2h6v2" stroke="#1D7A3A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
						<path d="M8 11l2.2 2.4L16 8.6" stroke="#1D7A3A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
						<rect x="5" y="2" width="10" height="2" rx="1" fill="#1D7A3A" opacity="0.06" />
					</svg>
				</Group>

				<Stack gap={2} align="center">
					<Text fw={700} c="#1e3049" ta="center" fz="0.95rem" tt="uppercase">
						Successfully Sent!
					</Text>

					<Text c="#5f6673" ta="center" fz="0.74rem" lh={1.35} maw={280}>
						The generated Shipments is successfully sent to Operations. They will receive a notification of the
						created Shipment.
					</Text>
				</Stack>
			</Stack>

			<Box bg="#1d2a56" px="1.5rem" py="0.6rem">
				<Group justify="center">
					<Button
						variant="subtle"
						onClick={onClose}
						styles={{
							root: {
								color: "#ffffff",
								fontWeight: 600,
								letterSpacing: "0.06em",
								textTransform: "uppercase",
								paddingInline: 22,
							},
						}}
					>
						Okay
					</Button>
				</Group>
			</Box>
		</Modal>
	);
}

