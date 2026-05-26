import { Box, Button, Group, Modal, Stack, Text } from "@mantine/core";
import {
	Article,
	CheckCircle,
} from "@nine-thirty-five/material-symbols-react/outlined";

type SuccessFormModalProps = {
	opened: boolean;
	onClose: () => void;
};

export default function SuccessFormModal({
	opened,
	onClose,
}: SuccessFormModalProps) {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="SEND JOBORDER"
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
							border: "2px solid #3f7c6f",
							background: "#eff7f4",
						}}
					>
						<Article width={44} height={44} color="#3f7c6f" />
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
							background: "#3f7c6f",
							boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
						}}
					>
						<CheckCircle width={14} height={14} color="#ffffff" />
					</Box>
				</Box>

				<Stack gap={4} align="center">
					<Text fw={700} c="#1e3049" ta="center" fz="0.85rem" tt="uppercase">
						Successfully submitted!
					</Text>
					<Text c="#5f6673" ta="center" fz="0.74rem" lh={1.35} maw={300}>
						Operations will review and accept the job order shortly.
					</Text>
				</Stack>
			</Stack>

			<Box px="1.5rem" py="0.75rem">
				<Group justify="center">
					<Button
						onClick={onClose}
						styles={{
							root: {
								color: "#1e3049",
								fontWeight: 600,
								letterSpacing: "0.06em",
								textTransform: "uppercase",
								paddingInline: 44,
								background: "#e8e8e8",
								borderRadius: 8,
							},
							label: {
								color: "#1e3049",
							},
						}}
					>
						OK
					</Button>
				</Group>
			</Box>
		</Modal>
	);
}
