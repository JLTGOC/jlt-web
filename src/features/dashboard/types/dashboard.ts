import type { ApiResponse } from "@/types/api";
// ============================================
// Base User Info (in all dashboard responses)
// ============================================

interface DashboardUser {
  full_name?: string;
  role?: string;
  company: string;
  image_path: string;
}

// ============================================
// Client Dashboard
// ============================================

export interface ClientDashboardData {
  user: DashboardUser & {
    full_name: string;
  };
  shipments: {
    ongoing_count: number;
    completed_count: number;
  };
  quotations: {
    requested_count: number;
    responded_count: number;
  };
}

// ============================================
// Account Specialist Dashboard
// ============================================

export interface AccountSpecialistDashboardData {
  user: DashboardUser & {
    role: string;
  };
  leads: {
    queries_count: number;
    new_count: number;
    replied_count: number;
  };
  shipments: {
    ongoing_count: number;
    delivered_count: number;
  };
  quotations: {
    new_count: number;
    responded_count: number;
    accepted_count: number;
    discarded_count: number;
  };
  accounts: {
    clients_count: number;
  };
}

// ============================================
// Marketing Dashboard
// ============================================

export interface MarketingDashboardData {
  user: DashboardUser & {
    role: string;
  };
  views_count: string;
  clients_count: string;
  total_videos: string;
  total_articles: string;
}

// ============================================
// Human Resource Dashboard
// ============================================

export interface HumanResourceDashboardData {
  message: string; // "Generic dashboard data"
  // Add specific HR metrics when backend implements them
}

// ============================================
// Union Type for All Dashboard Responses
// ============================================

export type DashboardData =
  | ClientDashboardData
  | AccountSpecialistDashboardData
  | MarketingDashboardData
  | HumanResourceDashboardData;

// ============================================
// API Response
// ============================================

export type DashboardResponse = ApiResponse<DashboardData>;

// ============================================
// Type Guards
// ============================================

export function isClientDashboard(
  data: DashboardData,
): data is ClientDashboardData {
  return (
    "shipments" in data &&
    "quotations" in data &&
    "ongoing_count" in data.shipments &&
    "completed_count" in data.shipments
  );
}

export function isAccountSpecialistDashboard(
  data: DashboardData,
): data is AccountSpecialistDashboardData {
  return "leads" in data && "accounts" in data;
}

export function isMarketingDashboard(
  data: DashboardData,
): data is MarketingDashboardData {
  return (
    "views_count" in data && "total_videos" in data && "total_articles" in data
  );
}

export function isHumanResourceDashboard(
  data: DashboardData,
): data is HumanResourceDashboardData {
  return "message" in data && !("shipments" in data) && !("leads" in data);
}
