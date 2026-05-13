export type TemplateChargeDraft = {
  key: number;
  id?: number;
  name: string;
  receipt_option_ids: string[];
};

export interface TemplateFormDraft {
  name: string;
  selectedDetailIds: number[];
  selectedFieldIds: number[];
  charges: TemplateChargeDraft[];
  nextChargeKey: number;
}
