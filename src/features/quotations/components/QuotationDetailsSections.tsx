import { Accordion, Button, Box } from "@mantine/core";
import { useState } from "react";
import { DetailGrid } from "@/components/DetailGrid";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";
import { buildQuotationDetailsRows } from "@/features/quotations/utils/quotationDetailsRows";
import classes from "./QuotationDetailsSections.module.css";

import { Box as BoxIcon, Folder, History, InboxTextPerson, Download } from "@nine-thirty-five/material-symbols-react/outlined";
import docJLTCBIcon from "@/assets/icons/docJLTCB.svg";
import docClientIcon from "@/assets/icons/docClient.svg";

import { PdfThumbnail } from "@/components/PdfThumbnail";
import { useNavigate } from "react-router";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import { getQuotationFileDownloadUrl } from "@/features/quotations/api/quotationFiles.api";
import documentsStyles from "@/features/shipments/components/details/Documents.module.css";

interface QuotationDetailsSectionsProps {
  quotation: QuotationResource;
  routeParams: { tab: string; quotationId: string };
  clientId?: string;
}

export function QuotationDetailsSections({
  quotation,
  routeParams,
  clientId,
}: QuotationDetailsSectionsProps) {
  const rows = buildQuotationDetailsRows(quotation);
  const [opened, setOpened] = useState<string[]>([]);
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);
  const navigate = useNavigate();

  const quotationDocuments =
    Array.isArray(quotation.documents) ? quotation.documents : [];
  const quotationFiles =
    Array.isArray(quotation.quotation_file) ? quotation.quotation_file : [];

  const jltcbDocs = [
    ...quotationFiles,
    ...quotationDocuments.filter((doc) => doc.uploadedBy === "JLTCB"),
  ];
  const clientDocs = quotationDocuments.filter((doc) => doc.uploadedBy === "Client");

  return (
    <Accordion
      chevronPosition="right"
      variant="contained"
      multiple
      value={opened}
      onChange={setOpened}
    >
        {/* Consignee */}
        <Accordion.Item value="consignee" className={classes.accordionItem}>
          <Accordion.Control className={classes.sectionHeader}>
            <span className={classes.sectionHeaderContent}>
              <InboxTextPerson width="1.5rem" height="1.5rem" />
              Consignee Details
            </span>
          </Accordion.Control>
          <Accordion.Panel className={classes.accordionPanel} p={0} mt="0.5rem">
            <DetailGrid rows={rows.consignee}/>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="shipment" className={classes.accordionItem}>
          <Accordion.Control className={classes.sectionHeader}>
            <span className={classes.sectionHeaderContent}>
              <BoxIcon
                width="1.5rem"
                height="1.5rem"
                style={{ color: "#1D274E" }}
              />
              Shipment Details
            </span>
          </Accordion.Control>
          <Accordion.Panel className={classes.accordionPanel} p={0} mt="0.5rem">
            <DetailGrid rows={rows.shipment} />
          </Accordion.Panel>
        </Accordion.Item>
        
        {/* Documents */}
        <Accordion.Item value="documents" className={classes.accordionItem}>
          <Accordion.Control className={classes.sectionHeader}>
            <span className={classes.sectionHeaderContent}>
              <Folder
                width="1.5rem"
                height="1.5rem"
                style={{ color: "#1D274E" }}
              />
              Documents
            </span>
          </Accordion.Control>
          <Accordion.Panel className={classes.accordionPanel} p={0} mt="0.5rem">
            {/* Two-column layout */}
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {/* JLTCB documents */}
              <div style={{ flex: 1, marginTop: "0.25rem", paddingRight: "1.5rem", borderRight: "2px solid #c3c3c3" }}>
                <h4 style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                  <img src={docJLTCBIcon} alt="JLTCB Icon" className={classes.sectionHeaderIcon} />
                  <span style={{ marginLeft: "0.4rem", fontWeight: "400" }}>DOCUMENTS UPLOADED BY JLTCB</span>
                </h4>
                {jltcbDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className={documentsStyles.documentCard}
                    onClick={() => {
                      if (doc.file_url) {
                        window.open(doc.file_url, '_blank');
                      }
                    }}
                    style={{ border: "1px solid #ddd", borderRadius: "0.5rem", padding: "0.35rem 0.5rem", marginBottom: "0.4rem", backgroundColor: "#fff", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", minHeight: 90 }}
                  >
                    <Box style={{ width: 60, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PdfThumbnail url={getQuotationFileDownloadUrl(doc.id)} />
                    </Box>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{doc.file_name}</div>
                      <div style={{ color: "#888", fontSize: "0.75rem" }}>{doc.uploadedDate}</div>
                      <div style={{ color: "#888", fontSize: "0.75rem" }}>Uploaded by: {doc.uploadedBy ?? "Unknown"}</div>
                    </div>
                    <Button
                      p={0}
                      style={{ backgroundColor: "#4E6174", borderRadius: "20%", width: 28, height: 28, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (doc.file_url) {
                          const link = document.createElement('a');
                          link.href = doc.file_url;
                          link.download = doc.file_name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                    >
                      <Download width="1.1rem" height="1.1rem" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Client documents */}
              <div style={{ flex: 1, marginTop: "0.25rem" }}>
                <h4 style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                  <img src={docClientIcon} alt="Client Icon" className={classes.sectionHeaderIcon} />
                  <span style={{ marginLeft: "0.4rem", fontWeight: "400" }}>DOCUMENTS UPLOADED BY CLIENT</span>
                </h4>
                {clientDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className={documentsStyles.documentCard}
                    onClick={() => {
                      if (doc.file_url) {
                        window.open(doc.file_url, '_blank');
                      }
                    }}
                    style={{ border: "1px solid #ddd", borderRadius: "0.5rem", padding: "0.35rem 0.5rem", marginBottom: "0.4rem", backgroundColor: "#fff", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", minHeight: 90 }}
                  >
                    <Box style={{ width: 60, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PdfThumbnail url={getQuotationFileDownloadUrl(doc.id)} />
                    </Box>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{doc.file_name}</div>
                      <div style={{ color: "#888", fontSize: "0.75rem" }}>{doc.uploadedDate}</div>
                      <div style={{ color: "#888", fontSize: "0.75rem" }}>Uploaded by: {doc.uploadedBy ?? "Unknown"}</div>
                    </div>
                    <Button
                      p={0}
                      style={{ backgroundColor: "#4E6174", borderRadius: "20%", width: 28, height: 28, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (doc.file_url) {
                          const link = document.createElement('a');
                          link.href = doc.file_url;
                          link.download = doc.file_name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                    >
                      <Download width="1.1rem" height="1.1rem" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

          </Accordion.Panel>
          {opened.includes("documents") && (
            <Button
              fullWidth
              mt={0}
              mb={0}
              ml={0}
              mr={0}
              style={{
                backgroundColor: isViewAllHovered ? "#E8E8E8" : "transparent",
                borderTop: "2px solid #A3A3A3",
                borderRadius: 0,
                color: isViewAllHovered ? "var(--mantine-color-jltBlue-8)" : "#4E6174",
                textTransform: "uppercase",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={() => setIsViewAllHovered(true)}
              onMouseLeave={() => setIsViewAllHovered(false)}
              onClick={() =>
                navigate(
                  quotationRoutes.documents({
                    tab: routeParams.tab,
                    clientId,
                    quotationId: routeParams.quotationId,
                  }),
                )
              }
            >
              VIEW ALL DOCUMENTS
            </Button>
          )}
        </Accordion.Item>

        <Accordion.Item value="history" className={classes.accordionItem}>
          <Accordion.Control className={classes.sectionHeader}>
            <span className={classes.sectionHeaderContent}>
              <History width="1.5rem" height="1.5rem" />
              History
            </span>
          </Accordion.Control>
          <Accordion.Panel className={classes.accordionPanel} p={0} mt="0.5rem">
            {/* Column headers */}
            <div
              style={{
                display: "flex",
                fontWeight: 700,
                marginBottom: "0.5rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid #ccc",
              }}
            >
              <div style={{ flex: 2, paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>Date & Time</div>
              <div style={{ flex: 3, paddingRight: "0.5rem" }}>Action</div>
              <div style={{ flex: 2 }}>By</div>
            </div>

            {/* Timeline container */}
            <div style={{ borderLeft: "2px solid green", paddingLeft: "0.5rem", position: "relative" }}>
              {(() => {
                const historyEvents = [];
                
                // Format date and time helper
                const formatDateTime = (dateString: string | null) => {
                  if (!dateString) return { date: "", time: "" };
                  try {
                    const date = new Date(dateString);
                    const mm = String(date.getMonth() + 1).padStart(2, "0");
                    const dd = String(date.getDate()).padStart(2, "0");
                    const yyyy = date.getFullYear();
                    const hours = date.getHours();
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                    const ampm = hours >= 12 ? "PM" : "AM";
                    const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
                    return {
                      date: `${mm}-${dd}-${yyyy}`,
                      time: `${formattedHour}:${minutes} ${ampm}`,
                    };
                  } catch {
                    return { date: "", time: "" };
                  }
                };

                // Add Requested event
                if (quotation.qtn_created_at) {
                  const { date, time } = formatDateTime(quotation.qtn_created_at);
                  historyEvents.push({
                    date,
                    time,
                    action: "Quotation Requested",
                    by: quotation.account_specialist ?? quotation.person_in_charge ?? "System",
                  });
                }

                // Add Responded event
                if (quotation.qtn_status === "responded" && quotation.updated_at) {
                  const { date, time } = formatDateTime(quotation.updated_at);
                  historyEvents.push({
                    date,
                    time,
                    action: "Quotation Responded",
                    by: quotation.account_specialist ?? quotation.person_in_charge ?? "System",
                  });
                }

                // Add Accepted event
                if (quotation.qtn_status === "accepted" && quotation.qtn_accepted_at) {
                  const { date, time } = formatDateTime(quotation.qtn_accepted_at);
                  historyEvents.push({
                    date,
                    time,
                    action: "Quotation Accepted",
                    by: quotation.client?.full_name ?? "Client",
                  });
                }

                return historyEvents.map((event, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      position: "relative",
                    }}
                  >
                    {/* Circle marker */}
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        border: "2px solid green",
                        position: "absolute",
                        left: "-15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />

                    {/* Columns */}
                    <div style={{ flex: 2, paddingRight: "0.5rem", display: "flex", gap: "0.75rem" }}>
                      <span>{event.date}</span>
                      <span style={{ minWidth: "80px" }}>{event.time}</span>
                    </div>
                    <div style={{ flex: 3, paddingRight: "0.5rem" }}>{event.action}</div>
                    <div style={{ flex: 2 }}>{event.by}</div>
                  </div>
                ));
              })()}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
  }

