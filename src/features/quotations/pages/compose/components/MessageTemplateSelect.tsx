import { Group, Select, Text } from "@mantine/core";
import { useComposeMessageTemplates } from "@/features/quotations/hooks/useComposeReferenceData";

interface MessageTemplateSelectProps {
  value: string | null;
  onChange: (templateId: string | null) => void;
  readOnly?: boolean;
}

export function MessageTemplateSelect({
  value,
  onChange,
  readOnly,
}: MessageTemplateSelectProps) {
  const { data: messageTemplates = [] } = useComposeMessageTemplates();
  return (
    <Select
      aria-label="Select message template"
      placeholder="Select message template"
      value={value}
      onChange={(nextValue) => {
        if (readOnly) {
          return;
        }
        onChange(nextValue);
      }}
      data={messageTemplates.map((messageTemplate) => ({
        value: messageTemplate.id,
        label: messageTemplate.label,
      }))}
      w={220}
    />
  );
}
