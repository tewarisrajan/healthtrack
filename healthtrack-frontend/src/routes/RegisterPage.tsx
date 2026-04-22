import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { registerDoctor } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerDoctor({
        name,
        email,
        password,
        specialization,
        hospital,
        licenseNumber
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-2xl shadow-lg p-6 space-y-4 shadow-teal-900/20">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Doctor <span className="text-teal-600 dark:text-teal-400">Registration</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create your account by verifying your Medical ID.
          </p>
        </div>

        {error && (
          <div className="text-xs (error) text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@example.com"
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
          
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Professional Details</p>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Medical License Number *</label>
                <input
                  type="text"
                  className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="MED-XXXXX"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Specialization</label>
                  <input
                    type="text"
                    className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Cardiologist"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="General Hospital"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-4 py-2 rounded-lg bg-teal-600 text-white font-medium text-sm hover:bg-teal-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-[12px] text-slate-500 dark:text-slate-400 text-center mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          Already have an account? <Link to="/login" className="text-teal-600 dark:text-teal-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
