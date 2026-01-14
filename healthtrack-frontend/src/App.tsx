import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AppLayout from "./components/layout/AppLayout";
import PageTransition from "./components/layout/PageTransition";
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
  const location = useLocation();

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
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <DashboardPage />
              </PageTransition>
            }
          />
          <Route
            path="/records"
            element={
              <PageTransition>
                <RecordsPage />
              </PageTransition>
            }
          />
          <Route
            path="/records/upload"
            element={
              <PageTransition>
                <UploadRecordPage />
              </PageTransition>
            }
          />
          <Route
            path="/records/:id"
            element={
              <PageTransition>
                <RecordDetailsPage />
              </PageTransition>
            }
          />
          <Route
            path="/emergency"
            element={
              <PageTransition>
                <EmergencyPage />
              </PageTransition>
            }
          />
          <Route
            path="/consent"
            element={
              <PageTransition>
                <ConsentPage />
              </PageTransition>
            }
          />
          <Route
            path="/family"
            element={
              <PageTransition>
                <FamilyPage />
              </PageTransition>
            }
          />
          <Route
            path="/settings"
            element={
              <PageTransition>
                <SettingsPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
}

export default App;
