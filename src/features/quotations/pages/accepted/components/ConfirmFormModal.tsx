import { Box, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { Article } from "@nine-thirty-five/material-symbols-react/outlined";

type ConfirmFormModalProps = {
	opened: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading?: boolean;
};

export default function ConfirmFormModal({
	opened,
	onClose,
	onConfirm,
	isLoading = false,
}: ConfirmFormModalProps) {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="SEND JOB ORDER"
			centered
			size={420}
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
					color: "#1e3049",
					fontSize: "1.05rem",
					fontWeight: 700,
					letterSpacing: "0.02em",
					textTransform: "uppercase",
					textAlign: "center",
					width: "100%",
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
			<Stack gap="0.75rem" py="1.25rem" px="1.5rem" align="center">
				<Box
					w={88}
					h={88}
					pos="relative"
					display="flex"
					style={{ alignItems: "center", justifyContent: "center" }}
				>
					<Box
						w={72}
						h={72}
						display="flex"
						style={{
							alignItems: "center",
							justifyContent: "center",
							borderRadius: 12,
							border: "2px solid #b64b53",
							background: "#fff5f6",
						}}
					>
						<Article width={44} height={44} color="#b64b53" />
					</Box>
					<Box
						w={22}
						h={22}
						pos="absolute"
						bottom={4}
						right={4}
						display="flex"
						style={{
							alignItems: "center",
							justifyContent: "center",
							borderRadius: "50%",
							background: "#b64b53",
							boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
						}}
					>
						<Text c="#ffffff" fz="0.75rem" fw={700} lh={1}>
							!
						</Text>
					</Box>
				</Box>

				<Stack gap={4} align="center">
					<Text fw={700} c="#1e3049" ta="center" fz="0.85rem" tt="uppercase">
						Are you sure you want to send this quotation?
					</Text>
					<Text c="#5f6673" ta="center" fz="0.74rem" lh={1.35} maw={300}>
						You&apos;re about to submit this job order to Operations. Please ensure all
						information is accurate and complete. Once accepted by Operations, no further
						changes can be made.
					</Text>
				</Stack>
			</Stack>

			<Box bg="#1d2a56" px="1.5rem" py="0.65rem">
				<Group justify="center">
					<Button
						onClick={onConfirm}
						loading={isLoading}
						disabled={isLoading}
						styles={{
							root: {
								color: "#ffffff",
								fontWeight: 600,
								letterSpacing: "0.06em",
								textTransform: "uppercase",
								paddingInline: 26,
								background: "transparent",
							},
							label: {
								color: "#ffffff",
							},
						}}
						variant="subtle"
					>
						Send Job Order
					</Button>
				</Group>
			</Box>
		</Modal>
	);
}
