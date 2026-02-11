import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AppLayout from "./components/layout/AppLayout";
import PageTransition from "./components/layout/PageTransition";
import RecordsPage from "./routes/RecordsPage";
import RecordDetailsPage from "./routes/RecordDetailsPage";
import UploadRecordPage from "./routes/UploadRecordPage";
import EmergencyPage from "./routes/EmergencyPage";
import ConsentPage from "./routes/ConsentPage";
import FamilyPage from "./routes/FamilyPage";
import SettingsPage from "./routes/SettingsPage";
import LoginPage from "./routes/LoginPage";
import { useAuth } from "./context/AuthContext";
import PublicProfilePage from "./routes/PublicProfilePage";
import DashboardSwitcher from "./routes/DashboardSwitcher";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DoctorPatientView from "./routes/DoctorPatientView";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Handle public routes that don't require authentication
  const isPublicRoute = location.pathname.startsWith("/public/");

  // While we check localStorage, show a small loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
        <div className="text-sm">Loading your session…</div>
      </div>
    );
  }

  // If no user and not a public route, show login screen
  if (!user && !isPublicRoute) {
    return <LoginPage />;
  }

  // Define the routes separately to reuse for public/private
  const routeContent = (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/public/emergency/:publicId" element={<PublicProfilePage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <DashboardSwitcher />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/records"
          element={
            <ProtectedRoute role="PATIENT">
              <PageTransition>
                <RecordsPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/records/upload"
          element={
            <ProtectedRoute role="PATIENT">
              <PageTransition>
                <UploadRecordPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/records/:id"
          element={
            <ProtectedRoute role="PATIENT">
              <PageTransition>
                <RecordDetailsPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency"
          element={
            <ProtectedRoute role="PATIENT">
              <PageTransition>
                <EmergencyPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consent"
          element={
            <ProtectedRoute role="PATIENT">
              <PageTransition>
                <ConsentPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/family"
          element={
            <ProtectedRoute role="PATIENT">
              <PageTransition>
                <FamilyPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageTransition>
                <SettingsPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        {/* Doctor Routes */}
        <Route path="/consultations" element={<ProtectedRoute role="DOCTOR"><div>Consultations View</div></ProtectedRoute>} />
        <Route
          path="/doctor/patients/:patientId"
          element={
            <ProtectedRoute role="DOCTOR">
              <PageTransition>
                <DoctorPatientView />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="/patients" element={<ProtectedRoute role="DOCTOR"><div>Patient Search View</div></ProtectedRoute>} />
        {/* Placeholder Provider Routes */}
        <Route path="/management" element={<ProtectedRoute role="PROVIDER"><div>Facility Management</div></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );

  // If it's a public route, don't wrap in AppLayout
  if (isPublicRoute) {
    return routeContent;
  }

  // Authenticated view with layout
  return (
    <AppLayout>
      {routeContent}
    </AppLayout>
  );
}

export default App;
