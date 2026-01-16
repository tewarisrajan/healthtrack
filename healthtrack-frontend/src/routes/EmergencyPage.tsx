import { motion } from "framer-motion";
import EmergencyCard from "../components/emergency/EmergencyCard";
import QRPreview from "../components/emergency/QRPreview";

export default function EmergencyPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Universal Life-Line
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
          Your emergency QR code is a secure, persistent bridge between you and first responders. Configure your critical health data and keep the QR on your person for instant access in crises.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <motion.div variants={item}>
          <EmergencyCard />
        </motion.div>
        <motion.div variants={item}>
          <QRPreview />
        </motion.div>
      </div>
    </motion.div>
  );
}
