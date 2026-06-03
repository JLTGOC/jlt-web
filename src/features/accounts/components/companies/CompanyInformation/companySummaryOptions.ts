export interface CompanyOption {
  value: string;
  label: string;
}

export const transactionTypeOptions: CompanyOption[] = [
  { value: "1", label: "Coordinated" },
  { value: "2", label: "Straight" },
];

export const clientClassificationOptions: CompanyOption[] = [
  { value: "1", label: "Regular" },
  { value: "2", label: "VIP" },
  { value: "3", label: "VVIP" },
];

export const companyTypeOptions: CompanyOption[] = [
  { value: "1", label: "Importer" },
  { value: "2", label: "Exporter" },
  { value: "3", label: "Trader" },
];

export const industryOptions = ["Logistics", "Manufacturing", "Retail"] as const;

export const businessTypeOptions: CompanyOption[] = [
  { value: "1", label: "Sole Proprietorship" },
  { value: "2", label: "Partnership" },
  { value: "3", label: "Corporation" },
];
