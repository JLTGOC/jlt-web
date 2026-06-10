// src/features/accounts/components/companies/CompanyInformation/EditBasicInformation.tsx
import { Paper, Text, TextInput, Select, MultiSelect, Group, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "../CompanyDetails/CompanyDetails.module.css";
import { CalendarMonth } from "@nine-thirty-five/material-symbols-react/rounded";
import type {
  CompanyFullDetails,
  CompanySummary,
} from "@/features/accounts/types/company.types";
import type { CompanyOption } from "./companySummaryOptions";
import {
  businessTypeOptions,
  clientClassificationOptions,
  companyTypeOptions,
  industryOptions,
  transactionTypeOptions,
} from "./companySummaryOptions";

interface EditBasicInformationProps {
  company: CompanyFullDetails | null;
  errors?: Record<string, string>;
  onChange?: (summary: CompanySummary) => void;
  onRegisterCommit?: (commit: () => CompanySummary) => void;
}

interface FormData {
  companyName: string;
  tradeName: string;
  consigneeUsed: string;
  accountHandler: string;
  accountHandlerId: string;
  transactionType: string;
  transactionTypeId: string;
  clientClassification: string;
  clientClassificationId: string;
  companyType: string;
  companyTypeId: string;
  industry: string;
  industryIds: string[];
  businessType: string;
  businessTypeId: string;
  businessRegistrationNumber: string;
  website: string;
  yearsInOperation: Date | null;
  dateOfActivation: Date | null;
}

const formatDateValue = (v: Date | string | null): string | null => {
  if (!v) return null;
  const parsed = v instanceof Date ? v : new Date(v);
  if (!Number.isFinite(parsed.getTime())) return null;
  return parsed.toISOString().split("T")[0];
};

const getOptionValueByLabel = (options: CompanyOption[], label?: string | null): string =>
  options.find((option) => option.label === label)?.value ?? "";

const getOptionLabelByValue = (options: CompanyOption[], value?: string | null): string =>
  options.find((option) => option.value === value)?.label ?? "";

const toSummary = (data: FormData): CompanySummary => ({
  companyName: data.companyName,
  tradeName: data.tradeName || null,
  consigneeUsed: data.consigneeUsed || null,
  accountHandler: data.accountHandler || null,
  accountHandlerId: data.accountHandlerId || null,
  transactionType: data.transactionType || null,
  transactionTypeId: data.transactionTypeId || null,
  clientClassification: data.clientClassification || null,
  clientClassificationId: data.clientClassificationId || null,
  companyType: data.companyType || null,
  companyTypeId: data.companyTypeId || null,
  industry: data.industry || null,
  industryIds: data.industryIds.length > 0 ? data.industryIds : null,
  industryId: data.industryIds[0] ?? null,
  businessType: data.businessType || null,
  businessTypeId: data.businessTypeId || null,
  businessRegistrationNumber: data.businessRegistrationNumber || null,
  website: data.website || null,
  yearsInOperation: formatDateValue(data.yearsInOperation),
  dateOfActivation: formatDateValue(data.dateOfActivation),
});

export function EditBasicInformation({ company, errors, onChange, onRegisterCommit }: EditBasicInformationProps) {
    const yearsInputRef = useRef<HTMLInputElement | null>(null);
    const activationInputRef = useRef<HTMLInputElement | null>(null);
    const prevCompanyIdRef = useRef<string | undefined | null>(null);
    const [formData, setFormData] = useState<FormData>({
      companyName: "",
      tradeName: "",
      consigneeUsed: "",
      accountHandler: "",
      accountHandlerId: "",
      transactionType: "",
      transactionTypeId: "",
      clientClassification: "",
      clientClassificationId: "",
      companyType: "",
      companyTypeId: "",
      industry: "",
      industryIds: [],
      businessType: "",
      businessTypeId: "",
      businessRegistrationNumber: "",
      website: "",
      yearsInOperation: null,
      dateOfActivation: null,
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

    const emitSummaryChange = (nextFormData: FormData) => {
      onChange?.(toSummary(nextFormData));
    };

    const handleAccountHandlerChange = (value: string) => {
      const nextFormData = {
        ...formData,
        accountHandler: value,
        accountHandlerId: value,
      };
      setFormData(nextFormData);
      clearFieldError("accountHandler");
      emitSummaryChange(nextFormData);
    };

    useEffect(() => {
      const companyId = company?.companyId;
      if (!company || !company.summary || companyId === prevCompanyIdRef.current) {
        return;
      }

      prevCompanyIdRef.current = companyId;

      const s = company.summary;
      const industryLabels = s.industry
      ? String(s.industry)
          .split(",")
          .map((label) => label.trim())
          .filter(Boolean)
      : [];
    const industryIds = industryLabels.map((label) => getOptionValueByLabel(industryOptions, label)).filter(Boolean);

    const nextFormData: FormData = {
        companyName: s.companyName ?? "",
        tradeName: s.tradeName ?? "",
        consigneeUsed: s.consigneeUsed ?? "",
        accountHandler: s.accountHandler ?? "",
        accountHandlerId: s.accountHandlerId ?? s.accountHandler ?? "",
        transactionType: s.transactionType ?? "",
        transactionTypeId: getOptionValueByLabel(transactionTypeOptions, s.transactionType),
        clientClassification: s.clientClassification ?? "",
        clientClassificationId: getOptionValueByLabel(clientClassificationOptions, s.clientClassification),
        companyType: s.companyType ?? "",
        companyTypeId: getOptionValueByLabel(companyTypeOptions, s.companyType),
        industry: s.industry ?? "",
        industryIds,
        businessType: s.businessType ?? "",
        businessTypeId: getOptionValueByLabel(businessTypeOptions, s.businessType),
        businessRegistrationNumber: s.businessRegistrationNumber ?? "",
        website: s.website ?? "",
        yearsInOperation: s.yearsInOperation ? new Date(s.yearsInOperation) : null,
        dateOfActivation: s.dateOfActivation ? new Date(s.dateOfActivation) : null,
      };

      setFormData(nextFormData);
    }, [company]);

    const commit = useCallback(() => toSummary(formData), [formData]);

    useEffect(() => {
      onRegisterCommit?.(commit);
    }, [commit, onRegisterCommit]);

    const handleChange = (field: keyof Omit<FormData, "accountHandlerId" | "transactionTypeId" | "clientClassificationId" | "companyTypeId" | "businessTypeId" | "industryIds">, value: string | Date | null) => {
      const nextFormData = {
        ...formData,
        [field]: value,
      };
      setFormData(nextFormData);
      clearFieldError(field as string);
      emitSummaryChange(nextFormData);
    };

    const handleSelectChange = (
      field:
        | "transactionTypeId"
        | "clientClassificationId"
        | "companyTypeId"
        | "businessTypeId",
      value: string | null,
    ) => {
      const normalizedValue = value ?? "";
      const nextFormData = { ...formData, [field]: normalizedValue } as FormData;

      if (field === "transactionTypeId") {
        nextFormData.transactionType = getOptionLabelByValue(transactionTypeOptions, normalizedValue);
        clearFieldError("transactionType");
      }

      if (field === "clientClassificationId") {
        nextFormData.clientClassification = getOptionLabelByValue(clientClassificationOptions, normalizedValue);
        clearFieldError("clientClassification");
      }

      if (field === "companyTypeId") {
        nextFormData.companyType = getOptionLabelByValue(companyTypeOptions, normalizedValue);
        clearFieldError("companyType");
      }

      if (field === "businessTypeId") {
        nextFormData.businessType = getOptionLabelByValue(businessTypeOptions, normalizedValue);
        clearFieldError("businessType");
      }

      setFormData(nextFormData);
      onChange?.(toSummary(nextFormData));
    };

    return (
      <Paper p="lg">
        {/* Row 1: Company Name + Trade Name */}
        <Group grow mb="sm">
          <div className={styles.formField}>
            <Text size="sm" fw={500} className={`${styles.fieldLabel} ${localErrors.companyName ? styles.fieldLabelError : ""}`}>
              Company Name
              <span className={styles.requiredMark}>*</span>
            </Text>
            <TextInput
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.currentTarget.value)}
              error={localErrors.companyName}
              classNames={{
                input: localErrors.companyName ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
          <div className={styles.formField}>
            <Text size="sm" fw={500} className={`${styles.fieldLabel} ${localErrors.tradeName ? styles.fieldLabelError : ""}`}>
              Trade Name
            </Text>
            <TextInput
              placeholder="Enter trade name"
              value={formData.tradeName}
              onChange={(e) => handleChange("tradeName", e.currentTarget.value)}
              error={localErrors.tradeName}
              classNames={{
                input: localErrors.tradeName ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
        </Group>

        {/* Row 2: Consignee Used + Assign Account Handler */}
        <Group grow mb="sm">
          <div className={styles.formField}>
            <Text size="sm" fw={500} className={`${styles.fieldLabel} ${localErrors.consigneeUsed ? styles.fieldLabelError : ""}`}>
              Consignee Used
            </Text>
            <TextInput
              placeholder="Enter consignee"
              value={formData.consigneeUsed}
              onChange={(e) => handleChange("consigneeUsed", e.currentTarget.value)}
              error={localErrors.consigneeUsed}
              classNames={{
                input: localErrors.consigneeUsed ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
          <div className={styles.formField}>
            <Text size="sm" fw={500} className={`${styles.fieldLabel} ${localErrors.accountHandler ? styles.fieldLabelError : ""}`}>
              Assign Account Handler
            </Text>
            <TextInput
              placeholder="Enter account handler ID"
              value={formData.accountHandler}
              onChange={(e) => handleAccountHandlerChange(e.currentTarget.value)}
              error={localErrors.accountHandler}
              classNames={{
                input: localErrors.accountHandler ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
        </Group>

        {/* Row 3: Transaction Type + Client Classification + Company Type */}
        <Group grow mb="sm">
          <div>
            <Text size="sm" fw={500}>Transaction Type</Text>
            <Select
              data={transactionTypeOptions}
              placeholder="Select transaction type"
              clearable
              searchable
              nothingFoundMessage="No matching transaction type"
              value={formData.transactionTypeId || null}
              onChange={(value) => handleSelectChange("transactionTypeId", value)}
              error={localErrors.transactionType}
              classNames={{
                input: localErrors.transactionType ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
          <div>
            <Text size="sm" fw={500}>Client Classification</Text>
            <Select
              data={clientClassificationOptions}
              placeholder="Select classification"
              clearable
              searchable
              nothingFoundMessage="No matching classification"
              value={formData.clientClassificationId || null}
              onChange={(value) => handleSelectChange("clientClassificationId", value)}
              error={localErrors.clientClassification}
              classNames={{
                input: localErrors.clientClassification ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
          <div>
            <Text size="sm" fw={500}>Company Type</Text>
            <Select
              data={companyTypeOptions}
              placeholder="Select company type"
              clearable
              searchable
              nothingFoundMessage="No matching company type"
              value={formData.companyTypeId || null}
              onChange={(value) => handleSelectChange("companyTypeId", value)}
              error={localErrors.companyType}
              classNames={{
                input: localErrors.companyType ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
        </Group>

        {/* Row 4: Industry + Business Type + Business Registration Number */}
        <Group grow mb="sm">
          <div className={styles.formField}>
            <Text size="sm" fw={500} className={`${styles.fieldLabel} ${localErrors.industry ? styles.fieldLabelError : ""}`}>
              Industry
            </Text>
            <MultiSelect
              data={industryOptions}
              placeholder="Select industries"
              clearable
              searchable
              nothingFoundMessage="No matching industry"
              value={formData.industryIds}
              onChange={(value) => {
                const nextFormData = {
                  ...formData,
                  industryIds: value,
                  industry: value
                    .map((industryId) => getOptionLabelByValue(industryOptions, industryId))
                    .filter(Boolean)
                    .join(", "),
                };
                setFormData(nextFormData);
                clearFieldError("industry");
                onChange?.(toSummary(nextFormData));
              }}
              error={localErrors.industry}
              classNames={{
                input: localErrors.industry ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
          <div>
            <Text size="sm" fw={500}>Business Type</Text>
            <Select
              data={businessTypeOptions}
              placeholder="Select business type"
              clearable
              searchable
              nothingFoundMessage="No matching business type"
              value={formData.businessTypeId || null}
              onChange={(value) => handleSelectChange("businessTypeId", value)}
              error={localErrors.businessType}
            />
          </div>
          <div className={styles.formField}>
            <Text size="sm" fw={500} className={`${styles.fieldLabel} ${localErrors.businessRegistrationNumber ? styles.fieldLabelError : ""}`}>
              Business Registration Number (SEC/DTI)
            </Text>
            <TextInput
              placeholder="Enter registration number"
              value={formData.businessRegistrationNumber}
              onChange={(e) => handleChange("businessRegistrationNumber", e.currentTarget.value)}
              error={localErrors.businessRegistrationNumber}
              classNames={{
                input: localErrors.businessRegistrationNumber ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
            />
          </div>
        </Group>

        {/* Row 5: Website/Online Presence */}
        <div style={{ marginBottom: "1rem" }} className={styles.formField}>
          <Text size="sm" fw={500} className={`${styles.fieldLabel} ${localErrors.website ? styles.fieldLabelError : ""}`}>
            Website / Online Presence
          </Text>
          <TextInput
            placeholder="Enter website URL"
            value={formData.website}
            onChange={(e) => handleChange("website", e.currentTarget.value)}
            error={localErrors.website}
            classNames={{
              input: localErrors.website ? styles.textInputError : undefined,
              error: styles.errorMessage,
            }}
          />
        </div>

        {/* Row 6: Years in Operation + Date of Activation */}
        <Group grow mb="sm">
          <div className={styles.formField}>
            <Text size="sm" fw={500} className={`${styles.fieldLabel} ${localErrors.yearsInOperation ? styles.fieldLabelError : ""}`}>
              Years in Operation
            </Text>
            <DateInput
              placeholder="Select years in operation"
              value={formData.yearsInOperation}
              onChange={(date) => handleChange("yearsInOperation", date)}
              rightSectionWidth={45}
              ref={yearsInputRef}
              error={localErrors.yearsInOperation}
              classNames={{
                input: localErrors.yearsInOperation ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
              rightSection={
                <Button
                  type="button"
                  h={36}
                  w={45}
                  p={0}
                  radius="sm"
                  color="#4f657d"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    yearsInputRef.current?.focus();
                  }}
                >
                  <CalendarMonth width={24} height={24} fill="white" />
                </Button>
              }
            />
          </div>
          <div className={styles.formField}>
            <Text size="sm" fw={500} className={`${styles.fieldLabel} ${localErrors.dateOfActivation ? styles.fieldLabelError : ""}`}>
              Date of Activation
            </Text>
            <DateInput
              placeholder="Pick date"
              value={formData.dateOfActivation}
              onChange={(date) => handleChange("dateOfActivation", date)}
              rightSectionWidth={45}
              ref={activationInputRef}
              error={localErrors.dateOfActivation}
              classNames={{
                input: localErrors.dateOfActivation ? styles.textInputError : undefined,
                error: styles.errorMessage,
              }}
              rightSection={
                <Button
                  type="button"
                  h={36}
                  w={45}
                  p={0}
                  radius="sm"
                  color="#4f657d"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    activationInputRef.current?.focus();
                  }}
                >
                  <CalendarMonth width={24} height={24} fill="white" />
                </Button>
              }
            />
          </div>
        </Group>
      </Paper>
    );
}
