import { useAuth } from "../context/AuthContext";
import DashboardPage from "./DashboardPage";
import DoctorDashboard from "./DoctorDashboard";
import ProviderDashboard from "./ProviderDashboard";

export default function DashboardSwitcher() {
    const { user } = useAuth();

    switch (user?.role) {
        case "DOCTOR":
            return <DoctorDashboard />;
        case "PROVIDER":
            return <ProviderDashboard />;
        case "PATIENT":
        default:
            return <DashboardPage />;
    }
}
