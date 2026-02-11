import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
    role?: "PATIENT" | "DOCTOR" | "PROVIDER";
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
    const { user, loading, isAuthorized } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 font-bold uppercase tracking-widest italic">
                Authenticating Secure Session...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && !isAuthorized(role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-center">
                <div className="max-w-md space-y-4">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Access Restricted</h1>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">Your current role ({user.role}) does not have permission to access this clinical module.</p>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all text-xs uppercase"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
