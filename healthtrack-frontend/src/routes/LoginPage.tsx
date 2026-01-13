// src/routes/LoginPage.tsx
import { type FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("demo@healthtrack.com");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password); // now calls backend
      // App component will detect logged-in user and show dashboard
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-2xl shadow-lg p-6 space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Health<span className="text-teal-600 dark:text-teal-400">Track</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to your health vault.
          </p>
        </div>

        {error && (
          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-2 rounded-lg bg-teal-600 text-white font-medium text-sm hover:bg-teal-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
          Demo user: <b>demo@healthtrack.com</b> / <b>demo123</b>
        </p>
      </div>
    </div>
  );
}
