import { type ReactNode } from "react";
import { Box, Stack } from "@mantine/core";

import { PageCard } from "@/components/PageCard";

import { useAcceptedQuotationsContext } from "./AcceptedQuotationsContext";

interface AcceptedQuotationsPageProps {
  children: ReactNode;
}

export function AcceptedQuotationsPage({
  children,
}: AcceptedQuotationsPageProps) {
  const { state, actions } = useAcceptedQuotationsContext();
  return (
    <PageCard
      title="LIST OF ACCEPTED"
      showJobSwitch
      jobSwitchValue={state.jobScope}
      onJobSwitchChange={actions.setJobScope}
      jobSwitchSecondaryLabel="MY JOBS"
    >
      {children}
    </PageCard>
  );
}

interface AcceptedQuotationsLayoutProps {
  children: ReactNode;
}

export function AcceptedQuotationsLayout({
  children,
}: AcceptedQuotationsLayoutProps) {
  return <Stack gap="xs">{children}</Stack>;
}

interface AcceptedQuotationsPanelProps {
  children: ReactNode;
}

export function AcceptedQuotationsPanel({
  children,
}: AcceptedQuotationsPanelProps) {
  return (
    <Box
      p="sm"
      style={{
        borderRadius: "0.75rem",
        border: "1px solid #e0e5eb",
        backgroundColor: "white",
      }}
    >
      {children}
    </Box>
  );
}
