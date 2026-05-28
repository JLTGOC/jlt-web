// src/features/accounts/components/companies/CompanyInformation.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { PageCard } from "@/components/PageCard";
import { Paper, Box, Text, Group, Button } from "@mantine/core";
import { ArrowRightAlt, ArrowLeftAlt } from "@nine-thirty-five/material-symbols-react/outlined";
import { notifications } from "@mantine/notifications";
import type { ZodIssue } from "zod";
import { companyService } from "@/features/accounts/services/company.service";
import type { CompanyFullDetails, CompanyCreateRequest, CompanyUpdateRequest } from "@/features/accounts/types/company.types";
import { companyFullDetailsSchema, companySummarySchema } from "@/features/accounts/schemas/company.schema";

// Import sections
import { EditBasicInformation } from "./CompanyInformation/EditBasicInformation";
import { EditBusinessAddress } from "./CompanyInformation/EditBusinessAddress";
import { EditKeyContacts } from "./CompanyInformation/EditKeyContacts";
import { EditGovernment } from "./CompanyInformation/EditGovernment";
import { EditCommercial } from "./CompanyInformation/EditCommercial";
import { EditOperationalInstructions } from "./CompanyInformation/EditOperationalInstructions";
import { EditRiskIssue } from "./CompanyInformation/EditRiskIssue";
import { EditDocuments } from "./CompanyInformation/EditDocuments";
import { EditStrategicInsight } from "./CompanyInformation/EditStrategicInsight";

