// src/features/accounts/components/companies/CompanyInformation/EditOperationalInstructions.tsx
import { Paper, Text, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";
import type {
  CompanyFullDetails,
  CompanyOperationalInstructions,
} from "@/features/accounts/types/company.types";

interface EditOperationalInstructionsProps {
  company: CompanyFullDetails | null;
  onChange?: (operationalInstructions: CompanyOperationalInstructions) => void;
}

interface FormData {
  preferredCommunicationStyle: string;
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
  responseTimeExpectation: data.responseTimeExpectation || null,
  clientSpecificSOP: data.clientSpecificSOP || null,
  approvalWorkflow: data.approvalWorkflow || null,
  requiredPreAlertDetails: data.requiredPreAlertDetails || null,
  specialInstructions: data.specialInstructions || null,
});

export function EditOperationalInstructions({ company, onChange }: EditOperationalInstructionsProps) {
  const [formData, setFormData] = useState<FormData>({
    preferredCommunicationStyle: "",
    responseTimeExpectation: "",
    clientSpecificSOP: "",
    approvalWorkflow: "",
    requiredPreAlertDetails: "",
    specialInstructions: "",
  });

  useEffect(() => {
    if (company?.operationalInstructions) {
      const nextFormData: FormData = {
        preferredCommunicationStyle: company.operationalInstructions.preferredCommunicationStyle || "",
        responseTimeExpectation: company.operationalInstructions.responseTimeExpectation || "",
        clientSpecificSOP: company.operationalInstructions.clientSpecificSOP || "",
        approvalWorkflow: company.operationalInstructions.approvalWorkflow || "",
        requiredPreAlertDetails: company.operationalInstructions.requiredPreAlertDetails || "",
        specialInstructions: company.operationalInstructions.specialInstructions || "",
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(nextFormData);
      onChange?.(toOperationalInstructions(nextFormData));
    }
  }, [company, onChange]);

  const handleChange = (field: keyof FormData, value: string) => {
    const nextFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(nextFormData);
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
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Response Time Expectation</Text>
        <TextInput
          placeholder="Enter response time expectation"
          value={formData.responseTimeExpectation}
          onChange={(e) => handleChange("responseTimeExpectation", e.currentTarget.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Client Specific SOP</Text>
        <TextInput
          placeholder="Enter client specific SOP"
          value={formData.clientSpecificSOP}
          onChange={(e) => handleChange("clientSpecificSOP", e.currentTarget.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Approval Workflow</Text>
        <TextInput
          placeholder="Enter approval workflow"
          value={formData.approvalWorkflow}
          onChange={(e) => handleChange("approvalWorkflow", e.currentTarget.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Required Pre-Alert Details</Text>
        <TextInput
          placeholder="Enter pre-alert details"
          value={formData.requiredPreAlertDetails}
          onChange={(e) => handleChange("requiredPreAlertDetails", e.currentTarget.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Special Instructions</Text>
        <TextInput
          placeholder="Enter special instructions"
          value={formData.specialInstructions}
          onChange={(e) => handleChange("specialInstructions", e.currentTarget.value)}
        />
      </div>
    </Paper>
  );
}
