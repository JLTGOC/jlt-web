export interface ServiceTypeItem {
  id: number;
  key: "import" | "export" | "business-solution";
  name: "IMPORT" | "EXPORT" | "BUSINESS SOLUTION";
}

export const SERVICE_TYPES: ServiceTypeItem[] = [
  {
    id: 1,
    key: "import",
    name: "IMPORT",
  },
  {
    id: 2,
    key: "export",
    name: "EXPORT",
  },
  {
    id: 3,
    key: "business-solution",
    name: "BUSINESS SOLUTION",
  },
];
