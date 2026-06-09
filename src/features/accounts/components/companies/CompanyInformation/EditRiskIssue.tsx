// src/features/accounts/components/companies/CompanyInformation/EditRiskIssue.tsx
import { Paper, Text, Textarea } from "@mantine/core";
import { useState, useEffect } from "react";
import styles from "../CompanyDetails/CompanyDetails.module.css";
import type {
  CompanyFullDetails,
  CompanyRiskIssueMonitoring,
} from "@/features/accounts/types/company.types";

interface EditRiskIssueProps {
  company: CompanyFullDetails | null;
  errors?: Record<string, string>;
  onChange?: (riskIssueMonitoring: CompanyRiskIssueMonitoring) => void;
}

interface FormData {
  pastIssues: string;
  penalties: string;
  customFlags: string;
  paymentDelays: string;
  claims: string;
  notes: string;
}

const toRiskIssueMonitoring = (
  data: FormData,
): CompanyRiskIssueMonitoring => ({
  pastIssues: data.pastIssues || null,
  penalties: data.penalties || null,
  customFlags: data.customFlags || null,
  paymentDelays: data.paymentDelays || null,
  claims: data.claims || null,
  notes: data.notes || null,
});

export function EditRiskIssue({ company, errors, onChange }: EditRiskIssueProps) {
  const [formData, setFormData] = useState<FormData>({
    pastIssues: "",
    penalties: "",
    customFlags: "",
    paymentDelays: "",
    claims: "",
    notes: "",
  });
  const [localErrors, setLocalErrors] = useState<Record<string, string>>(errors ?? {});

  useEffect(() => {
    setLocalErrors(errors ?? {});
  }, [errors]);

  const clearFieldError = (field: string) => {
    if (!localErrors[field]) {
      return;
    }
    setLocalErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  useEffect(() => {
    if (company?.riskIssueMonitoring) {
      const nextFormData: FormData = {
        pastIssues: company.riskIssueMonitoring.pastIssues || "",
        penalties: company.riskIssueMonitoring.penalties || "",
        customFlags: company.riskIssueMonitoring.customFlags || "",
        paymentDelays: company.riskIssueMonitoring.paymentDelays || "",
        claims: company.riskIssueMonitoring.claims || "",
        notes: company.riskIssueMonitoring.notes || "",
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(nextFormData);
    }
  }, [company]);

  const handleChange = (field: keyof FormData, value: string) => {
    const nextFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(nextFormData);
    clearFieldError(field);
    onChange?.(toRiskIssueMonitoring(nextFormData));
  };

  return (
    <Paper p="lg">
      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>
          Past Issues / Disputes
        </Text>
        <Textarea
          placeholder="Enter past issues or disputes"
          value={formData.pastIssues}
          onChange={(e) => handleChange("pastIssues", e.currentTarget.value)}
          error={localErrors.pastIssues}
          classNames={{
            input: localErrors.pastIssues ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
          minRows={4}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>
          Penalties / Violation History
        </Text>
        <Textarea
          placeholder="Enter penalties or violation history"
          value={formData.penalties}
          onChange={(e) => handleChange("penalties", e.currentTarget.value)}
          error={localErrors.penalties}
          classNames={{
            input: localErrors.penalties ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
          minRows={4}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>
          Customs Flags / Alert
        </Text>
        <Textarea
          placeholder="Enter customs flags or alerts"
          value={formData.customFlags}
          onChange={(e) => handleChange("customFlags", e.currentTarget.value)}
          error={localErrors.customFlags}
          classNames={{
            input: localErrors.customFlags ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
          minRows={4}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>
          Payment Delays History
        </Text>
        <Textarea
          placeholder="Enter payment delays history"
          value={formData.paymentDelays}
          onChange={(e) => handleChange("paymentDelays", e.currentTarget.value)}
          error={localErrors.paymentDelays}
          classNames={{
            input: localErrors.paymentDelays ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
          minRows={4}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>
          Claims / Damage Records
        </Text>
        <Textarea
          placeholder="Enter claims or damage records"
          value={formData.claims}
          onChange={(e) => handleChange("claims", e.currentTarget.value)}
          error={localErrors.claims}
          classNames={{
            input: localErrors.claims ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
          minRows={4}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>
          Notes / Remarks / Reports
        </Text>
        <Textarea
          placeholder="Enter notes, remarks, or reports"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.currentTarget.value)}
          error={localErrors.notes}
          classNames={{
            input: localErrors.notes ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
          minRows={4}
        />
      </div>
    </Paper>
  );
}
