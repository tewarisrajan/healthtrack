import { motion } from "framer-motion";
import Card from "../components/ui/Card";
import { useHealthTrack } from "../context/HealthTrackContext";
import RecordsOverTimeChart from "../components/dashboard/RecordsOverTimeChart";

export default function DashboardPage() {
  const { records, emergencyProfile, consentRequests, family } =
    useHealthTrack();

  const totalRecords = records.length;
  const pendingConsents = consentRequests.filter(
    (c) => c.status === "PENDING"
  ).length;

  // Simple "profile completeness" score
  let completeness = 0;
  if (totalRecords > 0) completeness += 40;
  if (emergencyProfile) completeness += 30;
  if (family.length > 0) completeness += 20;
  if (consentRequests.length > 0) completeness += 10;

  const recentRecords = records.slice(0, 5);

  return (
    <div className="space-y-6">
      <motion.h1
        className="text-2xl font-semibold text-slate-800 dark:text-slate-100"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Overview
      </motion.h1>

      {/* Stats cards */}
      <motion.div
        className="grid md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card
          label="Total Records"
          value={totalRecords.toString()}
          helper="All health documents you’ve stored"
        />
        <Card
          label="Pending Consents"
          value={pendingConsents.toString()}
          helper="Requests from hospitals or insurers"
        />
        <Card
          label="Emergency Profile"
          value={emergencyProfile ? "Configured" : "Not set"}
          helper={
            emergencyProfile
              ? "Ready to use in emergencies"
              : "Set it up in Emergency tab"
          }
        />
        <Card
          label="Family Profiles"
          value={family.length.toString()}
          helper="Dependents linked to your account"
        />
      </motion.div>

      {/* Completeness + chart */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 text-sm">
            Profile completeness
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Improve this by adding records, configuring emergency profile, and
            linking family.
          </p>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {completeness}% complete
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 text-sm">
            Records over time
          </h2>
          <RecordsOverTimeChart records={records} />
        </div>
      </motion.div>

      {/* Recent records + security info */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 text-sm">
            Recent Records
          </h2>
          {recentRecords.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No records yet. Upload one from the Records tab.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentRecords.map((r) => (
                <li
                  key={r.id}
                  className="flex justify-between border-b dark:border-slate-800 last:border-none pb-1"
                >
                  <span className="text-slate-700 dark:text-slate-300">{r.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 text-sm">
            Security &amp; Verification
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Blockchain-verified records:{" "}
            {records.filter((r) => r.blockchainVerified).length} /{" "}
            {records.length}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            We use a hybrid model: records are encrypted off-chain, while
            integrity proofs (hashes) can be anchored on blockchain. This
            prevents tampering without exposing your raw data.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
