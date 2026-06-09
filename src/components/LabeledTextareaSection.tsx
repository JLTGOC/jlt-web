import { Box, Group, Paper, Text, Textarea } from "@mantine/core";
import type { ReactNode } from "react";
import type { CSSProperties } from "react";

type LabeledTextareaSectionMode = "edit" | "readonly";

interface LabeledTextareaSectionProps {
  label: string;
  value: string;
  mode?: LabeledTextareaSectionMode;
  onChange?: (value: string) => void;
  height?: string;
  maxLength?: number;
  action?: ReactNode;
}

export function LabeledTextareaSection({
  label,
  value,
  mode = "edit",
  onChange,
  height = "8rem",
  maxLength,
  action,
}: LabeledTextareaSectionProps) {
  const textareaInputStyles: CSSProperties = {
    border: 0,
    boxShadow: "none",
    background: "transparent",
    height,
    minHeight: height,
    maxHeight: height,
    overflowY: "auto",
    resize: "none",
  };

  const isReadonly = mode === "readonly";
  const readonlyInputStyles: CSSProperties = {
    backgroundColor: "var(--mantine-color-gray-0)",
    borderColor: "var(--mantine-color-gray-3)",
    color: "var(--mantine-color-dark-9)",
    WebkitTextFillColor: "var(--mantine-color-dark-9)",
    opacity: 1,
    cursor: "not-allowed",
  };

  return (
    <Paper withBorder radius="sm" mb="sm">
      <Group
        justify="space-between"
        align="center"
        px="md"
        py="xs"
        bg={isReadonly ? "gray.0" : "gray.1"}
      >
        <Text
          size="sm"
          fw={600}
          tt="uppercase"
          c={isReadonly ? "gray.7" : undefined}
        >
          {label}
        </Text>
        {action}
      </Group>
      <Box px="md" py="sm">
        <Textarea
          value={value}
          onChange={(event) => onChange?.(event.currentTarget.value)}
          readOnly={isReadonly}
          disabled={isReadonly}
          styles={{
            input: isReadonly
              ? { ...textareaInputStyles, ...readonlyInputStyles }
              : textareaInputStyles,
          }}
          maxLength={maxLength}
        />
      </Box>
    </Paper>
  );
}