export function CompanyInformation() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = (location.state as { companyId?: string; activeStep?: number } | null) ?? null;
  const companyId = locationState?.companyId;
  const [activeStep, setActiveStep] = useState(locationState?.activeStep ?? 1);
  const [draftCompany, setDraftCompany] = useState<CompanyFullDetails | null>(
    companyId
      ? null
      : {
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
        }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isEditMode = Boolean(companyId);

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

  const stepForIssue = (issue: ZodIssue): number => {
    const issueSection = issue.path?.[0];
    const stepMap: Record<string, number> = {
      summary: 1,
      address: 2,
      keyContacts: 3,
      governmentCompliance: 4,
      commercialInformation: 5,
      operationalInstructions: 6,
      riskIssueMonitoring: 7,
      documentsAttachments: 8,
      strategicInsight: 9,
    };

    return typeof issueSection === "string" ? stepMap[issueSection] ?? 1 : 1;
  };

  const validateDraftCompany = (company: CompanyFullDetails) => {
    const validationResult = companyFullDetailsSchema.safeParse(company);
    if (validationResult.success) {
      return true;
    }

    const validationMessage = validationResult.error.issues
      .map((issue) => issue.message)
      .join(". ");

    setActiveStep(stepForIssue(validationResult.error.issues[0]));
    notifications.show({
      title: "Validation Error",
      message: validationMessage,
      color: "orange",
      autoClose: 5000,
    });

    return false;
  };

  useEffect(() => {
    if (!companyId) {
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
      return;
    }

    let active = true;
    setIsLoading(true);

    companyService
      .getCompanyById(companyId)
      .then((data) => {
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
  }, [companyId]);

  const updateSection = <K extends keyof Omit<CompanyFullDetails, "companyId">>(
    section: K,
    value: CompanyFullDetails[K]
  ) => {
    setDraftCompany((prev) => {
      const current: CompanyFullDetails = prev
        ? prev
        : {
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
      return {
        ...current,
        [section]: value,
      } as CompanyFullDetails;
    });
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <EditBasicInformation
            key={`basic-${companyId ?? "new"}-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            onChange={(summary) => updateSection("summary", summary)}
          />
        );
      case 2:
        return (
          <EditBusinessAddress
            key={`address-${companyId ?? "new"}-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            onChange={(address) => updateSection("address", address)}
          />
        );
      case 3:
        return (
          <EditKeyContacts
            key={`contacts-${companyId ?? "new"}-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            onChange={(keyContacts) => updateSection("keyContacts", keyContacts)}
          />
        );
      case 4:
        return (
          <EditGovernment
            key={`government-${companyId ?? "new"}-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            onChange={(governmentCompliance) => updateSection("governmentCompliance", governmentCompliance)}
          />
        );
      case 5:
        return (
          <EditCommercial
            key={`commercial-${companyId ?? "new"}-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            onChange={(commercialInformation) => updateSection("commercialInformation", commercialInformation)}
          />
        );
      case 6:
        return (
          <EditOperationalInstructions
            key={`operational-${companyId ?? "new"}-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            onChange={(operationalInstructions) => updateSection("operationalInstructions", operationalInstructions)}
          />
        );
      case 7:
        return (
          <EditRiskIssue
            key={`risk-${companyId ?? "new"}-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            onChange={(riskIssueMonitoring) => updateSection("riskIssueMonitoring", riskIssueMonitoring)}
          />
        );
      case 8:
        return (
          <EditDocuments
            key={`documents-${companyId ?? "new"}-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            onChange={(documentsAttachments) => updateSection("documentsAttachments", documentsAttachments)}
          />
        );
      case 9:
        return (
          <EditStrategicInsight
            key={`strategic-${companyId ?? "new"}-${draftCompany?.summary?.companyName ?? ""}`}
            company={draftCompany}
            onChange={(strategicInsight) => updateSection("strategicInsight", strategicInsight)}
          />
        );
      default:
        return null;
    }
  };

  const title = isEditMode ? "EDIT COMPANY" : "ADD COMPANY";
  const subtitle = isEditMode ? "Update the selected company profile" : "Fill out company details and classification";
  const actionLabel = isEditMode ? "Update" : activeStep === steps.length ? "Finish" : "Next";

  const handleSaveCompany = async () => {
    if (!draftCompany) {
      notifications.show({
        title: "Error",
        message: "Company details are not ready yet.",
        color: "red",
      });
      return;
    }

    if (!validateDraftCompany(draftCompany)) {
      return;
    }

    try {
      setIsSaving(true);

      if (isEditMode && companyId) {
        // Update existing company
        const updatePayload: CompanyUpdateRequest = {
          ...draftCompany,
        };

        await companyService.updateCompany(companyId, updatePayload);

        notifications.show({
          title: "Success",
          message: "Company updated successfully",
          color: "green",
          autoClose: 3000,
        });

        // Redirect back to company list
        navigate("/accounts/companies", { replace: true });
      } else {
        // Create new company
        const createPayload: CompanyCreateRequest = {
          ...draftCompany,
        };

        await companyService.createCompany(createPayload);

        notifications.show({
          title: "Success",
          message: "Company created successfully",
          color: "green",
          autoClose: 3000,
        });

        // Redirect back to company list
        navigate("/accounts/companies", { replace: true });
      }
    } catch (error) {
      console.error("Failed to save company:", error);
      notifications.show({
        title: "Error",
        message: "Failed to save company. Please try again.",
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrimaryAction = () => {
    if (isEditMode) {
      // In edit mode, always save/update regardless of step
      handleSaveCompany();
      return;
    }

    // In add mode, validate the summary before moving past the first step.
    if (activeStep < steps.length) {
      if (activeStep === 1 && draftCompany) {
        const summaryValidation = companySummarySchema.safeParse(draftCompany.summary);
        if (!summaryValidation.success) {
          notifications.show({
            title: "Validation Required",
            message: "Company Name is required before continuing.",
            color: "orange",
            autoClose: 5000,
          });
          return;
        }
      }
      setActiveStep((s) => s + 1);
      return;
    }

    // On last step in add mode, save and create
    if (activeStep === steps.length) {
      handleSaveCompany();
    }
  };

  return (
    <PageCard
      title={title}
      subtitle={subtitle}
      bgColor="transparent"
      shadow={false}
    >
      <Paper p="lg" style={{ marginTop: "-1rem" }}>
        {/* Stepper inside Paper */}
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
            const isActive = index + 1 <= activeStep; // circle is active if <= current step
            const isLineActive = index + 1 < activeStep; // line is active if before current step

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
                {/* Circle number */}
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
                <Text c="white" size="sm">{index + 1}</Text>

                {/* Connector line */}
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

                {/* Label below circle */}
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
        {isEditMode && isLoading ? (
          <Box style={{ padding: "2rem", textAlign: "center" }}>
            <Text>Loading company details...</Text>
          </Box>
        ) : (
          renderStep()
        )}

        {/* Navigation buttons */}
        <Group justify="space-between" mt="md">
          {activeStep !== 1 && (
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
          )}

          <Button
            color="#4E6174"
            size="md"
            radius="md"
            style={{ minWidth: 160, marginLeft: activeStep === 1 ? "auto" : "0" }}
            onClick={handlePrimaryAction}
            loading={isSaving}
            disabled={isSaving}
          >
            <Group gap="sm" justify="center">
              <span>{actionLabel}</span>
              <ArrowRightAlt width={20} height={20} />
            </Group>
          </Button>
        </Group>
      </Paper>
    </PageCard>
  );
}
