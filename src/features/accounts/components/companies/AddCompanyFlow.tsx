import { useState, useEffect, useRef } from "react";
import { useBeforeUnload, useBlocker, useNavigate } from "react-router";
import { Paper, Box, Text, Group, Button, Divider, Modal } from "@mantine/core";
import { ArrowLeftAlt } from "@nine-thirty-five/material-symbols-react/outlined";
import { notifications } from "@mantine/notifications";
import type { ZodIssue } from "zod";
import { companyService } from "@/features/accounts/services/company.service";
import type { CompanyFullDetails, CompanySummary, CompanyCreateRequest, CompanyUpdateRequest } from "@/features/accounts/types/company.types";
import { mapCompanyFullDetailsToBackendRequest, prepareDocumentPayload } from "@/features/accounts/types/company.types";
import { PageCard } from "@/components/PageCard";
import { CompanyModal } from "./CompanyModal";
// import { AddCompanyStepper } from "./AddCompanyStepper";
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
import { EditBasicInformation } from "./CompanyInformation/EditBasicInformation";
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

const COMPANY_DRAFT_STORAGE_KEY = "jltcb.companyAddDrafts";

interface CompanyDraftItem {
  draftId: string;
  company: CompanyFullDetails;
  savedAt: string;
}

const createDraftId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `draft-${Date.now()}`;

const emptyCompanyDraft: CompanyFullDetails = {
  companyId: undefined,
  summary: { companyName: "" },
  address: {},
  keyContacts: {},
  governmentCompliance: {},
  commercialInformation: {},
  operationalInstructions: {},
  riskIssueMonitoring: {},
  documentsAttachments: {},
  strategicInsight: {},
};

const sanitizeDraftCompany = (company: CompanyFullDetails): CompanyFullDetails => ({
  ...company,
  documentsAttachments: {
    documents: company.documentsAttachments?.documents?.map((doc) => ({
      name: doc.name,
      url: doc.url ?? null,
    })),
    attachments: company.documentsAttachments?.attachments?.map((doc) => ({
      name: doc.name,
      url: doc.url ?? null,
    })),
  },
});

