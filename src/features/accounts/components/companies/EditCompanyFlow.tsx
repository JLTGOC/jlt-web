import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Paper, Box, Text, Group, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { ZodIssue } from "zod";
import { companyService } from "@/features/accounts/services/company.service";
import type { CompanyFullDetails } from "@/features/accounts/types/company.types";
import {
  mapCompanyFullDetailsToBackendUpdateRequest,
  mapCompanySummaryToBackend,
  mapAddressToBackend,
  mapContactPersonToBackend,
  mapRegistrationToBackend,
  mapCommercialToBackend,
  mapOperationalToBackend,
  mapMonitoringToBackend,
  mapInsightsToBackend,
  prepareDocumentPayload,
} from "@/features/accounts/types/company.types";
import { PageCard } from "@/components/PageCard";
import { CompanyModal } from "./CompanyModal";
import {
  companySummarySchema,
  companyAddressSchema,
  companyKeyContactsSchema,
  companyGovernmentComplianceSchema,
  companyCommercialInformationSchema,
  companyOperationalInstructionsSchema,
  companyRiskIssueMonitoringSchema,
  companyDocumentsAttachmentsSchema,
  companyStrategicInsightSchema,
} from "@/features/accounts/schemas/company.schema";
import { EditBasicInformation, type EditBasicInformationHandle } from "./CompanyInformation/EditBasicInformation";
import { EditBusinessAddress } from "./CompanyInformation/EditBusinessAddress";
import { EditKeyContacts } from "./CompanyInformation/EditKeyContacts";
import { EditGovernment } from "./CompanyInformation/EditGovernment";
import { EditCommercial } from "./CompanyInformation/EditCommercial";
import { EditOperationalInstructions } from "./CompanyInformation/EditOperationalInstructions";
import { EditRiskIssue } from "./CompanyInformation/EditRiskIssue";
import { EditDocuments } from "./CompanyInformation/EditDocuments";
import { EditStrategicInsight } from "./CompanyInformation/EditStrategicInsight";

type CompanySection =
  | "basic_info"
  | "address"
  | "contacts"
  | "registration"
  | "pricing"
  | "operation"
  | "monitoring"
  | "documents"
  | "insights";

const emptySectionErrors: Record<CompanySection, Record<string, string>> = {
  basic_info: {},
  address: {},
  contacts: {},
  registration: {},
  pricing: {},
  operation: {},
  monitoring: {},
  documents: {},
  insights: {},
};

const sectionSchemaMap: Record<CompanySection, any> = {
  basic_info: companySummarySchema,
  address: companyAddressSchema,
  contacts: companyKeyContactsSchema,
  registration: companyGovernmentComplianceSchema,
  pricing: companyCommercialInformationSchema,
  operation: companyOperationalInstructionsSchema,
  monitoring: companyRiskIssueMonitoringSchema,
  documents: companyDocumentsAttachmentsSchema,
  insights: companyStrategicInsightSchema,
};

const sectionDataMap = (company: CompanyFullDetails | null) => ({
  basic_info: company?.summary ?? { companyName: "" },
  address: company?.address ?? {},
  contacts: company?.keyContacts ?? {},
  registration: company?.governmentCompliance ?? {},
  pricing: company?.commercialInformation ?? {},
  operation: company?.operationalInstructions ?? {},
  monitoring: company?.riskIssueMonitoring ?? {},
  documents: company?.documentsAttachments ?? {},
  insights: company?.strategicInsight ?? {},
});

const normalizeIssueField = (issue: ZodIssue): string => {
  return issue.path.slice(1).join(".") || "_form";
};

const validateSection = (
  section: CompanySection,
  company: CompanyFullDetails | null,
  onError?: (errors: Record<string, string>) => void,
): boolean => {
  if (!company) return true;

  const schema = sectionSchemaMap[section];
  const sectionData = sectionDataMap(company)[section];
  const result = schema.safeParse(sectionData);
  const nextErrors = { ...emptySectionErrors };

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((issue: ZodIssue) => {
      const field = normalizeIssueField(issue);
      fieldErrors[field] = issue.message;
    });
    nextErrors[section] = fieldErrors;
    onError?.(fieldErrors);
    return false;
  }

  onError?.({});
  return true;
};

