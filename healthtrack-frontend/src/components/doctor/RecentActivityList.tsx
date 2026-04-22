import { motion } from "framer-motion";
import { Activity, CheckCircle, Clock, XCircle } from "lucide-react";
import type { DashboardStats } from "../../types/models";

interface RecentActivityListProps {
    activities: DashboardStats["recentActivity"];
}

export default function RecentActivityList({ activities }: RecentActivityListProps) {
    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-10 text-slate-400">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No recent activity.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
                            {getStatusIcon(activity.status)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">
                                {activity.patientName}
                            </p>
                            <p className="text-xs text-slate-500">
                                {getStatusText(activity.status)}
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400">
                        {new Date(activity.updatedAt).toLocaleDateString()}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case "APPROVED":
            return "bg-teal-50 text-teal-600";
        case "REJECTED":
            return "bg-red-50 text-red-600";
        case "PENDING":
        default:
            return "bg-yellow-50 text-yellow-600";
    }
}

function getStatusIcon(status: string) {
    switch (status) {
        case "APPROVED":
            return <CheckCircle className="w-5 h-5" />;
        case "REJECTED":
            return <XCircle className="w-5 h-5" />;
        case "PENDING":
        default:
            return <Clock className="w-5 h-5" />;
    }
}

function getStatusText(status: string) {
    switch (status) {
        case "APPROVED":
            return "Access Granted";
        case "REJECTED":
            return "Request Rejected";
        case "PENDING":
            return "Request Pending";
        default:
            return "Status Update";
    }
}
