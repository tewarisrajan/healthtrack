// src/context/HealthTrackContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
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
  fileHash?: string | null;
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
  uploadFile: (file: File) => Promise<{ fileUrl: string; fileHash: string }>;
  updateEmergencyProfile: (profile: EmergencyProfile) => Promise<void>;
  addFamilyMember: (member: Omit<FamilyMember, "id">) => Promise<void>;
  toggleFamilyEmergency: (id: string) => Promise<void>;
  logRecordAccess: (recordId: string, action?: string) => Promise<void>;
  fetchAuditLogs: (recordId: string) => Promise<any[]>;
}

const HealthTrackContext = createContext<
  HealthTrackContextValue | undefined
>(undefined);

export const HealthTrackProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const [emergencyProfile, setEmergencyProfile] =
    useState<EmergencyProfile | null>(null);

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

  const [family, setFamily] = useState<FamilyMember[]>([]);

  // ─────────────────────────────────
  // Load records and family from backend when user changes
  // ─────────────────────────────────
  useEffect(() => {
    if (!user) {
      setRecords([]);
      setFamily([]);
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

    const fetchFamily = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/users/${user.id}/family`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          setFamily(data.data || []);
        } else {
          console.error("Failed to load family", data);
        }
      } catch (err) {
        console.error("Error loading family", err);
      }
    };

    const fetchEmergency = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/emergency/${user.id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          setEmergencyProfile(data.data);
        }
      } catch (err) {
        console.error("Error loading emergency profile", err);
      }
    };

    fetchRecords();
    fetchFamily();
    fetchEmergency();
  }, [user, token]);

  // ─────────────────────────────────
  // Add record via backend
  // ─────────────────────────────────
  const addRecord = async (input: NewRecordInput) => {
    if (!user) throw new Error("Not logged in");

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
    if (!res.ok || !data.success) throw new Error(data?.message || "Failed to add record");

    setRecords((prev) => [data.data, ...prev]);
  };

  // ─────────────────────────────────
  // Upload file to backend
  // ─────────────────────────────────
  const uploadFile = async (file: File): Promise<{ fileUrl: string; fileHash: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:4000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data?.message || "Upload failed");
    return {
      fileUrl: data.fileUrl,
      fileHash: data.fileHash
    };
  };

  // ─────────────────────────────────
  // Delete record via backend
  // ─────────────────────────────────
  const deleteRecord = async (id: string) => {
    if (!user) throw new Error("Not logged in");

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
    if (!res.ok || !data.success) throw new Error(data?.message || "Failed to delete record");

    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const updateEmergencyProfile = async (profile: EmergencyProfile) => {
    if (!user) throw new Error("Not logged in");

    const res = await fetch(`http://localhost:4000/api/emergency/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(profile),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data?.message || "Failed to update profile");

    setEmergencyProfile(data.data);
  };

  const addFamilyMember = async (member: Omit<FamilyMember, "id">) => {
    if (!user) throw new Error("Not logged in");

    const res = await fetch(`http://localhost:4000/api/users/${user.id}/family`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(member),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data?.message || "Failed to add family member");

    setFamily((prev) => [...prev, data.data]);
  };

  const toggleFamilyEmergency = async (id: string) => {
    if (!user) throw new Error("Not logged in");

    const res = await fetch(`http://localhost:4000/api/users/${user.id}/family/${id}/toggle-emergency`, {
      method: "PATCH",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data?.message || "Failed to toggle emergency");

    setFamily((prev) =>
      prev.map((m) => (m.id === id ? data.data : m))
    );
  };

  const logRecordAccess = async (recordId: string, action: string = "VIEWED") => {
    if (!user) return;
    try {
      await fetch(`http://localhost:4000/api/audit/${recordId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action, username: user.name }),
      });
    } catch (err) {
      console.error("Failed to log access", err);
    }
  };

  const fetchAuditLogs = async (recordId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/audit/${recordId}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
      return [];
    }
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
        uploadFile,
        updateEmergencyProfile,
        addFamilyMember,
        toggleFamilyEmergency,
        logRecordAccess,
        fetchAuditLogs,
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
