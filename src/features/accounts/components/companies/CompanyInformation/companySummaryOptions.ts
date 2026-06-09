export interface CompanyOption {
  value: string;
  label: string;
}

export const transactionTypeOptions: CompanyOption[] = [
  { value: "1", label: "COORDINATED" },
  { value: "2", label: "STRAIGHT" },
];

export const clientClassificationOptions: CompanyOption[] = [
  { value: "1", label: "REGULAR" },
  { value: "2", label: "VIP" },
  { value: "3", label: "VVIP" },
];

export const companyTypeOptions: CompanyOption[] = [
  { value: "1", label: "IMPORTER" },
  { value: "2", label: "EXPORTER" },
  { value: "3", label: "TRADER" },
];

export const industryOptions: CompanyOption[] = [
  { value: "1", label: "LOGISTICS" },
  { value: "2", label: "MANUFACTURING" },
  { value: "3", label: "RETAIL" },
  { value: "4", label: "AGRICULTURE" },
  { value: "5", label: "CONSTRUCTION" },
  { value: "6", label: "HEALTHCARE" },
  { value: "7", label: "ENERGY AND POWER"},
  { value: "8", label: "AUTOMOTIVE" },
  { value: "9", label: "FOOD AND BEVERAGE" },
  { value: "10", label: "TEXTILE AND APPAREL" },
  { value: "11", label: "CHEMICALS" },
  { value: "12", label: "PHARMACEUTICALS" },
  { value: "13", label: "ELECTRONICS" },
  { value: "14", label: "FURNITURE" },
];

export const businessTypeOptions: CompanyOption[] = [
  { value: "1", label: "SOLE PROPRIETORSHIP" },
  { value: "2", label: "PARTNERSHIP" },
  { value: "3", label: "CORPORATION" },
  { value: "4", label: "COOPERATIVE" },
  { value: "5", label: "NON-PROFIT ORGANIZATION" },
  { value: "6", label: "IMPORT-EXPORT AGENT" },
  { value: "7", label: "GOVERNMENT AGENCY" },
  { value: "8", label: "E-COMMERCE" },
];
