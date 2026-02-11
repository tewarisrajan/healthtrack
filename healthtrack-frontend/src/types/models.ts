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
  type: string;
  createdAt: string;          // ISO string
  providerName: string;       // hospital / lab / doctor name
  tags?: string[];
  fileUrl?: string | null;    // URL to the file
  fileHash?: string | null;   // SHA-256 fingerprint
  blockchainVerified?: boolean;
}

// 🔹 This is the one causing the error if missing
export interface EmergencyProfile {
  publicId?: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  emergencyContacts: {
    name: string;
    relation: string;
    phone: string;
  }[];
  visibility: {
    bloodGroup: boolean;
    allergies: boolean;
    chronicConditions: boolean;
    medications: boolean;
    emergencyContacts: boolean;
  };
}

// Consent requests from hospitals / doctors / insurers
// Consent requests to accessing patient records
export interface ConsentRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt?: string;
}

// Family members managed in the app
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  hasEmergencyProfile: boolean;
}
