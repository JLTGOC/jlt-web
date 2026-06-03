import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Paper, Box, Text, Group, Button } from "@mantine/core";
import { ArrowLeftAlt } from "@nine-thirty-five/material-symbols-react/outlined";
import { notifications } from "@mantine/notifications";
import type { ZodIssue } from "zod";
import { companyService } from "@/features/accounts/services/company.service";
import type { CompanyFullDetails, CompanyUpdateRequest } from "@/features/accounts/types/company.types";
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
  normalizeDocumentList,
} from "@/features/accounts/types/company.types";
import { PageCard } from "@/components/PageCard";
import { CompanyModal } from "./CompanyModal";
import {
  companyFullDetailsSchema,
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

const validateDraftCompany = (company: CompanyFullDetails, setActiveStep: (step: number) => void) => {
  const duplicateEmails = getDuplicateContactEmails(company.keyContacts);
  if (duplicateEmails.length > 0) {
    setActiveStep(3);
    notifications.show({
      title: "Duplicate contact emails",
      message: `Each key contact must use a unique email address. Duplicate email(s): ${duplicateEmails.join(", ")}`,
      color: "orange",
      autoClose: 7000,
    });
    return false;
  }

  const validationResult = companyFullDetailsSchema.safeParse(company);
  if (validationResult.success) {
    return true;
  }

  const validationMessage = validationResult.error.issues
    .map((issue) => issue.message)
    .join(". ");

  setActiveStep(1);
  notifications.show({
    title: "Validation Error",
    message: validationMessage,
    color: "orange",
    autoClose: 5000,
  });

  return false;
};

interface EditCompanyFlowProps {
  companyId: string;
  initialCompany?: CompanyFullDetails;
}

export function EditCompanyFlow({ companyId, initialCompany }: EditCompanyFlowProps) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [draftCompany, setDraftCompany] = useState<CompanyFullDetails | null>(initialCompany ?? null);
  const [isLoading, setIsLoading] = useState(!initialCompany);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [finishModalStage, setFinishModalStage] = useState<"confirm" | "success" | "error">("confirm");
  const [finishModalError, setFinishModalError] = useState<string | null>(null);
  const [sectionErrors, setSectionErrors] = useState<Record<CompanySection, Record<string, string>>>(
    emptySectionErrors,
  );

  const steps = [
    "Basic Information",
    "Business Address &\nLocation",
    "Key Contacts",
    "Government &\nCompliance Details",
    "Commercial &\nPricing Information",
    "Operational Instructions",
    "Risk, Issue And\nCompliance Monitoring",
    "Documents &\nAttachments",
    "Strategic Insight",
  ];

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

  const performSaveCompany = async () => {
    if (!draftCompany) {
      throw new Error("Company details are missing.");
    }

    if (!validateDraftCompany(draftCompany, setActiveStep)) {
      return;
    }

    try {
      setIsSaving(true);

      // Determine which section to update based on current activeStep
      const section = getStepSection(activeStep);

      // Helpful debug: log validation issues for the full company object
      try {
        const validation = companyFullDetailsSchema.safeParse(draftCompany);
        if (!validation.success) {
          console.warn("Zod validation issues for company before update:", validation.error.issues);
        }
      } catch (err) {
        console.warn("Failed to run zod validation for debug:", err);
      }

      const cleanNulls = (obj: any) => JSON.parse(JSON.stringify(obj, (_, v) => (v === null ? undefined : v)));

      // Build a section-specific payload
      let sectionPayload: Record<string, any> = {};
      switch (section) {
        case "basic_info":
          sectionPayload = { basic_info: mapCompanySummaryToBackend(draftCompany.summary) };
          break;
        case "address":
          sectionPayload = {
            address: mapAddressToBackend(draftCompany.address),
            warehouse_addresses: draftCompany.address?.warehouseAddresses,
            delivery_addresses: draftCompany.address?.deliveryAddresses,
          };
          break;
        case "contacts":
          sectionPayload = {
            primary: mapContactPersonToBackend(draftCompany.keyContacts?.primaryContact),
            secondary: mapContactPersonToBackend(draftCompany.keyContacts?.secondaryContact),
            billing: mapContactPersonToBackend(draftCompany.keyContacts?.billingContact),
          };
          break;
        case "registration":
          sectionPayload = { registration: mapRegistrationToBackend(draftCompany.governmentCompliance) };
          break;
        case "pricing":
          sectionPayload = { pricing: mapCommercialToBackend(draftCompany.commercialInformation) };
          break;
        case "operation":
          sectionPayload = { operation: mapOperationalToBackend(draftCompany.operationalInstructions) };
          break;
        case "monitoring":
          sectionPayload = { monitoring: mapMonitoringToBackend(draftCompany.riskIssueMonitoring) };
          break;
        case "documents":
          sectionPayload = {
            documents: normalizeDocumentList(draftCompany.documentsAttachments?.documents),
            attachments: normalizeDocumentList(draftCompany.documentsAttachments?.attachments),
          };
          break;
        case "insights":
          sectionPayload = { insights: mapInsightsToBackend(draftCompany.strategicInsight) };
          break;
        default:
          sectionPayload = mapCompanyFullDetailsToBackendUpdateRequest(draftCompany) as Record<string, any>;
      }

      console.log("sectionPayload (raw):", sectionPayload);
      let cleanedPayload = cleanNulls(sectionPayload);
      console.log("sectionPayload (cleaned):", cleanedPayload);

      // Analyze cleaned payload for nulls/empty objects/arrays to aid backend validation debugging
      const analyzePayload = (obj: any, path = "") => {
        const nullPaths: string[] = [];
        const emptyObjectPaths: string[] = [];
        const emptyArrayPaths: string[] = [];
        const typeMap: Record<string, string> = {};

        const walk = (value: any, curPath: string) => {
          const p = curPath || "root";
          if (value === null) {
            nullPaths.push(p);
            typeMap[p] = "null";
            return;
          }
          if (value === undefined) {
            typeMap[p] = "undefined";
            return;
          }
          const t = Object.prototype.toString.call(value);
          if (t === "[object Array]") {
            typeMap[p] = "array";
            if ((value as any[]).length === 0) emptyArrayPaths.push(p);
            (value as any[]).forEach((v, i) => walk(v, `${p}[${i}]`));
            return;
          }
          if (t === "[object Object]") {
            const keys = Object.keys(value);
            typeMap[p] = "object";
            if (keys.length === 0) {
              emptyObjectPaths.push(p);
              return;
            }
            keys.forEach((k) => walk(value[k], curPath ? `${curPath}.${k}` : k));
            return;
          }
          typeMap[p] = typeof value;
        };

        walk(obj, path);

        return { nullPaths, emptyObjectPaths, emptyArrayPaths, typeMap };
      };

      const analysis = analyzePayload(cleanedPayload);
      console.log("payload analysis:", analysis);

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

      // If we're updating documents section, handle file uploads first and then update payload
      if (section === "documents") {
        const docs = draftCompany.documentsAttachments?.documents ?? [];
        const filesToUpload = docs.filter((d: any) => d?.file) as Array<any>;

        if (filesToUpload.length > 0) {
          try {
            const uploaded = await companyService.uploadDocuments(
              companyId,
              filesToUpload.map((d) => d.file as File),
            );

            const mergedDocs = docs.map((d: any) => {
              if (d?.file) {
                const match = uploaded.find((u) => u.name === d.name);
                return { name: d.name, url: match?.url ?? null };
              }
              return { name: d.name, url: d.url ?? null };
            });

            cleanedPayload = cleanNulls({ ...cleanedPayload, documents: mergedDocs, attachments: normalizeDocumentList(draftCompany.documentsAttachments?.attachments) });
          } catch (err) {
            console.error("Failed to upload documents", err);
            notifications.show({ title: "Upload Error", message: "Failed to upload documents.", color: "red" });
          }
        }
      }

      console.log("update payload (stringified):", JSON.stringify(cleanedPayload));
      try {
        await companyService.updateCompany(companyId, cleanedPayload as CompanyUpdateRequest);
      } catch (err: any) {
        // Surface server response details for easier debugging
        console.error("Update failed. Server response:", err?.response?.status, err?.response?.data);
        throw err;
      }

      return;
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

    if (!validateDraftCompany(draftCompany, setActiveStep)) {
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
      await performSaveCompany();
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

  const handlePrimaryAction = () => {
    const currentSection = getStepSection(activeStep);

    if (activeStep === 1 && basicInformationRef.current?.commit) {
      try {
        const summary = basicInformationRef.current.commit();
        updateSection("summary", summary as any);
      } catch (err) {
        console.error("Failed to commit basic information before navigating:", err);
      }
    }

    if (activeStep < steps.length) {
      if (!validateSection(currentSection, draftCompany, (errors) => {
        setSectionErrors((prev) => ({
          ...prev,
          [currentSection]: errors,
        }));
      })) {
        return;
      }

      setActiveStep((s) => s + 1);
      return;
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

        {/* Stepper */}
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: "1rem",
            marginBottom: "0.5rem",
            width: "100%",
          }}
        >
          {steps.map((label, index) => {
            const isActive = index + 1 <= activeStep;
            const isLineActive = index + 1 < activeStep;

            return (
              <Box
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  flex: 1,
                }}
              >
                <Box
                  w={32}
                  h={32}
                  style={{
                    borderRadius: "50%",
                    backgroundColor: isActive ? "#0064E0" : "#dee2e6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Text c="white" size="sm">
                    {index + 1}
                  </Text>

                  {index < steps.length - 1 && (
                    <Box
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "100%",
                        height: "2px",
                        width: "170px",
                        backgroundColor: isLineActive ? "#0064E0" : "#adb5bd",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Box>

                <Text
                  size="sm"
                  fw={300}
                  c="black"
                  style={{
                    whiteSpace: "pre-line",
                    marginTop: 6,
                    textAlign: "center",
                  }}
                >
                  {label}
                </Text>
              </Box>
            );
          })}
        </Box>

        {/* Current step form */}
        {isLoading ? (
          <Box style={{ padding: "2rem", textAlign: "center" }}>
            <Text>Loading company details...</Text>
          </Box>
        ) : (
          renderStep()
        )}

        {/* Navigation buttons */}
        <Group justify="space-between" mt="md" style={{ width: "100%" }}>
          {activeStep !== 1 ? (
            <Button
              size="md"
              radius="md"
              style={{ minWidth: 160, backgroundColor: "#EAEAEA", color: "#4E6174" }}
              onClick={() => setActiveStep((s) => s - 1)}
              disabled={isSaving}
            >
              <Group gap="sm" justify="center">
                <ArrowLeftAlt width={20} height={20} style={{ color: "#4E6174" }} />
                <span>Back</span>
              </Group>
            </Button>
          ) : (
            <Box style={{ minWidth: 160 }} />
          )}

          <Group gap="xs" style={{ marginLeft: activeStep === 1 ? "auto" : "0" }}>
            {activeStep < steps.length && (
              <Button
                color="#4E6174"
                size="md"
                radius="md"
                style={{ minWidth: 160 }}
                onClick={handlePrimaryAction}
                loading={isSaving}
                disabled={isSaving}
              >
                Next
              </Button>
            )}

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
        </Group>
      </Paper>
    </PageCard>
  );
}