const loadDrafts = (): CompanyDraftItem[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(COMPANY_DRAFT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CompanyDraftItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveDrafts = (drafts: CompanyDraftItem[]) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(COMPANY_DRAFT_STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    // ignore storage failures
  }
};

const upsertDraft = (draftId: string, company: CompanyFullDetails): CompanyDraftItem[] => {
  const sanitized = sanitizeDraftCompany(company);
  const drafts = loadDrafts().filter((item) => item.draftId !== draftId);
  const next = [
    {
      draftId,
      savedAt: new Date().toISOString(),
      company: sanitized,
    },
    ...drafts,
  ].slice(0, 10);
  saveDrafts(next);
  return next;
};

const removeDraftById = (draftId: string) => {
  const drafts = loadDrafts().filter((draft) => draft.draftId !== draftId);
  saveDrafts(drafts);
  return drafts;
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

const draftHasContent = (company: CompanyFullDetails): boolean => {
  const json = JSON.stringify(sanitizeDraftCompany(company));
  const empty = JSON.stringify({
    companyId: undefined,
    summary: { companyName: "" },
    address: {},
    keyContacts: {},
    governmentCompliance: {},
    commercialInformation: {},
    operationalInstructions: {},
    riskIssueMonitoring: {},
    documentsAttachments: {},
    strategicInsight: {},
  });
  return json !== empty;
};

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
  const normalized = issue.path.join(".");
  return normalized || "_form";
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

  notifications.show({
    title: "Validation Error",
    message: validationMessage,
    color: "orange",
    autoClose: 5000,
  });

  return false;
};

export function AddCompanyFlow() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [draftCompany, setDraftCompany] = useState<CompanyFullDetails>(emptyCompanyDraft);
  const [drafts, setDrafts] = useState<CompanyDraftItem[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [showLeaveDraftModal, setShowLeaveDraftModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<any>(null);
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
    "Risk, Issue &\nCompliance Monitoring",
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

  useEffect(() => {
    const savedDrafts = loadDrafts();
    setDrafts(savedDrafts);
    setShowDraftPicker(savedDrafts.length > 0);
  }, []);

  const hasUnsavedChanges = !!(!draftCompany || draftHasContent(draftCompany));
  const shouldWarnOnExit = hasUnsavedChanges && !isSaving;
  const blocker = useBlocker(shouldWarnOnExit);

  useBeforeUnload(
    (event) => {
      if (!shouldWarnOnExit) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    },
  );

  useEffect(() => {
    if (blocker.state !== "blocked") {
      return;
    }

    setPendingNavigation(blocker);
    setShowLeaveDraftModal(true);
  }, [blocker]);

  const closeLeaveDraftModal = () => {
    setShowLeaveDraftModal(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  };

  const handleLeaveSaveDraft = () => {
    if (!draftCompany) {
      return;
    }

    const draftId = currentDraftId ?? createDraftId();
    setCurrentDraftId(draftId);
    const nextDrafts = upsertDraft(draftId, draftCompany);
    setDrafts(nextDrafts);
    setShowLeaveDraftModal(false);
    pendingNavigation?.proceed();
  };

  const handleLeaveDiscard = () => {
    if (currentDraftId) {
      const nextDrafts = removeDraftById(currentDraftId);
      setDrafts(nextDrafts);
      setCurrentDraftId(null);
    }
    setShowLeaveDraftModal(false);
    pendingNavigation?.proceed();
  };

  const cleanNulls = (obj: any) =>
    JSON.parse(
      JSON.stringify(obj, (_, value) => (value === null ? undefined : value)),
    );

  const updateSection = <K extends keyof Omit<CompanyFullDetails, "companyId">>(
    section: K,
    value: CompanyFullDetails[K]
  ) => {
    setDraftCompany((prev) => ({
      ...prev,
      [section]: value,
    } as CompanyFullDetails));
  };

  const basicInformationCommitRef = useRef<(() => CompanySummary) | null>(null);

  const handleResumeDraft = (draftId: string) => {
    const selectedDraft = drafts.find((draft) => draft.draftId === draftId);
    if (!selectedDraft) return;
    setCurrentDraftId(draftId);
    setDraftCompany(selectedDraft.company);
    setShowDraftPicker(false);
  };

  const handleDeleteDraft = (draftId: string) => {
    const nextDrafts = removeDraftById(draftId);
    setDrafts(nextDrafts);
    if (draftId === currentDraftId) {
      setCurrentDraftId(null);
      setDraftCompany({
        companyId: undefined,
        summary: { companyName: "" },
        address: {},
        keyContacts: {},
        governmentCompliance: {},
        commercialInformation: {},
        operationalInstructions: {},
        riskIssueMonitoring: {},
        documentsAttachments: {},
        strategicInsight: {},
      });
      setShowDraftPicker(nextDrafts.length > 0);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <EditBasicInformation
            key={`basic-new-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            errors={sectionErrors.basic_info}
            onChange={(summary) => updateSection("summary", summary)}
            onRegisterCommit={(commit) => {
              basicInformationCommitRef.current = commit;
            }}
          />
        );
      case 2:
        return (
          <EditBusinessAddress
            key={`address-new-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            errors={sectionErrors.address}
            onChange={(address) => updateSection("address", address)}
          />
        );
      case 3:
        return (
          <EditKeyContacts
            key={`contacts-new-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            errors={sectionErrors.contacts}
            onChange={(keyContacts) => updateSection("keyContacts", keyContacts)}
          />
        );
      case 4:
        return (
          <EditGovernment
            key={`government-new-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            errors={sectionErrors.registration}
            onChange={(governmentCompliance) => updateSection("governmentCompliance", governmentCompliance)}
          />
        );
      case 5:
        return (
          <EditCommercial
            key={`commercial-new-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            errors={sectionErrors.pricing}
            onChange={(commercialInformation) => updateSection("commercialInformation", commercialInformation)}
          />
        );
      case 6:
        return (
          <EditOperationalInstructions
            key={`operational-new-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            errors={sectionErrors.operation}
            onChange={(operationalInstructions) => updateSection("operationalInstructions", operationalInstructions)}
          />
        );
      case 7:
        return (
          <EditRiskIssue
            key={`risk-new-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            errors={sectionErrors.monitoring}
            onChange={(riskIssueMonitoring) => updateSection("riskIssueMonitoring", riskIssueMonitoring)}
          />
        );
      case 8:
        return (
          <EditDocuments
            key={`documents-new-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            errors={sectionErrors.documents}
            onChange={(documentsAttachments) => updateSection("documentsAttachments", documentsAttachments)}
          />
        );
      case 9:
        return (
          <EditStrategicInsight
            key={`strategic-new-${draftCompany?.summary?.companyName ?? ""}`}
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
      throw new Error("Company details are not ready yet.");
    }

    if (!validateDraftCompany(draftCompany, setActiveStep)) {
      throw new Error("Please fix validation errors before saving.");
    }

    const createPayload: CompanyCreateRequest = mapCompanyFullDetailsToBackendRequest(draftCompany);
    const created = await companyService.createCompany(createPayload);

    if (created?.companyId) {
      const documents = await prepareDocumentPayload(draftCompany.documentsAttachments?.documents);
      const attachments = await prepareDocumentPayload(draftCompany.documentsAttachments?.attachments);
      if ((documents?.length ?? 0) > 0 || (attachments?.length ?? 0) > 0) {
        const payload = {
          documents,
          attachments,
        } as CompanyUpdateRequest;
        console.debug("create -> updateCompany payload (raw):", payload);
        const cleaned = cleanNulls(payload);
        console.debug("create -> updateCompany payload (cleaned):", cleaned);
        await companyService.updateCompany(created.companyId, cleaned as CompanyUpdateRequest);
      }
    }

    if (currentDraftId) {
      const nextDrafts = removeDraftById(currentDraftId);
      setDrafts(nextDrafts);
      setCurrentDraftId(null);
    }
  };

  const handleSaveCompany = async () => {
    try {
      setIsSaving(true);
      setFinishModalError(null);
      await performSaveCompany();
      setFinishModalStage("success");
      setDraftCompany(emptyCompanyDraft);
      setCurrentDraftId(null);
      if (blocker.state === "blocked") {
        blocker.reset();
      }
      // Keep the success modal open until the user confirms.
    } catch (error) {
      console.error("Failed to save company:", error);
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
    let nextDraftCompany = draftCompany;

    if (activeStep === 1 && basicInformationCommitRef.current) {
      const summary = basicInformationCommitRef.current();
      nextDraftCompany = { ...draftCompany, summary } as CompanyFullDetails;
      updateSection("summary", summary);
    }

    if (activeStep < steps.length) {
      if (!validateSection(currentSection, nextDraftCompany, (errors) => {
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

    if (!validateSection(currentSection, draftCompany, (errors) => {
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

  return (
    <PageCard
      title="ADD COMPANY"
      subtitle="Fill out company details and classification"
      bgColor="transparent"
      shadow={false}
    >
      <Paper p="lg" style={{ marginTop: "-1rem" }}>
        <Modal
          opened={showLeaveDraftModal}
          onClose={closeLeaveDraftModal}
          title="You have unsaved changes"
          centered
          closeOnClickOutside={false}
          closeOnEscape={false}
        >
          <Text mb="md">
            You have unsaved changes. Would you like to save this as a draft before leaving?
          </Text>
          <Box style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="outline" color="red" onClick={handleLeaveDiscard}>
              Discard
            </Button>
            <Button onClick={handleLeaveSaveDraft}>
              Save
            </Button>
          </Box>
        </Modal>

        <CompanyModal
          opened={isFinishModalOpen}
          mode="add"
          stage={finishModalStage}
          isLoading={isSaving}
          errorMessage={finishModalError}
          onConfirm={handleSaveCompany}
          onClose={closeFinishModal}
        />

        {showDraftPicker && drafts.length > 0 && (
          <Box mb="md" p="md" style={{ border: "1px solid #ced4da", borderRadius: 12, backgroundColor: "#f8f9fa" }}>
            <Text size="lg" fw={600} mb="xs">
              Resume saved draft
            </Text>
            <Text c="dimmed" size="sm" mb="md">
              You have saved draft company profiles from previous sessions. Select one to continue working or start a new company.
            </Text>
            <Box style={{ display: "grid", gap: "0.75rem" }}>
              {drafts.map((draft) => (
                <Box key={draft.draftId} style={{ border: "1px solid #dee2e6", borderRadius: 10, padding: "0.75rem" }}>
                  <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                    <Box>
                      <Text fw={500}>{draft.company.summary.companyName || "Untitled draft"}</Text>
                      <Text c="dimmed" size="xs">
                        Saved {new Date(draft.savedAt).toLocaleString()}
                      </Text>
                    </Box>
                    <Box style={{ display: "flex", gap: "0.5rem" }}>
                      <Button size="xs" onClick={() => handleResumeDraft(draft.draftId)}>
                        Resume
                      </Button>
                      <Button size="xs" variant="outline" color="red" onClick={() => handleDeleteDraft(draft.draftId)}>
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            <Divider my="md" />
            <Box style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button size="sm" variant="outline" onClick={() => setShowDraftPicker(false)}>
                Start new company
              </Button>
            </Box>
          </Box>
        )}

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
                  style={{
                    width: 32,
                    height: 32,
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
                        width: "200px",
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
        {renderStep()}

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
            <Button
              color="#4E6174"
              size="md"
              radius="md"
              style={{ minWidth: 160 }}
              onClick={handlePrimaryAction}
              loading={isSaving}
              disabled={isSaving}
            >
              {activeStep === steps.length ? "Finish" : "Next"}
            </Button>
          </Group>
        </Group>
      </Paper>
    </PageCard>
  );
}
