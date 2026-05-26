import type { ReactNode } from "react";

import { Paper, Stack, Text, UnstyledButton } from "@mantine/core";
import { ArrowBack } from "@nine-thirty-five/material-symbols-react/rounded";

type HeaderProps = {
	quotation_reference_number?: string;
	onBack?: () => void;
	children: ReactNode;
};

export default function Header({
	quotation_reference_number = "QT-09-2026-052",
	onBack,
	children,
}: HeaderProps) {
	const hasBadge = Boolean(quotation_reference_number);

	return (
		<Stack gap="md">
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
				<div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
					{onBack ? (
						<UnstyledButton onClick={onBack} aria-label="Go back">
							<ArrowBack width={18} height={18} />
						</UnstyledButton>
					) : (
						<span style={{ display: "inline-flex", alignItems: "center" }}>
							<ArrowBack width={18} height={18} />
						</span>
					)}

					<Stack gap={2}>
						<Text size="sm" fw={700} c="var(--mantine-color-jltBlue-9)">
							GENERATE JOB ORDER
						</Text>
						<Text size="xs" c="dimmed">
							Create a new job order for the accepted quotation
						</Text>
					</Stack>
				</div>

				{hasBadge ? (
					<Paper
						p="0.5rem 0.75rem"
						radius="sm"
						withBorder
						style={{ textAlign: "right", minWidth: 160 }}
					>
						<Text size="xs" c="dimmed" tt="uppercase" lts="0.06em" mb={4}>
							FROM ACCEPTED QUOTATION
						</Text>
						<Text size="sm" fw={600} c="var(--mantine-color-jltBlue-8)">
							{quotation_reference_number}
						</Text>
					</Paper>
				) : null}
			</div>

			<Stack gap="md">{children}</Stack>
		</Stack>
	);
}
