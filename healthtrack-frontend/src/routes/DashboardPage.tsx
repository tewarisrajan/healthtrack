import { useEffect } from "react";
import { useHealthTrack } from "../context/HealthTrackContext";
import Card from "../components/ui/Card";
import RecordsOverTimeChart from "../components/dashboard/RecordsOverTimeChart";
import HealthScoreWidget from "../components/dashboard/HealthScoreWidget";
import QuickActions from "../components/dashboard/QuickActions";
import ConsentRequestList from "../components/consent/ConsentRequestList";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { records, consentRequests, fetchConsents, respondToConsent } = useHealthTrack();

  // Poll for consents
  useEffect(() => {
    fetchConsents?.(); // Initial fetch
    const interval = setInterval(() => {
      fetchConsents?.();
    }, 5000); // 5s poll for dashboard
    return () => clearInterval(interval);
  }, [fetchConsents]);

  const handleConsentResponse = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await respondToConsent(id, status);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate dynamic stats
  const totalRecords = records.length;
  const lastRecordDate = records.length > 0
    ? new Date(records[0].createdAt).toLocaleDateString()
    : "N/A";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, here's your health summary.
          </p>
        </div>
      </div>

      {/* Real-time Consent Requests Widget */}
      {consentRequests.length > 0 && (
        <motion.div variants={item} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-teal-100 dark:border-teal-900 shadow-lg shadow-teal-900/5">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
            Pending Access Requests
          </h2>
          <ConsentRequestList
            requests={consentRequests}
            onApprove={(id) => handleConsentResponse(id, 'APPROVED')}
            onReject={(id) => handleConsentResponse(id, 'REJECTED')}
          />
        </motion.div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* Main Stats - Spans 2 cols */}
        <motion.div variants={item} className="md:col-span-2 grid grid-cols-2 gap-4">
          <Card
            label="Total Records"
            value={totalRecords.toString()}
            helper="All time"
          />
          <Card
            label="Last Activity"
            value={lastRecordDate}
            helper="Most recent upload"
          />
        </motion.div>

        {/* Health Score - Spans 1 col */}
        <motion.div variants={item} className="h-48 md:h-auto">
          <HealthScoreWidget />
        </motion.div>

        {/* Quick Actions - Spans 1 col */}
        <motion.div variants={item} className="h-48 md:h-auto">
          <QuickActions />
        </motion.div>

        {/* Chart - Wide span */}
        <motion.div variants={item} className="md:col-span-3 lg:col-span-4 glass-card rounded-3xl p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 px-2">
            Records Timeline
          </h3>
          <div className="h-72">
            <RecordsOverTimeChart records={records} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
