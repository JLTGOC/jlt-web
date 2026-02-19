// ============================================
// Role Types
// ============================================

import type { Role } from "@/types/roles";

// ============================================
// Backend API Types
// ============================================

export interface UserResource {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string | null;
  role: Role;
  email: string;
  address: string;
  contact_number: string;
  company_name: string;
  image_path: string | null;
  created_at: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
}

// ============================================
// Frontend Domain Types
// For frontend use
// ============================================

/**
 * User - Frontend domain model
 */
export interface User {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  fullName: string;
  role: Role;
  email: string;
  address: string;
  contactNumber: string;
  companyName: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Article Types
// ============================================

export interface ArticleResource {
  id: number;
  user: string;
  title: string;
  image_url: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface StoreArticleRequest {
  title: string; // max 255 chars
  content: string;
  image: string; // base64 or file
}

export interface UpdateArticleRequest {
  title?: string; // max 255 chars
  content?: string;
  image?: string;
}

// ============================================
// Reel Types
// ============================================

export interface ReelResource {
  id: number;
  video_path: string;
  view_count: number | string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Quotation Types
// ============================================

export interface QuotationResource {
  id: number;
  company: {
    name: string;
    address: string;
    contact_person: string;
    contact_number: string;
    email: string;
  };
  service: {
    type: "IMPORT" | "EXPORT" | "BUSINESS SOLUTION";
    transport_mode: "SEA" | "AIR";
    options: string[];
  };
  commodity: {
    commodity: string;
    cargo_type: "CONTAINERIZED" | "LCL";
    cargo_volume?: number;
    container_size?: string;
  };
  shipment: {
    origin: string;
    destination: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StoreQuotationRequest {
  company: {
    name: string;
    address: string;
    contact_person: string;
    contact_number: string; // Must match pattern: ^09\d{9}$
    email: string;
  };
  service: {
    type: "IMPORT" | "EXPORT" | "BUSINESS SOLUTION";
    transport_mode: "SEA" | "AIR";
    options: string[];
  };
  commodity: {
    commodity: string;
    cargo_type: "CONTAINERIZED" | "LCL";
    cargo_volume?: number;
    container_size?: string;
  };
  shipment: {
    origin: string;
    destination: string;
  };
}

export interface UpdateQuotationRequest {
  company?: {
    name?: string;
    address?: string;
    contact_person?: string;
    contact_number?: string;
    email?: string;
  };
  service?: {
    type?: "IMPORT" | "EXPORT" | "BUSINESS SOLUTION";
    transport_mode?: "SEA" | "AIR";
    options?: string[];
  };
  commodity?: {
    commodity?: string;
    cargo_type?: "CONTAINERIZED" | "LCL";
    cargo_volume?: number;
    container_size?: string;
  };
  shipment?: {
    origin?: string;
    destination?: string;
  };
}

// ============================================
// API Response Wrappers
// ============================================

/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
  message: string;
  data: T;
  code: number;
  error: boolean;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  message: string;
  data: {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
  code: number;
  error: boolean;
}

// ============================================
// Error Response Types
// ============================================

export interface ValidationError {
  message: string; // "The given data was invalid"
  errors: {
    [field: string]: string[]; // Field-specific error messages
  };
}

export interface AuthenticationError {
  message: string; // "Unauthenticated"
}

export interface NotFoundError {
  message: string; // "Model not found"
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string; // "Logged in successfully"
  data: {
    user: UserResource;
    token: string;
  };
  code: number; // 200
  error: boolean; // false
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardResponse {
  message: string;
  data: {
    user: UserResource;
    queries?: {
      new: number;
      assigned: number;
      qualified: number;
      unqualified: number;
    };
    accounts?: {
      partners: number;
      account_specialists: number;
    };
    job_orders?: {
      closed_deals: number;
      jo_created: number;
    };
  };
  code: number;
  error: boolean;
}

// ============================================
// Utility Types
// ============================================

export type MessageBag = {
  [key: string]: string[];
};

/**
 * Helper type for nullable fields
 */
export type Nullable<T> = T | null;

/**
 * Helper type for optional fields in updates
 */
export type PartialUpdate<T> = {
  [P in keyof T]?: T[P];
};
