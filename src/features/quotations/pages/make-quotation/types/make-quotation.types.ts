import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { ViewerSignatoryValues } from "@/features/quotations/types/compose.types";

export type MakeQuotationServiceType = "LOGISTICS" | "REGULATORY";

export interface ClientInfoValues {
  clientType: "existing" | "prospect";
  clientId?: string;
  fullName: string;
  services: MakeQuotationServiceType;
  company: {
    name: string;
    address: string;
    contactPerson: string;
    contactNumber: string;
    email: string;
    position?: string;
    consignee: string;
    businessType?: string;
  };
}

export interface ServiceInfoValues {
  serviceType?: string;
  transportMode?: "SEA" | "AIR";
  serviceOptions?: string[];
  commodity?: string;
  cargoType?: "CONTAINERIZED" | "LCL";
  containerSize?: string;
  origin?: string;
  destination?: string;
  remarks?: string;
  regulatoryServiceType?: string;
  serviceRequests?: string[];
  typeOfRegulatoryAssistance?: string[];
  regulatoryAuthorities?: string[];
  serviceLevel?: "NEW" | "RENEWAL";
  message?: string;
}

export interface DocumentValues {
  checklistFiles: Record<string, File>;
  otherFiles: File[];
}

export type ServiceSubStep = "service" | "documents";

export interface MakeQuotationState {
  step: number;
  serviceSubStep: ServiceSubStep;
  showTemplateSelection: boolean;
  quotationId: string | null;
  templateId: string | null;
  clientInfo: ClientInfoValues | null;
  serviceInfo: ServiceInfoValues | null;
  documentValues: DocumentValues | null;
  quotationDetailsData: QuotationDetailsValues | null;
  billingDetailsData: BillingDetailsValues | null;
  termsData: TermsValues | null;
  signatoryData: ViewerSignatoryValues | null;
  isStep0Valid: boolean;
  isStep2Valid: boolean;
  isStep3Valid: boolean;
  isCreatingQuotation: boolean;
  isSending: boolean;
  previewReady: boolean;
}

export interface MakeQuotationActions {
  goToStep: (step: number) => void;
  goToServiceSubStep: (sub: ServiceSubStep) => void;
  submitClientInfo: (values: ClientInfoValues) => void;
  submitServiceInfo: (values: ServiceInfoValues) => void;
  submitDocuments: (values: DocumentValues) => Promise<void>;
  selectTemplate: (templateId: string) => void;
  resetCreatedQuotationSelection: () => void;
  returnToTemplateSelection: () => void;
  setQuotationDetailsData: (values: QuotationDetailsValues) => void;
  setBillingDetailsData: (values: BillingDetailsValues) => void;
  setTermsData: (values: TermsValues) => void;
  setSignatoryData: (values: ViewerSignatoryValues) => void;
  setPreviewReady: (ready: boolean) => void;
  setIsStep0Valid: (valid: boolean) => void;
  setIsStep2Valid: (valid: boolean) => void;
  setIsStep3Valid: (valid: boolean) => void;
  openSendConfirm: () => void;
  closeSendConfirm: () => void;
  submitSend: () => Promise<void>;
  closeSendSuccess: () => void;
  openSignatory: () => void;
  closeSignatory: () => void;
}

export interface MakeQuotationMeta {
  signatoryOpened: boolean;
  sendConfirmOpened: boolean;
  sendSuccessOpened: boolean;
  quotationDetailsFormId: string;
  billingDetailsFormId: string;
}

export interface MakeQuotationContextValue {
  state: MakeQuotationState;
  actions: MakeQuotationActions;
  meta: MakeQuotationMeta;
}

export interface MakeQuotationSnapshot {
  clientInfo: ClientInfoValues | null;
  serviceInfo: ServiceInfoValues | null;
  documentValues: DocumentValues | null;
  quotationDetails: QuotationDetailsValues | null;
  billingDetails: BillingDetailsValues | null;
  terms: TermsValues | null;
  signatory: ViewerSignatoryValues | null;
}
