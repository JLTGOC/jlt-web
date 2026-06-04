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

export const industryOptions: CompanyOption[] = [
  { value: "1", label: "Logistics" },
  { value: "2", label: "Manufacturing" },
  { value: "3", label: "Retail" },
  { value: "4", label: "Agriculture" },
  { value: "5", label: "Construction" },
  { value: "6", label: "Healthcare" },
];

export const businessTypeOptions: CompanyOption[] = [
  { value: "1", label: "Sole Proprietorship" },
  { value: "2", label: "Partnership" },
  { value: "3", label: "Corporation" },
];
