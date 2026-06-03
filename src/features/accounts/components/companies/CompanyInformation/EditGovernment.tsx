// src/features/accounts/components/companies/CompanyInformation/EditGovernment.tsx
import { useState, useEffect } from "react";
import {
  Paper,
  Text,
  TextInput,
  Group,
  Button,
  Box,
  Combobox,
  InputBase,
  useCombobox,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Add } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "../CompanyDetails/CompanyDetails.module.css";
import type {
  CompanyFullDetails,
  CompanyGovernmentCompliance,
} from "@/features/accounts/types/company.types";

interface EditGovernmentProps {
  company: CompanyFullDetails | null;
  errors?: Record<string, string>;
  onChange?: (governmentCompliance: CompanyGovernmentCompliance) => void;
}

interface FormData {
  tin: string;
  birRegistrationNumber: string;
  importerAccreditationNumber: string;
  importerExpirationDate: Date | null;
  exporterAccreditationNumber: string;
  exporterExpirationDate: Date | null;
  cprsStatus: string;
  specialPermits: string;
  complianceRisk: string;
  authorizedRepresentatives: string[];
  newAuthorizedRepresentative: string;
}

const formatDateValue = (v: Date | string | null): string | null => {
  if (!v) return null;
  const parsed = v instanceof Date ? v : new Date(v);
  if (!Number.isFinite(parsed.getTime())) return null;
  return parsed.toISOString().split("T")[0];
};

const toGovernmentCompliance = (
  data: FormData
): CompanyGovernmentCompliance => ({
  tin: data.tin || null,
  birRegistrationNumber: data.birRegistrationNumber || null,
  importerAccreditationNumber: data.importerAccreditationNumber || null,
  importerExpirationDate: formatDateValue(data.importerExpirationDate),
  exporterAccreditationNumber: data.exporterAccreditationNumber || null,
  exporterExpirationDate: formatDateValue(data.exporterExpirationDate),
  cprsStatus: data.cprsStatus || null,
  specialPermits: data.specialPermits || null,
  complianceRisk: data.complianceRisk || null,
  authorizedRepresentatives: data.authorizedRepresentatives,
});

