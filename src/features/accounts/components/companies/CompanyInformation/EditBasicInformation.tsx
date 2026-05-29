// src/features/accounts/components/companies/CompanyInformation/EditBasicInformation.tsx
import { Paper, Text, TextInput, Autocomplete, Group, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { forwardRef, useState, useEffect, useRef, useImperativeHandle } from "react";
import { CalendarMonth } from "@nine-thirty-five/material-symbols-react/rounded";
import type {
  CompanyFullDetails,
  CompanySummary,
} from "@/features/accounts/types/company.types";
import {
  businessTypeOptions,
  clientClassificationOptions,
  companyTypeOptions,
  industryOptions,
  transactionTypeOptions,
} from "./companySummaryOptions";

export interface EditBasicInformationHandle {
  commit: () => CompanySummary;
}

interface EditBasicInformationProps {
  company: CompanyFullDetails | null;
  onChange?: (summary: CompanySummary) => void;
}

interface FormData {
  companyName: string;
  tradeName: string;
  consigneeUsed: string;
  accountHandler: string;
  transactionType: string;
  clientClassification: string;
  companyType: string;
  industry: string;
  businessType: string;
  businessRegistrationNumber: string;
  website: string;
  yearsInOperation: Date | null;
  dateOfActivation: Date | null;
}

const toSummary = (data: FormData): CompanySummary => ({
  companyName: data.companyName,
  tradeName: data.tradeName || null,
  consigneeUsed: data.consigneeUsed || null,
  accountHandler: data.accountHandler || null,
  transactionType: data.transactionType || null,
  clientClassification: data.clientClassification || null,
  companyType: data.companyType || null,
  industry: data.industry || null,
  businessType: data.businessType || null,
  businessRegistrationNumber: data.businessRegistrationNumber || null,
  website: data.website || null,
  yearsInOperation: data.yearsInOperation ? data.yearsInOperation.toISOString() : null,
  dateOfActivation: data.dateOfActivation ? data.dateOfActivation.toISOString() : null,
});

export const EditBasicInformation = forwardRef<EditBasicInformationHandle, EditBasicInformationProps>(
  ({ company, onChange }, ref) => {
    const yearsInputRef = useRef<HTMLInputElement | null>(null);
    const activationInputRef = useRef<HTMLInputElement | null>(null);
    const prevCompanyIdRef = useRef<string | undefined | null>(null);
    const [formData, setFormData] = useState<FormData>({
      companyName: "",
      tradeName: "",
      consigneeUsed: "",
      accountHandler: "",
      transactionType: "",
      clientClassification: "",
      companyType: "",
      industry: "",
      businessType: "",
      businessRegistrationNumber: "",
      website: "",
      yearsInOperation: null,
      dateOfActivation: null,
    });

    const [transactionTypeOptionsState, setTransactionTypeOptionsState] = useState<string[]>(
      [...transactionTypeOptions],
    );
    const [clientClassificationOptionsState, setClientClassificationOptionsState] =
      useState<string[]>([...clientClassificationOptions]);
    const [companyTypeOptionsState, setCompanyTypeOptionsState] = useState<string[]>([
      ...companyTypeOptions,
    ]);
    const [industryOptionsState, setIndustryOptionsState] = useState<string[]>([
      ...industryOptions,
    ]);
    const [businessTypeOptionsState, setBusinessTypeOptionsState] = useState<string[]>([
      ...businessTypeOptions,
    ]);

    const mergeSelectedOption = (defaults: readonly string[], selected: string) =>
      selected && !defaults.includes(selected) ? [...defaults, selected] : [...defaults];

  useEffect(() => {
    const companyId = company?.companyId;
    if (!company || companyId === prevCompanyIdRef.current) {
      return;
    }

    prevCompanyIdRef.current = companyId;

    const nextFormData: FormData = {
      companyName: company.summary.companyName || "",
      tradeName: company.summary.tradeName || "",
      consigneeUsed: company.summary.consigneeUsed || "",
      accountHandler: company.summary.accountHandler || "",
      transactionType: company.summary.transactionType || "",
      clientClassification: company.summary.clientClassification || "",
      companyType: company.summary.companyType || "",
      industry: company.summary.industry || "",
      businessType: company.summary.businessType || "",
      businessRegistrationNumber: company.summary.businessRegistrationNumber || "",
      website: company.summary.website || "",
      yearsInOperation: company.summary.yearsInOperation
        ? new Date(company.summary.yearsInOperation)
        : null,
      dateOfActivation: company.summary.dateOfActivation
        ? new Date(company.summary.dateOfActivation)
        : null,
    };

    setFormData(nextFormData);
    setTransactionTypeOptionsState(
      mergeSelectedOption(transactionTypeOptions, nextFormData.transactionType),
    );
    setClientClassificationOptionsState(
      mergeSelectedOption(clientClassificationOptions, nextFormData.clientClassification),
    );
    setCompanyTypeOptionsState(
      mergeSelectedOption(companyTypeOptions, nextFormData.companyType),
    );
    setIndustryOptionsState(
      mergeSelectedOption(industryOptions, nextFormData.industry),
    );
    setBusinessTypeOptionsState(
      mergeSelectedOption(businessTypeOptions, nextFormData.businessType),
    );
  }, [company]);

  useImperativeHandle(
    ref,
    () => ({
      commit: () => {
        const summary = toSummary(formData);
        if (onChange) {
          onChange(summary);
        }
        return summary;
      },
    }),
    [formData, onChange],
  );

  const handleChange = (field: keyof FormData, value: string | Date | null) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <Paper p="lg">
      {/* Row 1: Company Name + Trade Name */}
      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Company Name</Text>
          <TextInput
            placeholder="Enter company name"
            value={formData.companyName}
            onChange={(e) => handleChange("companyName", e.currentTarget.value)}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Trade Name</Text>
          <TextInput
            placeholder="Enter trade name"
            value={formData.tradeName}
            onChange={(e) => handleChange("tradeName", e.currentTarget.value)}
          />
        </div>
      </Group>

      {/* Row 2: Consignee Used + Assign Account Handler */}
      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Consignee Used</Text>
          <TextInput
            placeholder="Enter consignee"
            value={formData.consigneeUsed}
            onChange={(e) => handleChange("consigneeUsed", e.currentTarget.value)}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Assign Account Handler</Text>
          <TextInput
            placeholder="Enter handler"
            value={formData.accountHandler}
            onChange={(e) => handleChange("accountHandler", e.currentTarget.value)}
          />
        </div>
      </Group>

      {/* Row 3: Transaction Type + Client Classification + Company Type */}
      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Transaction Type</Text>
          <Autocomplete
            data={transactionTypeOptionsState}
            placeholder="Select or type a transaction type"
            clearable
            value={formData.transactionType}
            onChange={(value) => handleChange("transactionType", value)}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Client Classification</Text>
          <Autocomplete
            data={clientClassificationOptionsState}
            placeholder="Select or type a classification"
            clearable
            value={formData.clientClassification}
            onChange={(value) => handleChange("clientClassification", value)}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Company Type</Text>
          <Autocomplete
            data={companyTypeOptionsState}
            placeholder="Select or type a company type"
            clearable
            value={formData.companyType}
            onChange={(value) => handleChange("companyType", value)}
          />
        </div>
      </Group>

      {/* Row 4: Industry + Business Type + Business Registration Number */}
      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Industry</Text>
          <Autocomplete
            data={industryOptionsState}
            placeholder="Select or type an industry"
            clearable
            value={formData.industry}
            onChange={(value) => handleChange("industry", value)}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Business Type</Text>
          <Autocomplete
            data={businessTypeOptionsState}
            placeholder="Select or type a business type"
            clearable
            value={formData.businessType}
            onChange={(value) => handleChange("businessType", value)}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Business Registration Number (SEC/DTI)</Text>
          <TextInput
            placeholder="Enter registration number"
            value={formData.businessRegistrationNumber}
            onChange={(e) => handleChange("businessRegistrationNumber", e.currentTarget.value)}
          />
        </div>
      </Group>

      {/* Row 5: Website/Online Presence */}
      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Website / Online Presence</Text>
        <TextInput
          placeholder="Enter website URL"
          value={formData.website}
          onChange={(e) => handleChange("website", e.currentTarget.value)}
        />
      </div>

      {/* Row 6: Years in Operation + Date of Activation */}
      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Years in Operation</Text>
          <DateInput
            placeholder="Select years in operation"
            value={formData.yearsInOperation}
            onChange={(date) => handleChange("yearsInOperation", date)}
            rightSectionWidth={45}
            ref={yearsInputRef}
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
        <div>
          <Text size="sm" fw={500}>Date of Activation</Text>
          <DateInput
            placeholder="Pick date"
            value={formData.dateOfActivation}
            onChange={(date) => handleChange("dateOfActivation", date)}
            rightSectionWidth={45}
            ref={activationInputRef}
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
})
