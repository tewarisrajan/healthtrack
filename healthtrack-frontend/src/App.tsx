// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./routes/DashboardPage";
import RecordsPage from "./routes/RecordsPage";
import RecordDetailsPage from "./routes/RecordDetailsPage";
import UploadRecordPage from "./routes/UploadRecordPage";
import EmergencyPage from "./routes/EmergencyPage";
import ConsentPage from "./routes/ConsentPage";
import FamilyPage from "./routes/FamilyPage";
import SettingsPage from "./routes/SettingsPage";
import LoginPage from "./routes/LoginPage";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  // While we check localStorage, show a small loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
        <div className="text-sm">Loading your session…</div>
      </div>
    );
  }

  // If no user, show login screen (no sidebar/topbar)
  if (!user) {
    return <LoginPage />;
  }

  // Authenticated view
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/records/upload" element={<UploadRecordPage />} />
        <Route path="/records/:id" element={<RecordDetailsPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/consent" element={<ConsentPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
