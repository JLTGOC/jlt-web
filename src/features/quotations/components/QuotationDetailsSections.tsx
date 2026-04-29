import { Accordion, Button } from "@mantine/core";
import { useState } from "react";
import { DetailGrid } from "@/components/DetailGrid";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";
import { buildQuotationDetailsRows } from "@/features/quotations/utils/quotationDetailsRows";
import classes from "./QuotationDetailsSections.module.css";

import consigneeIcon from "@/assets/icons/consignee.svg";
import shipmentIcon from "@/assets/icons/shipment.svg";
import documentsIcon from "@/assets/icons/documents.svg";
import historyIcon from "@/assets/icons/history.svg";
import downloadIcon from "@/assets/icons/download.svg";
import docJLTCBIcon from "@/assets/icons/docJLTCB.svg";
import docClientIcon from "@/assets/icons/docClient.svg";

import { PdfThumbnail } from "../pdf/PdfThumbnail";
import { useNavigate } from "react-router";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import { getQuotationFileDownloadUrl } from "@/features/quotations/api/quotationFiles.api";

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
  const navigate = useNavigate();

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
              <img src={consigneeIcon} alt="Consignee Icon" className={classes.sectionHeaderIcon} />
              Consignee Details
            </span>
          </Accordion.Control>
          <Accordion.Panel className={classes.accordionPanel}>
            <DetailGrid rows={rows.consignee} />
          </Accordion.Panel>
        </Accordion.Item>

        {/* Shipment */}
        <Accordion.Item value="shipment" className={classes.accordionItem}>
          <Accordion.Control className={classes.sectionHeader}>
            <span className={classes.sectionHeaderContent}>
              <img src={shipmentIcon} alt="Shipment Icon" className={classes.sectionHeaderIcon} />
              Shipment Details
            </span>
          </Accordion.Control>
          <Accordion.Panel className={classes.accordionPanel}>
            <DetailGrid rows={rows.shipment} />
          </Accordion.Panel>
        </Accordion.Item>

        {/* Documents */}
        <Accordion.Item value="documents" className={classes.accordionItem}>
          <Accordion.Control className={classes.sectionHeader}>
            <span className={classes.sectionHeaderContent}>
              <img src={documentsIcon} alt="Documents Icon" className={classes.sectionHeaderIcon} />
              Documents
            </span>
          </Accordion.Control>
          <Accordion.Panel className={classes.accordionPanel}>
            {/* Two-column layout */}
            <div style={{ display: "flex", gap: "2rem" }}>
              {/* JLTCB documents */}
              <div style={{ flex: 1, marginTop: "0.5rem", paddingRight: "2rem", borderRight: "2px solid #c3c3c3" }}>
                <h4 style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                  <img src={docJLTCBIcon} alt="JLTCB Icon" className={classes.sectionHeaderIcon} />
                  <span style={{ marginLeft: "0.4rem" }}>Documents uploaded by JLTCB</span>
                </h4>
                {quotation.documents !== "No documents available." &&
                  quotation.documents
                    .filter((doc) => doc.uploadedBy === "JLTCB")
                    .map((doc) => (
                      <div key={doc.id} style={{ border: "1px solid #ddd", borderRadius: "0.5rem", padding: "0.75rem", marginBottom: "0.75rem", backgroundColor: "#fff", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                        <PdfThumbnail fileUrl={getQuotationFileDownloadUrl(doc.id)} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{doc.file_name}</div>
                          <div style={{ color: "#888", fontSize: "0.85rem" }}>{doc.uploadedDate}</div>
                          <div style={{ color: "#888", fontSize: "0.85rem" }}>Uploaded by: {doc.uploadedBy}</div>
                        </div>
                        <Button component="a" href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#4E6174", borderRadius: "20%", width: 32, height: 32, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={downloadIcon} alt="Download" style={{ width: 16, height: 16 }} />
                        </Button>
                      </div>
                    ))}
              </div>

              {/* Client documents */}
              <div style={{ flex: 1, marginTop: "0.5rem" }}>
                <h4 style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                  <img src={docClientIcon} alt="Client Icon" className={classes.sectionHeaderIcon} />
                  <span style={{ marginLeft: "0.4rem" }}>Documents uploaded by Client</span>
                </h4>
                {quotation.documents !== "No documents available." &&
                  quotation.documents
                    .filter((doc) => doc.uploadedBy === "Client")
                    .map((doc) => (
                      <div key={doc.id} style={{ border: "1px solid #ddd", borderRadius: "0.5rem", padding: "0.75rem", marginBottom: "0.75rem", backgroundColor: "#fff", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                        <PdfThumbnail fileUrl={getQuotationFileDownloadUrl(doc.id)} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{doc.file_name}</div>
                          <div style={{ color: "#888", fontSize: "0.85rem" }}>{doc.uploadedDate}</div>
                          <div style={{ color: "#888", fontSize: "0.85rem" }}>Uploaded by: {doc.uploadedBy}</div>
                        </div>
                        <Button component="a" href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#4E6174", borderRadius: "20%", width: 32, height: 32, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={downloadIcon} alt="Download" style={{ width: 16, height: 16 }} />
                        </Button>
                      </div>
                    ))}
              </div>
            </div>

            {/* View All Documents button */}
            <Button
              fullWidth
              mt="md"
              bg="#4E6174"
              c="white"
              style={{ textTransform: "uppercase", fontWeight: 500 }}
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
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="history" className={classes.accordionItem}>
          <Accordion.Control className={classes.sectionHeader}>
            <span className={classes.sectionHeaderContent}>
              <img src={historyIcon} alt="History Icon" className={classes.sectionHeaderIcon} />
              History
            </span>
          </Accordion.Control>
          <Accordion.Panel className={classes.accordionPanel}>
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
              <div style={{ flex: 2, paddingLeft: "1rem", paddingRight: "1rem" }}>Date & Time</div>
              <div style={{ flex: 3, paddingRight: "1rem" }}>Action</div>
              <div style={{ flex: 2 }}>By</div>
            </div>

            {/* Timeline container */}
            <div style={{ borderLeft: "2px solid black", paddingLeft: "1rem", position: "relative" }}>
              {rows.history.map((h, idx) => {
                const labelStr = String(h?.label ?? "");
                const valueStr = String(h?.value ?? "");

                const [datePart, timePartRaw] = labelStr.split(" ");
                let formattedTime = "";
                if (timePartRaw) {
                  const [hourStr, minute = "00"] = timePartRaw.split(":");
                  const hourNum = parseInt(hourStr, 10);
                  if (!isNaN(hourNum)) {
                    const ampm = hourNum >= 12 ? "PM" : "AM";
                    const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
                    formattedTime = `${formattedHour}:${minute} ${ampm}`;
                  }
                }

                let action = valueStr;
                let by = "";
                if (valueStr.includes(" by ")) {
                  const [a, b] = valueStr.split(" by ");
                  action = a;
                  by = b;
                } else if (valueStr.includes("Assigned to")) {
                  const match = valueStr.match(/Assigned to\s+(.+)/);
                  if (match) {
                    action = "Assigned to";
                    by = match[1];
                  }
                }

                return (
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
                        left: "-24px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />

                    {/* Columns */}
                    <div style={{ flex: 2, paddingRight: "1rem", display: "flex", gap: "1rem" }}>
                      <span>{datePart}</span>
                      {/* fixed width so times align uniformly */}
                      <span style={{ minWidth: "80px" }}>{formattedTime}</span>
                    </div>
                    <div style={{ flex: 3, paddingRight: "1rem" }}>{action}</div>
                    <div style={{ flex: 2 }}>{by}</div>
                  </div>
                );
              })}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
  }

