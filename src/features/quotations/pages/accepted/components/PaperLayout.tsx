import type { ReactNode } from "react";

import { Paper, Text } from "@mantine/core";

type PaperLayoutProps = {
	title: string;
	icon?: ReactNode;
	headerBackground?: string;
	children: ReactNode;
};

export default function PaperLayout({
	title,
	icon,
	children,
}: PaperLayoutProps) {
	return (
		<Paper shadow="xs" radius="md" withBorder>
			<Paper radius="sm" p={10} style={{ background: '#EFF0F4', marginBottom: 12 }}>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					{icon ? <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span> : null}
					<Text size="md" style={{ fontWeight: 700 }}>
						{title}
					</Text>
				</div>
			</Paper>
            <Paper radius="sm" p={10}>
				{children}
			</Paper>
		</Paper>
	);
}
