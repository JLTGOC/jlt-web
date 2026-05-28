// src/features/accounts/components/companies/CompanyInformation/EditKeyContacts.tsx
import { Paper, Text, TextInput, Group, Box } from "@mantine/core";
import { useState, useEffect } from "react";
import type {
  CompanyFullDetails,
  CompanyContactPerson,
  CompanyKeyContacts,
} from "@/features/accounts/types/company.types";

interface EditKeyContactsProps {
  company: CompanyFullDetails | null;
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

export function EditKeyContacts({ company, onChange }: EditKeyContactsProps) {
  const [formData, setFormData] = useState<FormData>({
    primaryContact: { fullName: "", position: "", contactNumber: "", email: "" },
    secondaryContact: { fullName: "", position: "", contactNumber: "", email: "" },
    billingContact: { fullName: "", position: "", contactNumber: "", email: "" },
  });

  useEffect(() => {
    if (company?.keyContacts) {
      const nextFormData: FormData = {
        primaryContact: toContactForm(company.keyContacts.primaryContact),
        secondaryContact: toContactForm(company.keyContacts.secondaryContact),
        billingContact: toContactForm(company.keyContacts.billingContact),
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(nextFormData);
      onChange?.(toKeyContacts(nextFormData));
    }
  }, [company, onChange]);

  const handleContactChange = (
    contactType: keyof FormData,
    field: keyof ContactForm,
    value: string
  ) => {
    setFormData((prev) => {
      const nextFormData = {
        ...prev,
        [contactType]: {
          ...prev[contactType],
          [field]: value,
        },
      };
      onChange?.(toKeyContacts(nextFormData));
      return nextFormData;
    });
  };

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
            <Text size="sm" fw={500}>Full Name</Text>
            <TextInput
              placeholder="Enter full name"
              value={contact.fullName}
              onChange={(e) => handleContactChange(contactType, "fullName", e.currentTarget.value)}
            />
          </div>
          <div>
            <Text size="sm" fw={500}>Position</Text>
            <TextInput
              placeholder="Enter position"
              value={contact.position}
              onChange={(e) => handleContactChange(contactType, "position", e.currentTarget.value)}
            />
          </div>
        </Group>
        <Group grow mb="sm">
          <div>
            <Text size="sm" fw={500}>Contact Number</Text>
            <TextInput
              placeholder="Enter contact number"
              value={contact.contactNumber}
              onChange={(e) => handleContactChange(contactType, "contactNumber", e.currentTarget.value)}
            />
          </div>
          <div>
            <Text size="sm" fw={500}>Email</Text>
            <TextInput
              placeholder="Enter email"
              value={contact.email}
              onChange={(e) => handleContactChange(contactType, "email", e.currentTarget.value)}
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
