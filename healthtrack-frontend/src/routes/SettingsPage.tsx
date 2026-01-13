import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [shareAnonymizedData, setShareAnonymizedData] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [abhaLinked, setAbhaLinked] = useState(!!user?.abhaId);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
        Settings
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Control how HealthTrack behaves for you – notifications, privacy,
        appearance, and integrations.
      </p>

      {/* Notifications */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Notifications
        </h2>
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-slate-800 dark:text-slate-100">
              Alerts &amp; Reminders
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Medication reminders, appointment alerts and consent requests.
            </p>
          </div>
          <button
            onClick={() => setNotificationsEnabled((v) => !v)}
            className={
              "w-12 h-6 flex items-center rounded-full p-1 " +
              (notificationsEnabled ? "bg-teal-500" : "bg-slate-400")
            }
          >
            <div
              className={
                "w-4 h-4 bg-white rounded-full shadow transform transition-transform " +
                (notificationsEnabled ? "translate-x-6" : "translate-x-0")
              }
            />
          </button>
        </div>
      </section>

      {/* Privacy */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Privacy &amp; Data
        </h2>
        <div className="flex items-start justify-between text-sm">
          <div>
            <p className="text-slate-800 dark:text-slate-100">
              Anonymized Health Insights
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Allow de-identified data to be used for improving health trends
              and research. Your name, phone and identity are never shared.
            </p>
          </div>
          <input
            type="checkbox"
            checked={shareAnonymizedData}
            onChange={(e) => setShareAnonymizedData(e.target.checked)}
            className="mt-1 h-4 w-4"
          />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          You can export or delete your HealthTrack data anytime from the
          account section (future feature).
        </p>
      </section>

      {/* Appearance (theme toggle) */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Appearance
        </h2>
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-slate-800 dark:text-slate-100">Theme Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch between light and dark mode. Preference is saved on this
              device.
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100"
          >
            {theme === "light" ? "🌙 Enable Dark" : "☀️ Enable Light"}
          </button>
        </div>
      </section>

      {/* Language */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Language
        </h2>
        <div className="text-sm">
          <label className="block text-slate-700 dark:text-slate-200 mb-1">
            App Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100"
          >
            <option value="en">English</option>
            <option value="hi">Hindi (coming soon)</option>
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multi-language support will be rolled out gradually.
          </p>
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Integrations
        </h2>
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-slate-800 dark:text-slate-100">
              ABHA / Ayushman Bharat Health Account
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Link your ABHA ID to sync records from ABDM-enabled hospitals in
              the future.
            </p>
          </div>
          <button
            onClick={() => setAbhaLinked((v) => !v)}
            className={
              "px-3 py-1 rounded-lg text-xs font-medium " +
              (abhaLinked
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-900 text-slate-50")
            }
          >
            {abhaLinked ? "Unlink" : "Link ABHA"}
          </button>
        </div>
        {abhaLinked && (
          <p className="text-xs text-emerald-600">
            ABHA linked (demo). In real deployment, this would connect to the
            ABDM ecosystem.
          </p>
        )}
      </section>
    </div>
  );
}