const normalizeContactEmail = (contact?: { email?: string | null } | null | undefined): string | null =>
  contact?.email?.trim().toLowerCase() ?? null;

const getDuplicateContactEmails = (
  keyContacts?: CompanyFullDetails["keyContacts"] | null,
): string[] => {
  if (!keyContacts) return [];

  const emails = [
    normalizeContactEmail(keyContacts.primaryContact),
    normalizeContactEmail(keyContacts.secondaryContact),
    normalizeContactEmail(keyContacts.billingContact),
  ].filter(Boolean) as string[];

  return Array.from(
    new Set(emails.filter((email, index) => emails.indexOf(email) !== index)),
  );
};


const validateCurrentSection = (
  company: CompanyFullDetails,
  section: CompanySection,
  onError: (errors: Record<string, string>) => void,
): boolean => {
  if (!validateSection(section, company, onError)) {
    return false;
  }

  if (section === "contacts") {
    const duplicateEmails = getDuplicateContactEmails(company.keyContacts);
    if (duplicateEmails.length > 0) {
      notifications.show({
        title: "Duplicate contact emails",
        message: `Each key contact must use a unique email address. Duplicate email(s): ${duplicateEmails.join(", ")}`,
        color: "orange",
        autoClose: 7000,
      });
      return false;
    }
  }

  return true;
};

interface EditCompanyFlowProps {
  companyId: string;
  initialCompany?: CompanyFullDetails;
  initialStep?: number;
}

