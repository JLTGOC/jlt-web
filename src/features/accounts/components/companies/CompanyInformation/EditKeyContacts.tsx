// src/features/accounts/components/companies/CompanyInformation/EditKeyContacts.tsx
import { Paper, Text, TextInput, Group, Box } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import styles from "../CompanyDetails/CompanyDetails.module.css";
import type {
  CompanyFullDetails,
  CompanyContactPerson,
  CompanyKeyContacts,
} from "@/features/accounts/types/company.types";

interface EditKeyContactsProps {
  company: CompanyFullDetails | null;
  errors?: Record<string, string>;
  onChange?: (keyContacts: CompanyKeyContacts) => void;
}

interface ContactForm {
  fullName: string;
  position: string;
  contactNumber: string;
  email: string;
}

interface FormData {
  primaryContact: ContactForm;
  secondaryContact: ContactForm;
  billingContact: ContactForm;
}

const toKeyContacts = (data: FormData): CompanyKeyContacts => ({
  primaryContact: { ...data.primaryContact },
  secondaryContact: { ...data.secondaryContact },
  billingContact: { ...data.billingContact },
});

const toContactForm = (contact: CompanyContactPerson | null | undefined): ContactForm => ({
  fullName: contact?.fullName || "",
  position: contact?.position || "",
  contactNumber: contact?.contactNumber || "",
  email: contact?.email || "",
});

export function EditKeyContacts({ company, errors, onChange }: EditKeyContactsProps) {
  const [formData, setFormData] = useState<FormData>({
    primaryContact: { fullName: "", position: "", contactNumber: "", email: "" },
    secondaryContact: { fullName: "", position: "", contactNumber: "", email: "" },
    billingContact: { fullName: "", position: "", contactNumber: "", email: "" },
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
    if (company?.keyContacts) {
      const nextFormData: FormData = {
        primaryContact: toContactForm(company.keyContacts.primaryContact),
        secondaryContact: toContactForm(company.keyContacts.secondaryContact),
        billingContact: toContactForm(company.keyContacts.billingContact),
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(nextFormData);
    }
  }, [company]);

  const localChangeRef = useRef(false);

  const handleContactChange = (
    contactType: keyof FormData,
    field: keyof ContactForm,
    value: string
  ) => {
    localChangeRef.current = true;
    clearFieldError(`${contactType}.${field}`);
    setFormData((prev) => ({
      ...prev,
      [contactType]: {
        ...prev[contactType],
        [field]: value,
      },
    }));
  };

  // Emit changes to parent after local state updates to avoid setState during render
  // Only emit when the change originated locally to prevent parent->child echo loops
  useEffect(() => {
    if (localChangeRef.current) {
      onChange?.(toKeyContacts(formData));
      localChangeRef.current = false;
    }
  }, [formData, onChange]);

  const renderContactSection = (
    title: string,
    contactType: keyof FormData,
    contact: ContactForm
  ) => (
    <Box mb="lg">
      <Text size="sm" fw={600} mb="sm">
        {title}
      </Text>
      <Box pl="md">
        <Group grow mb="sm">
          <div>
            <Text size="sm" fw={500}>Full Name<span className={styles.requiredMark}>*</span></Text>
            <TextInput
              placeholder="Enter full name"
              value={contact.fullName}
              onChange={(e) => handleContactChange(contactType, "fullName", e.currentTarget.value)}
              error={localErrors?.[`${contactType}.fullName`]}
              classNames={{
                input: localErrors?.[`${contactType}.fullName`] ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
          <div>
            <Text size="sm" fw={500}>Position<span className={styles.requiredMark}>*</span></Text>
            <TextInput
              placeholder="Enter position"
              value={contact.position}
              onChange={(e) => handleContactChange(contactType, "position", e.currentTarget.value)}
              error={localErrors?.[`${contactType}.position`]}
              classNames={{
                input: localErrors?.[`${contactType}.position`] ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
        </Group>
        <Group grow mb="sm">
          <div>
            <Text size="sm" fw={500}>Contact Number<span className={styles.requiredMark}>*</span></Text>
            <TextInput
              placeholder="Enter contact number"
              value={contact.contactNumber}
              onChange={(e) => handleContactChange(contactType, "contactNumber", e.currentTarget.value)}
              error={localErrors?.[`${contactType}.contactNumber`]}
              classNames={{
                input: localErrors?.[`${contactType}.contactNumber`] ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
          <div>
            <Text size="sm" fw={500}>Email<span className={styles.requiredMark}>*</span></Text>
            <TextInput
              placeholder="Enter email"
              value={contact.email}
              onChange={(e) => handleContactChange(contactType, "email", e.currentTarget.value)}
              error={localErrors?.[`${contactType}.email`]}
              classNames={{
                input: localErrors?.[`${contactType}.email`] ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
        </Group>
      </Box>
    </Box>
  );

  return (
    <Paper p="lg">
      {renderContactSection("PRIMARY CONTACT (DECISION MAKER)", "primaryContact", formData.primaryContact)}
      {renderContactSection("SECONDARY CONTACT", "secondaryContact", formData.secondaryContact)}
      {renderContactSection("BILLING CONTACT", "billingContact", formData.billingContact)}
    </Paper>
  );
}
