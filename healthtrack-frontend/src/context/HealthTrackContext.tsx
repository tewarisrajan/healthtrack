// src/context/HealthTrackContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type {
  HealthRecord,
  EmergencyProfile,
  ConsentRequest,
  FamilyMember,
  RecordType,
} from "../types/models";
import { useAuth } from "./AuthContext";

interface NewRecordInput {
  title: string;
  type: RecordType;
  providerName: string;
  tags?: string[];
  fileUrl?: string | null;
  blockchainVerified?: boolean;
}

interface HealthTrackContextValue {
  records: HealthRecord[];
  recordsLoading: boolean;
  emergencyProfile: EmergencyProfile | null;
  consentRequests: ConsentRequest[];
  family: FamilyMember[];
  addRecord: (input: NewRecordInput) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  updateEmergencyProfile: (profile: EmergencyProfile) => void;
}

const HealthTrackContext = createContext<
  HealthTrackContextValue | undefined
>(undefined);

export const HealthTrackProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const [emergencyProfile, setEmergencyProfile] =
    useState<EmergencyProfile | null>({
      bloodGroup: "B+",
      allergies: ["Penicillin"],
      chronicConditions: ["Asthma"],
      medications: ["Inhaler (Salbutamol) PRN"],
      emergencyContacts: [
        { name: "Mother", relation: "Parent", phone: "+91-98XXXXXX01" },
      ],
    });

  const [consentRequests] = useState<ConsentRequest[]>([
    {
      id: "c1",
      requesterType: "HOSPITAL",
      requesterName: "City Care Hospital",
      purpose: "Pre-surgery evaluation",
      requestedRecords: "LAST_6_MONTHS",
      createdAt: new Date().toISOString(),
      status: "PENDING",
    },
  ]);

  const [family] = useState<FamilyMember[]>([
    { id: "f1", name: "Dad", relation: "Father", age: 52, hasEmergencyProfile: true },
    { id: "f2", name: "Mom", relation: "Mother", age: 49, hasEmergencyProfile: false },
  ]);

  // ─────────────────────────────────
  // Load records from backend when user changes
  // ─────────────────────────────────
  useEffect(() => {
    if (!user) {
      setRecords([]);
      return;
    }

    const fetchRecords = async () => {
      setRecordsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/api/users/${user.id}/records`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : undefined,
          }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          setRecords(data.data || []);
        } else {
          console.error("Failed to load records", data);
        }
      } catch (err) {
        console.error("Error loading records", err);
      } finally {
        setRecordsLoading(false);
      }
    };

    fetchRecords();
  }, [user, token]);

  // ─────────────────────────────────
  // Add record via backend
  // ─────────────────────────────────
  const addRecord = async (input: NewRecordInput) => {
    if (!user) {
      throw new Error("Not logged in");
    }

    const res = await fetch(
      `http://localhost:4000/api/users/${user.id}/records`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(input),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data?.message || "Failed to add record");
    }

    const created: HealthRecord = data.data;
    setRecords((prev) => [created, ...prev]);
  };

  // ─────────────────────────────────
  // Delete record via backend
  // ─────────────────────────────────
  const deleteRecord = async (id: string) => {
    if (!user) {
      throw new Error("Not logged in");
    }

    const res = await fetch(
      `http://localhost:4000/api/users/${user.id}/records/${id}`,
      {
        method: "DELETE",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data?.message || "Failed to delete record");
    }

    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const updateEmergencyProfile = (profile: EmergencyProfile) => {
    setEmergencyProfile(profile);
  };

  return (
    <HealthTrackContext.Provider
      value={{
        records,
        recordsLoading,
        emergencyProfile,
        consentRequests,
        family,
        addRecord,
        deleteRecord,
        updateEmergencyProfile,
      }}
    >
      {children}
    </HealthTrackContext.Provider>
  );
};

export const useHealthTrack = () => {
  const ctx = useContext(HealthTrackContext);
  if (!ctx) throw new Error("useHealthTrack must be used within HealthTrackProvider");
  return ctx;
};