export function EditGovernment({ company, errors, onChange }: EditGovernmentProps) {
  const [formData, setFormData] = useState<FormData>({
    tin: "",
    birRegistrationNumber: "",
    importerAccreditationNumber: "",
    importerExpirationDate: null,
    exporterAccreditationNumber: "",
    exporterExpirationDate: null,
    cprsStatus: "",
    specialPermits: "",
    complianceRisk: "",
    authorizedRepresentatives: [],
    newAuthorizedRepresentative: "",
  });

  const cprsOptions = [
    "ACTIVE",
    "INACTIVE",
  ];
  const [showRepresentativeInput, setShowRepresentativeInput] = useState(false);
  const cprsCombobox = useCombobox({
    onDropdownClose: () => cprsCombobox.resetSelectedOption(),
  });

  useEffect(() => {
    if (company?.governmentCompliance) {
      const nextFormData: FormData = {
        tin: company.governmentCompliance.tin || "",
        birRegistrationNumber: company.governmentCompliance.birRegistrationNumber || "",
        importerAccreditationNumber:
          company.governmentCompliance.importerAccreditationNumber || "",
        importerExpirationDate: company.governmentCompliance.importerExpirationDate
          ? new Date(company.governmentCompliance.importerExpirationDate)
          : null,
        exporterAccreditationNumber:
          company.governmentCompliance.exporterAccreditationNumber || "",
        exporterExpirationDate: company.governmentCompliance.exporterExpirationDate
          ? new Date(company.governmentCompliance.exporterExpirationDate)
          : null,
        cprsStatus: company.governmentCompliance.cprsStatus || "",
        specialPermits: company.governmentCompliance.specialPermits || "",
        complianceRisk: company.governmentCompliance.complianceRisk || "",
        authorizedRepresentatives:
          company.governmentCompliance.authorizedRepresentatives || [],
        newAuthorizedRepresentative: "",
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(nextFormData);
    }
  }, [company]);

  const emitChange = (next: FormData) => {
    onChange?.(toGovernmentCompliance(next));
  };

  const handleChange = (field: keyof FormData, value: string | Date | null) => {
    const nextFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(nextFormData);

    if (field === "newAuthorizedRepresentative") {
      return;
    }

    emitChange(nextFormData);
  };

  // CPRS is limited to a fixed set of backend-allowed values. We don't allow free-text entries.

  const addAuthorizedRepresentative = () => {
    const rep = formData.newAuthorizedRepresentative.trim();
    if (!rep) {
      return;
    }
    const nextFormData = {
      ...formData,
      authorizedRepresentatives: [...formData.authorizedRepresentatives, rep],
      newAuthorizedRepresentative: "",
    };
    setShowRepresentativeInput(false);
    setFormData(nextFormData);
    emitChange(nextFormData);
  };

  const cancelAuthorizedRepresentative = () => {
    setFormData((prev) => ({ ...prev, newAuthorizedRepresentative: "" }));
    setShowRepresentativeInput(false);
  };

  const handleRemoveRepresentative = (index: number) => {
    const nextFormData = {
      ...formData,
      authorizedRepresentatives: formData.authorizedRepresentatives.filter((_, idx) => idx !== index),
    };
    setFormData(nextFormData);
    emitChange(nextFormData);
  };

  const cprsOptionElements = cprsOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Paper p="lg">
      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>TIN</Text>
          <TextInput
            placeholder="Enter TIN"
            value={formData.tin}
            onChange={(e) => handleChange("tin", e.currentTarget.value)}
            error={errors?.tin}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>BIR Registration Number</Text>
          <TextInput
            placeholder="Enter BIR registration number"
            value={formData.birRegistrationNumber}
            onChange={(e) => handleChange("birRegistrationNumber", e.currentTarget.value)}
            error={errors?.birRegistrationNumber}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>CPRS Status</Text>
          <Combobox
            store={cprsCombobox}
            onOptionSubmit={(val) => {
              const selection = String(val ?? "");
              handleChange("cprsStatus", selection);
              cprsCombobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                onClick={() => cprsCombobox.toggleDropdown()}
                rightSectionPointerEvents="none"
              >
                <span style={{ color: formData.cprsStatus ? "inherit" : "#999" }}>
                  {formData.cprsStatus || "Select CPRS status"}
                </span>
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                  {cprsOptionElements.length > 0 ? cprsOptionElements : <Combobox.Empty>Nothing found</Combobox.Empty>}
                </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </div>
      </Group>

      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Importer Accreditation Number</Text>
          <TextInput
            placeholder="Enter importer accreditation number"
            value={formData.importerAccreditationNumber}
            onChange={(e) => handleChange("importerAccreditationNumber", e.currentTarget.value)}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Date of Expiration</Text>
          <DateInput
            placeholder="Pick date"
            value={formData.importerExpirationDate}
            onChange={(date) => handleChange("importerExpirationDate", date)}
          />
        </div>
      </Group>

      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Exporter Accreditation Number</Text>
          <TextInput
            placeholder="Enter exporter accreditation number"
            value={formData.exporterAccreditationNumber}
            onChange={(e) => handleChange("exporterAccreditationNumber", e.currentTarget.value)}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Date of Expiration</Text>
          <DateInput
            placeholder="Pick date"
            value={formData.exporterExpirationDate}
            onChange={(date) => handleChange("exporterExpirationDate", date)}
          />
        </div>
      </Group>

      <Box style={{ marginBottom: "1rem" }}>
        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Text size="sm" fw={500}>Authorized Representative</Text>
          <Button
            leftSection={<Add width={18} height={18} style={{ color: "#0064E0" }} />}
            variant="outline"
            radius="md"
            className={styles.smallEditButtonARG}
            onClick={() => setShowRepresentativeInput(true)}
          >
            Add Representative
          </Button>
        </Box>

        {showRepresentativeInput && (
          <Group mt="sm">
            <TextInput
              placeholder="Enter authorized representative name"
              value={formData.newAuthorizedRepresentative}
              onChange={(e) => handleChange("newAuthorizedRepresentative", e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Button
              radius="md"
              onClick={addAuthorizedRepresentative}
              disabled={!formData.newAuthorizedRepresentative.trim()}
            >
              Save
            </Button>
            <Button
              variant="outline"
              radius="md"
              onClick={cancelAuthorizedRepresentative}
            >
              Cancel
            </Button>
          </Group>
        )}

        {formData.authorizedRepresentatives.length === 0 ? (
          <Box
            style={{
              backgroundColor: "#f1f3f5",
              padding: "0.5rem",
              borderRadius: "4px",
              marginTop: "0.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text size="sm" c="dimmed" ta="center">
              NO AUTHORIZED REPRESENTATIVE ADDED
            </Text>
          </Box>
        ) : (
          formData.authorizedRepresentatives.map((rep, i) => (
            <Box key={i} style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text size="sm">{rep}</Text>
              <Button
                variant="subtle"
                color="red"
                size="xs"
                onClick={() => handleRemoveRepresentative(i)}
              >
                Remove
              </Button>
            </Box>
          ))
        )}
      </Box>

      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Special Permits (If Applicable)</Text>
          <TextInput
            placeholder="Enter special permits"
            value={formData.specialPermits}
            onChange={(e) => handleChange("specialPermits", e.currentTarget.value)}
            error={errors?.specialPermits}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Compliance Risk</Text>
          <TextInput
            placeholder="Enter compliance risk"
            value={formData.complianceRisk}
            onChange={(e) => handleChange("complianceRisk", e.currentTarget.value)}
            error={errors?.complianceRisk}
          />
        </div>
      </Group>
    </Paper>
  );
}
