// src/types/models.ts

// Types of health records we support
export type RecordType =
  | "PRESCRIPTION"
  | "LAB_REPORT"
  | "SCAN"
  | "CERTIFICATE"
  | "VACCINATION";

// A single health record in the vault
export interface HealthRecord {
  id: string;
  title: string;
  type: RecordType;
  createdAt: string;          // ISO string
  providerName: string;       // hospital / lab / doctor name
  tags?: string[];
  fileUrl?: string;           // URL to the file (for now local blob URL)
  blockchainVerified?: boolean;
}

// 🔹 This is the one causing the error if missing
export interface EmergencyProfile {
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  emergencyContacts: {
    name: string;
    relation: string;
    phone: string;
  }[];
}

// Consent requests from hospitals / doctors / insurers
export interface ConsentRequest {
  id: string;
  requesterType: "DOCTOR" | "HOSPITAL" | "INSURER";
  requesterName: string;
  purpose: string;
  requestedRecords: "ALL" | "LAST_6_MONTHS" | "SPECIFIC";
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
}

// Family members managed in the app
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  hasEmergencyProfile: boolean;
}
