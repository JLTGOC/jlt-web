import {
  LinkedServices,
  Chat,
  RequestQuote,
  CalendarClock
} from "@nine-thirty-five/material-symbols-react/outlined";
import type { ComponentType } from "react";
import type { Role } from "@/types/roles";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToolItem {
  id: string;
  icon: ComponentType<{ width?: string | number; height?: string | number }>;
  label: string;
  description: string;
  path: string;
  allowedRoles?: Role[]; // Future-proofing for role restrictions
}

// ─── Configuration ────────────────────────────────────────────────────────────

export const TOOL_ITEMS: ToolItem[] = [
  {
    id: "services",
    icon: LinkedServices,
    label: "List of Services",
    description: "View and manage the complete list of services offered.",
    path: "/tools/services",
  },
  {
    id: "message-template",
    icon: Chat,
    label: "Message Template",
    description: "Create, edit and manage your message templates for the quotation.",
    path: "/tools/messages",
  },
  {
    id: "quotation-templates",
    icon: RequestQuote,
    label: "Quotation Templates",
    description: "Create, edit and manage your quotation templates.",
    path: "/tools/templates",
  },
  {
    id: "planning-timeline",
    icon: CalendarClock,
    label: "Planning and Timeline Content",
    description: "Create, edit and manage your planning templates.",
    path: "/tools/planningTimeline",
  },
];
