// ============================================
// Account Status Types
// ============================================

export type AccountLifecycleStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type AccountStatus =
  | { state: "ACTIVE" } // currently online
  | { state: "OFFLINE"; lastSeen: Date }; // offline, show minutes/hours ago

// ============================================
// Client Dashboard Stats (for dashboard view)
// ============================================

export interface ClientDashboardStats {
  totalClients: number;
  newClients: number; // clients added in the last 30 days
  activeShipments: number; // shipments currently active for this account
  activeRegulatory: number; // regulatory cases currently active for this account
  pendingQuotations: number; // quotations awaiting response
}

// ============================================
// Account Dashboard Stats (for dashboard view)
// ============================================

export interface AccountDashboardStats {
  totalEmployees: number; // total number of employees
  activeShipments: number; // shipments currently active for this account
  activeRegulatory: number; // regulatory cases currently active for this account
  pendingQuotations: number; // quotations awaiting response
}

// ============================================
// Account List Types (for table view)
// ============================================

export interface AccountListItem {
  id: number;
  avatarUrl: string | null; // profile image
  name: string;             // full name
  email: string;
  contactNumber: string;

  // For employees (nested for clarity)
  employee?: {
    employeeNumber: string;   // e.g. "EMP-101"
    role: string;             // e.g. "Sales", "Operations"
    isLead: boolean;          // true = lead ON, false = lead OFF
    requestAccepted: number;  // number of requests accepted
    quotationSent: number;    // number of quotations sent
    quotationAccepted: number; // number of quotations accepted
  };

  // For clients (nested for clarity)
  client?: {
    clientName: string;       // e.g. "John Doe"
    companyName: string;      // e.g. "Acme Corp"
    type: "OLD" | "NEW";      // strictly only two options
    pendingQuotations: number; // quotations awaiting response
    activeShipment: number;    // active shipments
    activeRegulatory: number;  // active regulatory cases
  };

  status: AccountStatus;      // online/offline with timestamp
}

// ============================================
// Client Details (full view)
// ============================================

export interface ClientDetails {
  // Header Information
  clientId: number;
  clientName: string;
  position: string;
  contactNumber: string;
  email: string;
  dateCreated: string;       // ISO date string
  companyName: string;
  companyAddress: string;
  businessType: string;

  // Dashboard Metrics
  quotationStats: {
    totalQuotation: number;
    pendingQuotation: number;
    acceptedQuotation: number;
  };

  regulatoryStats: {
    totalRegulatory: number;
    ongoingRegulatory: number;
    completedRegulatory: number;
  };

  shipmentStats: {
    totalShipments: number;
    inProgressShipments: number;
    completedShipments: number;
  };

  // Sub‑Tables
  quotations: ClientQuotation[];
  shipments: ClientShipment[];
  regulatory: ClientRegulatory[];
}

// ============================================
// Client Sub‑Table Types
// ============================================

export interface ClientQuotation {
  quotationNumber: string;
  serviceType: string;
  dateQuoted: string;     // ISO date
  validUntil: string;     // ISO date
  quotedBy: string;
  status: string;         // e.g. "Pending", "Accepted"
  alerts?: string;        // optional alerts message
}

export interface ClientShipment {
  referenceNumber: string;
  blNumber: string;       // Bill of Lading
  serviceType: string;
  transportMode: string;  // e.g. "Air", "Sea"
  origin: string;
  destination: string;
  eta: string;            // ISO date
  etd: string;            // ISO date
  personInCharge: string;
  status: string;         // e.g. "In Progress", "Completed"
}

export interface ClientRegulatory {
  regulatoryNumber: string;
  applicationType: string;
  typeOfApplication: string;
  issueDate: string;      // ISO date
  expiryDate: string;     // ISO date
  personInCharge: string;
  status: string;         // e.g. "Ongoing", "Completed"
}

// ============================================
// Employee Details (full view)
// ============================================

export interface EmployeeDetails {
}
