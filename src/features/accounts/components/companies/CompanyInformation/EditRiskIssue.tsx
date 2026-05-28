// src/features/accounts/components/companies/CompanyInformation/EditRiskIssue.tsx
import { Paper, Text, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";
import type {
  CompanyFullDetails,
  CompanyRiskIssueMonitoring,
} from "@/features/accounts/types/company.types";

interface EditRiskIssueProps {
  company: CompanyFullDetails | null;
  onChange?: (riskIssueMonitoring: CompanyRiskIssueMonitoring) => void;
}

interface FormData {
  riskMonitoringNotes: string;
  issueTrackingNotes: string;
  complianceMonitoringNotes: string;
}

const toRiskIssueMonitoring = (
  data: FormData
): CompanyRiskIssueMonitoring => ({
  riskMonitoringNotes: data.riskMonitoringNotes || null,
  issueTrackingNotes: data.issueTrackingNotes || null,
  complianceMonitoringNotes: data.complianceMonitoringNotes || null,
});

export function EditRiskIssue({ company, onChange }: EditRiskIssueProps) {
  const [formData, setFormData] = useState<FormData>({
    riskMonitoringNotes: "",
    issueTrackingNotes: "",
    complianceMonitoringNotes: "",
  });

  useEffect(() => {
    if (company?.riskIssueMonitoring) {
      const nextFormData: FormData = {
        riskMonitoringNotes: company.riskIssueMonitoring.riskMonitoringNotes || "",
        issueTrackingNotes: company.riskIssueMonitoring.issueTrackingNotes || "",
        complianceMonitoringNotes: company.riskIssueMonitoring.complianceMonitoringNotes || "",
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(nextFormData);
      onChange?.(toRiskIssueMonitoring(nextFormData));
    }
  }, [company, onChange]);

  const handleChange = (field: keyof FormData, value: string) => {
    const nextFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(nextFormData);
    onChange?.(toRiskIssueMonitoring(nextFormData));
  };

  return (
    <Paper p="lg">
      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Risk Monitoring Notes</Text>
        <TextInput
          placeholder="Enter risk monitoring notes"
          value={formData.riskMonitoringNotes}
          onChange={(e) => handleChange("riskMonitoringNotes", e.currentTarget.value)}
          styles={{ input: { minHeight: "6rem" } }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Issue Tracking Notes</Text>
        <TextInput
          placeholder="Enter issue tracking notes"
          value={formData.issueTrackingNotes}
          onChange={(e) => handleChange("issueTrackingNotes", e.currentTarget.value)}
          styles={{ input: { minHeight: "6rem" } }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Compliance Monitoring Notes</Text>
        <TextInput
          placeholder="Enter compliance monitoring notes"
          value={formData.complianceMonitoringNotes}
          onChange={(e) => handleChange("complianceMonitoringNotes", e.currentTarget.value)}
          styles={{ input: { minHeight: "6rem" } }}
        />
      </div>
    </Paper>
  );
}
