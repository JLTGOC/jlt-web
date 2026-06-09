// src/features/accounts/components/companies/CompanyInformation/EditOperationalInstructions.tsx
import { Group, Paper, Text, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";
import styles from "../CompanyDetails/CompanyDetails.module.css";
import type {
  CompanyFullDetails,
  CompanyOperationalInstructions,
} from "@/features/accounts/types/company.types";

interface EditOperationalInstructionsProps {
  company: CompanyFullDetails | null;
  errors?: Record<string, string>;
  onChange?: (operationalInstructions: CompanyOperationalInstructions) => void;
}

interface FormData {
  preferredCommunicationStyle: string;
  decisionMakingProcess: string;
  responseTimeExpectation: string;
  clientSpecificSOP: string;
  approvalWorkflow: string;
  requiredPreAlertDetails: string;
  specialInstructions: string;
}

const toOperationalInstructions = (
  data: FormData
): CompanyOperationalInstructions => ({
  preferredCommunicationStyle: data.preferredCommunicationStyle || null,
  decisionMakingProcess: data.decisionMakingProcess || null,
  responseTimeExpectation: data.responseTimeExpectation || null,
  clientSpecificSOP: data.clientSpecificSOP || null,
  approvalWorkflow: data.approvalWorkflow || null,
  requiredPreAlertDetails: data.requiredPreAlertDetails || null,
  specialInstructions: data.specialInstructions || null,
});

export function EditOperationalInstructions({ company, errors, onChange }: EditOperationalInstructionsProps) {
  const [formData, setFormData] = useState<FormData>({
    preferredCommunicationStyle: "",
    decisionMakingProcess: "",
    responseTimeExpectation: "",
    clientSpecificSOP: "",
    approvalWorkflow: "",
    requiredPreAlertDetails: "",
    specialInstructions: "",
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
    if (company?.operationalInstructions) {
      const nextFormData: FormData = {
        preferredCommunicationStyle: company.operationalInstructions.preferredCommunicationStyle || "",
        decisionMakingProcess: company.operationalInstructions.decisionMakingProcess || "",
        responseTimeExpectation: company.operationalInstructions.responseTimeExpectation || "",
        clientSpecificSOP: company.operationalInstructions.clientSpecificSOP || "",
        approvalWorkflow: company.operationalInstructions.approvalWorkflow || "",
        requiredPreAlertDetails: company.operationalInstructions.requiredPreAlertDetails || "",
        specialInstructions: company.operationalInstructions.specialInstructions || "",
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
    onChange?.(toOperationalInstructions(nextFormData));
  };

  return (
    <Paper p="lg">
      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Preferred Communication Style</Text>
        <TextInput
          placeholder="Enter preferred communication style"
          value={formData.preferredCommunicationStyle}
          onChange={(e) => handleChange("preferredCommunicationStyle", e.currentTarget.value)}
          error={localErrors.preferredCommunicationStyle}
          classNames={{
            input: localErrors.preferredCommunicationStyle ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Decision Making Process</Text>
        <TextInput
          placeholder="Enter decision making process"
          value={formData.decisionMakingProcess}
          onChange={(e) => handleChange("decisionMakingProcess", e.currentTarget.value)}
          error={localErrors.decisionMakingProcess}
          classNames={{
            input: localErrors.decisionMakingProcess ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
        />
      </div>

      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Response Time Expectation</Text>
          <TextInput
            placeholder="Enter response time expectation"
            value={formData.responseTimeExpectation}
            onChange={(e) => handleChange("responseTimeExpectation", e.currentTarget.value)}
            error={localErrors.responseTimeExpectation}
            classNames={{
              input: localErrors.responseTimeExpectation ? styles.textInputError : undefined,
              error: styles.errorMessage,
            }}
          />
        </div>

        <div>
          <Text size="sm" fw={500}>Client Specific SOP</Text>
          <TextInput
            placeholder="Enter client specific SOP"
            value={formData.clientSpecificSOP}
            onChange={(e) => handleChange("clientSpecificSOP", e.currentTarget.value)}
            error={localErrors.clientSpecificSOP}
            classNames={{
              input: localErrors.clientSpecificSOP ? styles.textInputError : undefined,
              error: styles.errorMessage,
            }}
          />
        </div>
      </Group>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Approval Workflow</Text>
        <TextInput
          placeholder="Enter approval workflow"
          value={formData.approvalWorkflow}
          onChange={(e) => handleChange("approvalWorkflow", e.currentTarget.value)}
          error={localErrors.approvalWorkflow}
          classNames={{
            input: localErrors.approvalWorkflow ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Required Pre-Alert Details</Text>
        <TextInput
          placeholder="Enter pre-alert details"
          value={formData.requiredPreAlertDetails}
          onChange={(e) => handleChange("requiredPreAlertDetails", e.currentTarget.value)}
          error={localErrors.requiredPreAlertDetails}
          classNames={{
            input: localErrors.requiredPreAlertDetails ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Special Instructions</Text>
        <TextInput
          placeholder="Enter special instructions"
          value={formData.specialInstructions}
          onChange={(e) => handleChange("specialInstructions", e.currentTarget.value)}
          error={localErrors.specialInstructions}
          classNames={{
            input: localErrors.specialInstructions ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
        />
      </div>
    </Paper>
  );
}
