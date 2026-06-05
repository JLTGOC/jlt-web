// src/features/accounts/components/companies/CompanyInformation/EditCommercial.tsx
import { Paper, Text, TextInput, Group } from "@mantine/core";
import { useState, useEffect } from "react";
import styles from "../CompanyDetails/CompanyDetails.module.css";
import type {
  CompanyFullDetails,
  CompanyCommercialInformation,
} from "@/features/accounts/types/company.types";

interface EditCommercialProps {
  company: CompanyFullDetails | null;
  errors?: Record<string, string>;
  onChange?: (commercialInformation: CompanyCommercialInformation) => void;
}

interface FormData {
  agreedServiceRates: string;
  specialDiscounts: string;
  profitRangePercent: string;
  notes: string;
}

const toCommercialInformation = (data: FormData): CompanyCommercialInformation => ({
  agreedServiceRates: data.agreedServiceRates || null,
  specialDiscounts: data.specialDiscounts || null,
  profitRangePercent: data.profitRangePercent || null,
  notes: data.notes || null,
});

export function EditCommercial({ company, errors, onChange }: EditCommercialProps) {
  const [formData, setFormData] = useState<FormData>({
    agreedServiceRates: "",
    specialDiscounts: "",
    profitRangePercent: "",
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
    if (company?.commercialInformation) {
      const nextFormData: FormData = {
        agreedServiceRates: company.commercialInformation.agreedServiceRates || "",
        specialDiscounts: company.commercialInformation.specialDiscounts || "",
        profitRangePercent: company.commercialInformation.profitRangePercent || "",
        notes: company.commercialInformation.notes || "",
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
    onChange?.(toCommercialInformation(nextFormData));
  };

  return (
    <Paper p="lg">
      {/* Row 1: Agreed Service Rates */}
      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Agreed Service Rates (JLT Service Only)</Text>
        <TextInput
          placeholder="Enter agreed service rates"
          value={formData.agreedServiceRates}
          onChange={(e) => handleChange("agreedServiceRates", e.currentTarget.value)}
          error={localErrors.agreedServiceRates}
          classNames={{
            input: localErrors.agreedServiceRates ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
        />
      </div>

      {/* Row 2: Special Discounts + 3PL Profit Range % */}
      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Special Discounts</Text>
          <TextInput
            placeholder="Enter special discounts"
            value={formData.specialDiscounts}
            onChange={(e) => handleChange("specialDiscounts", e.currentTarget.value)}
            error={localErrors.specialDiscounts}
            classNames={{
              input: localErrors.specialDiscounts ? styles.textInputError : undefined,
              error: styles.errorMessage,
            }}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>3PL Profit Range %</Text>
          <TextInput
            placeholder="Enter profit range %"
            value={formData.profitRangePercent}
            onChange={(e) => handleChange("profitRangePercent", e.currentTarget.value)}
            error={localErrors.profitRangePercent}
            classNames={{
              input: localErrors.profitRangePercent ? styles.textInputError : undefined,
              error: styles.errorMessage,
            }}
          />
        </div>
      </Group>

      {/* Row 3: Notes/Remarks/Reports */}
      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Notes / Remarks / Reports</Text>
        <TextInput
          placeholder="Enter notes, remarks, or reports"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.currentTarget.value)}
          error={localErrors.notes}
          classNames={{
            input: localErrors.notes ? styles.textInputError : undefined,
            error: styles.errorMessage,
          }}
          styles={{
            input: {
              minHeight: "6rem",
            },
          }}
        />
      </div>
    </Paper>
  );
}