export function EditCompanyFlow({ companyId, initialCompany, initialStep }: EditCompanyFlowProps) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(initialStep ?? 1);
  const [draftCompany, setDraftCompany] = useState<CompanyFullDetails | null>(initialCompany ?? null);
  const [isLoading, setIsLoading] = useState(!initialCompany);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [finishModalStage, setFinishModalStage] = useState<"confirm" | "success" | "error">("confirm");
  const [finishModalError, setFinishModalError] = useState<string | null>(null);
  const [sectionErrors, setSectionErrors] = useState<Record<CompanySection, Record<string, string>>>(
    emptySectionErrors,
  );

  useEffect(() => {
    if (typeof initialStep !== "undefined") {
      setActiveStep(initialStep);
    }
  }, [initialStep]);

  const getStepSection = (step: number): CompanySection => {
    const sectionMap: Record<number, CompanySection> = {
      1: "basic_info",
      2: "address",
      3: "contacts",
      4: "registration",
      5: "pricing",
      6: "operation",
      7: "monitoring",
      8: "documents",
      9: "insights",
    };
    return sectionMap[step] ?? "basic_info";
  };

  // Load company on mount or when companyId changes
  useEffect(() => {
    if (initialCompany) {
      setDraftCompany(initialCompany);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);

    console.debug(`[EditCompanyFlow] Fetching company with ID:`, companyId);

    companyService
      .getCompanyById(companyId)
      .then((data) => {
        console.debug(`[EditCompanyFlow] Received company data:`, data);
        if (active) {
          setDraftCompany(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load company details", error);
        notifications.show({
          title: "Error",
          message: "Failed to load company details",
          color: "red",
        });
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [companyId, initialCompany]);

  // Fetch section data when step changes
  useEffect(() => {
    if (!companyId || !draftCompany) {
      return;
    }

    const section = getStepSection(activeStep);

    let active = true;
    setIsLoading(true);

    console.debug(`[EditCompanyFlow] Fetching section for step ${activeStep}:`, section);

    companyService
      .getCompanyById(companyId, section as any)
      .then((fetchedData) => {
        console.debug(`[EditCompanyFlow] Received section data for ${section}:`, fetchedData);
        if (active) {
          const sectionFieldMap: Record<string, keyof Omit<CompanyFullDetails, "companyId">> = {
            basic_info: "summary",
            address: "address",
            contacts: "keyContacts",
            registration: "governmentCompliance",
            pricing: "commercialInformation",
            operation: "operationalInstructions",
            monitoring: "riskIssueMonitoring",
            documents: "documentsAttachments",
            insights: "strategicInsight",
          };

          const fieldKey = sectionFieldMap[section];
          if (fieldKey) {
            setDraftCompany((prev) => ({
              ...prev!,
              [fieldKey]: fetchedData[fieldKey],
            }));
          }
        }
      })
      .catch((error) => {
        console.error(`Failed to load section data for ${section}:`, error);
        notifications.show({
          title: "Error",
          message: `Failed to load ${section} details`,
          color: "red",
        });
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [activeStep, companyId]);

  const updateSection = <K extends keyof Omit<CompanyFullDetails, "companyId">>(
    section: K,
    value: CompanyFullDetails[K]
  ) => {
    setDraftCompany((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: value,
      } as CompanyFullDetails;
    });
  };

  const basicInformationRef = useRef<EditBasicInformationHandle | null>(null);

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <EditBasicInformation
            ref={basicInformationRef}
            key={`basic-${companyId}`}
            company={draftCompany}
            errors={sectionErrors.basic_info}
            onChange={(summary) => updateSection("summary", summary)}
          />
        );
      case 2:
        return (
          <EditBusinessAddress
            key={`address-${companyId}`}
            company={draftCompany}
            errors={sectionErrors.address}
            onChange={(address) => updateSection("address", address)}
          />
        );
      case 3:
        return (
          <EditKeyContacts
            key={`contacts-${companyId}`}
            company={draftCompany}
            errors={sectionErrors.contacts}
            onChange={(keyContacts) => updateSection("keyContacts", keyContacts)}
          />
        );
      case 4:
        return (
          <EditGovernment
            key={`government-${companyId}`}
            company={draftCompany}
            errors={sectionErrors.registration}
            onChange={(governmentCompliance) => updateSection("governmentCompliance", governmentCompliance)}
          />
        );
      case 5:
        return (
          <EditCommercial
            key={`commercial-${companyId}`}
            company={draftCompany}
            errors={sectionErrors.pricing}
            onChange={(commercialInformation) => updateSection("commercialInformation", commercialInformation)}
          />
        );
      case 6:
        return (
          <EditOperationalInstructions
            key={`operational-${companyId}`}
            company={draftCompany}
            errors={sectionErrors.operation}
            onChange={(operationalInstructions) => updateSection("operationalInstructions", operationalInstructions)}
          />
        );
      case 7:
        return (
          <EditRiskIssue
            key={`risk-${companyId}`}
            company={draftCompany}
            errors={sectionErrors.monitoring}
            onChange={(riskIssueMonitoring) => updateSection("riskIssueMonitoring", riskIssueMonitoring)}
          />
        );
      case 8:
        return (
          <EditDocuments
            key={`documents-${companyId}`}
            company={draftCompany}
            errors={sectionErrors.documents}
            onChange={(documentsAttachments) => updateSection("documentsAttachments", documentsAttachments)}
          />
        );
      case 9:
        return (
          <EditStrategicInsight
            key={`strategic-${companyId}`}
            company={draftCompany}
            errors={sectionErrors.insights}
            onChange={(strategicInsight) => updateSection("strategicInsight", strategicInsight)}
          />
        );
      default:
        return null;
    }
  };

  const performSaveCompany = async (): Promise<CompanyFullDetails> => {
    if (!draftCompany) {
      throw new Error("Company details are missing.");
    }

    const section = getStepSection(activeStep);
    if (!validateCurrentSection(draftCompany, section, (errors) => {
      setSectionErrors((prev) => ({
        ...prev,
        [section]: errors,
      }));
    })) {
      throw new Error("Validation failed for the current section.");
    }

    try {
      setIsSaving(true);

      // Helpful debug: log validation issues for the current section
      try {
        const validation = sectionSchemaMap[section].safeParse(sectionDataMap(draftCompany)[section]);
        if (!validation.success) {
          console.warn(`Zod validation issues for section ${section} before update:`, validation.error.issues);
        }
      } catch (err) {
        console.warn("Failed to run zod validation for debug:", err);
      }

      const cleanNulls = (obj: any) => JSON.parse(JSON.stringify(obj, (_, v) => {
        if (v === null) return undefined;
        return v;
      }));

      // Build a section-specific payload
      let sectionPayload: Record<string, any> = {};
      const addressPayload = {
        address: mapAddressToBackend(draftCompany.address),
      };

      switch (section) {
        case "basic_info":
          sectionPayload = {
            basic_info: mapCompanySummaryToBackend(draftCompany.summary),
            ...addressPayload,
          };
          break;
        case "address":
          sectionPayload = addressPayload;
          break;
        case "contacts":
          sectionPayload = {
            primary: mapContactPersonToBackend(draftCompany.keyContacts?.primaryContact),
            secondary: mapContactPersonToBackend(draftCompany.keyContacts?.secondaryContact),
            billing: mapContactPersonToBackend(draftCompany.keyContacts?.billingContact),
            ...addressPayload,
          };
          break;
        case "registration":
          sectionPayload = {
            registration: mapRegistrationToBackend(draftCompany.governmentCompliance),
            ...addressPayload,
          };
          break;
        case "pricing":
          sectionPayload = {
            pricing: mapCommercialToBackend(draftCompany.commercialInformation),
            ...addressPayload,
          };
          break;
        case "operation":
          sectionPayload = {
            operation: mapOperationalToBackend(draftCompany.operationalInstructions),
            ...addressPayload,
          };
          break;
        case "monitoring":
          sectionPayload = {
            monitoring: mapMonitoringToBackend(draftCompany.riskIssueMonitoring),
            ...addressPayload,
          };
          break;
        case "documents":
          sectionPayload = {
            documents: await prepareDocumentPayload(draftCompany.documentsAttachments?.documents),
            attachments: await prepareDocumentPayload(draftCompany.documentsAttachments?.attachments),
            ...addressPayload,
          };
          break;
        case "insights":
          sectionPayload = {
            insights: mapInsightsToBackend(draftCompany.strategicInsight),
            ...addressPayload,
          };
          break;
        default:
          sectionPayload = mapCompanyFullDetailsToBackendUpdateRequest(draftCompany) as Record<string, any>;
      }

      const { documents, attachments, ...restOfPayload } = sectionPayload;
      let cleanedPayload = cleanNulls(restOfPayload);

      // Detect keys that backend expects to be objects but are null/incorrectly typed
      const expectedObjectKeys = [
        "basic_info",
        "address",
        "primary",
        "secondary",
        "billing",
        "registration",
        "pricing",
        "monitoring",
        "operation",
        "insights",
      ];

      const objectTypeIssues: Array<{ key: string; value: any }> = [];
      expectedObjectKeys.forEach((k) => {
        if (Object.prototype.hasOwnProperty.call(cleanedPayload, k)) {
          const v = cleanedPayload[k];
          if (v === null) {
            objectTypeIssues.push({ key: k, value: v });
          } else if (typeof v !== "object" || Array.isArray(v)) {
            // If it's not an object (or it's an array), it's likely invalid when backend expects an object
            objectTypeIssues.push({ key: k, value: v });
          }
        }
      });

      if (objectTypeIssues.length > 0) {
        console.warn("Payload object-type issues (expected object, found null/incorrect type):", objectTypeIssues);
      }

      const formDataFromObject = (obj: any, form: FormData = new FormData(), namespace = ""): FormData => {
        if (obj === null || obj === undefined) {
          return form;
        }

        if (obj instanceof File) {
          if (!namespace) {
            throw new Error("Cannot append File without a form field name.");
          }
          form.append(namespace, obj);
          return form;
        }

        if (Array.isArray(obj)) {
          obj.forEach((value, index) => {
            if (value === undefined || value === null) {
              return;
            }
            const formKey = `${namespace}[${index}]`;
            if (value instanceof File) {
              form.append(`${formKey}[file]`, value);
            } else if (typeof value === "object") {
              formDataFromObject(value, form, formKey);
            } else {
              form.append(formKey, String(value));
            }
          });
          return form;
        }

        if (typeof obj === "object") {
          Object.entries(obj).forEach(([key, value]) => {
            if (value === undefined || value === null) {
              return;
            }
            const formKey = namespace ? `${namespace}[${key}]` : key;
            if (value instanceof File) {
              form.append(formKey, value);
            } else if (Array.isArray(value) || typeof value === "object") {
              formDataFromObject(value, form, formKey);
            } else {
              form.append(formKey, String(value));
            }
          });
          return form;
        }

        if (!namespace) {
          throw new Error("Cannot append primitive value without a form field name.");
        }

        form.append(namespace, String(obj));
        return form;
      };

      const appendDocumentArray = (
        form: FormData,
        items: any[] | undefined,
        fieldName: string,
      ) => {
        if (!Array.isArray(items) || items.length === 0) {
          return;
        }

        items.forEach((doc, index) => {
          const isNewFile = doc.file instanceof File;
          const isExistingFile = doc.id != null;

          if (!isNewFile && !isExistingFile) {
            return;
          }

          const prefix = `${fieldName}[${index}]`;

          if (doc.id != null) {
            form.append(`${prefix}[id]`, String(doc.id));
          }
          if (doc.name != null) {
            form.append(`${prefix}[name]`, String(doc.name));
          }
          if (doc.filepath != null) {
            form.append(`${prefix}[filepath]`, String(doc.filepath));
          }
          if (doc.file_type != null) {
            form.append(`${prefix}[file_type]`, String(doc.file_type));
          }
          if (doc.url != null) {
            form.append(`${prefix}[url]`, String(doc.url));
          }
          if (isNewFile) {
            form.append(`${prefix}[file]`, doc.file);
          }
        });
      };

      const requestFormData = new FormData();
      const copyPayload = { ...cleanedPayload };
      formDataFromObject(copyPayload, requestFormData);
      appendDocumentArray(requestFormData, documents, "documents");
      appendDocumentArray(requestFormData, attachments, "attachments");
      requestFormData.append("_method", "PUT");

      let updatedCompany: CompanyFullDetails;
      try {
        await companyService.updateCompany(companyId, requestFormData);

        if (section === "documents") {
          updatedCompany = await companyService.getCompanyById(companyId, "documents");
        } else {
          updatedCompany = await companyService.getCompanyById(companyId, section);
        }
      } catch (err: any) {
        // Surface server response details for easier debugging
        console.error("Update failed. Server response:", err?.response?.status, err?.response?.data);
        throw err;
      }

      setDraftCompany(updatedCompany);
      return updatedCompany;
    } catch (error: any) {
      console.error("Failed to save company:", error);

      const resp = error?.response?.data ?? error?.data ?? null;
      let message = "Failed to save company. Please try again.";
      if (resp) {
        if (typeof resp === "string") {
          message = resp;
        } else if (resp.message) {
          message = resp.message as string;
        } else {
          try {
            message = JSON.stringify(resp);
          } catch (e) {
            message = "Validation error returned by server.";
          }
        }
      }

      throw new Error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCompany = async () => {
    if (!draftCompany) {
      notifications.show({
        title: "Error",
        message: "Company details are missing.",
        color: "red",
      });
      return;
    }

    const currentSection = getStepSection(activeStep);
    if (!validateCurrentSection(draftCompany, currentSection, (errors) => {
      setSectionErrors((prev) => ({
        ...prev,
        [currentSection]: errors,
      }));
    })) {
      return;
    }

    setFinishModalStage("confirm");
    setFinishModalError(null);
    setIsFinishModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      setIsSaving(true);
      setFinishModalError(null);
      const updatedCompany = await performSaveCompany();
      if (updatedCompany) {
        setDraftCompany(updatedCompany);
      }
      setFinishModalStage("success");
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      setFinishModalError(message);
      setFinishModalStage("error");
    } finally {
      setIsSaving(false);
    }
  };

  const closeFinishModal = () => {
    setIsFinishModalOpen(false);
    if (finishModalStage === "success") {
      navigate("/accounts/companies", { replace: true });
    }
  };


  return (
    <PageCard
      title="EDIT COMPANY"
      subtitle="Update the selected company profile"
      bgColor="transparent"
      shadow={false}
    >
      <Paper p="lg" style={{ marginTop: "-1rem" }}>
        <CompanyModal
          opened={isFinishModalOpen}
          mode="edit"
          stage={finishModalStage}
          isLoading={isSaving}
          errorMessage={finishModalError}
          onConfirm={handleConfirmUpdate}
          onClose={closeFinishModal}
        />

        {/* Current section form */}
        {isLoading ? (
          <Box style={{ padding: "2rem", textAlign: "center" }}>
            <Text>Loading company details...</Text>
          </Box>
        ) : (
          renderStep()
        )}

        <Group justify="flex-end" mt="md" style={{ width: "100%" }}>
          <Button
            color="#4E6174"
            size="md"
            radius="md"
            style={{ minWidth: 160 }}
            onClick={handleSaveCompany}
            loading={isSaving}
            disabled={isSaving}
          >
            Update
          </Button>
        </Group>
      </Paper>
    </PageCard>
  );
}
