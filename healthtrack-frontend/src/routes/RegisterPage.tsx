import { type FormEvent, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, AlertTriangle, CheckCircle2, Loader2, ChevronRight, ChevronLeft } from "lucide-react";

interface NMCDoctorDetails {
    name: string;
    fatherName: string;
    qualification: string;
    university: string;
    yearOfRegistration: string;
    stateMedicalCouncil: string;
    registrationNumber: string;
    status: string;
    address: string;
}

export default function RegisterPage() {
  const { registerDoctor } = useAuth();
  const navigate = useNavigate();

  // Step tracking: 1 = NMC Verification, 2 = Account Creation
  const [step, setStep] = useState(1);

  // Step 1 state
  const [councils, setCouncils] = useState<string[]>([]);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [stateMedicalCouncil, setStateMedicalCouncil] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verifiedDoctor, setVerifiedDoctor] = useState<NMCDoctorDetails | null>(null);

  // Step 2 state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch State Medical Councils on mount
  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/nmc/councils");
        const data = await res.json();
        if (data.success) setCouncils(data.data);
      } catch (err) {
        console.error("Failed to fetch councils", err);
      }
    };
    fetchCouncils();
  }, []);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setVerificationError(null);
    setVerifying(true);

    try {
      const res = await fetch("http://localhost:4000/api/nmc/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber, stateMedicalCouncil }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setVerificationError(data.message || "Verification failed.");
        return;
      }

      setVerifiedDoctor(data.data);
      // Pre-fill name from NMC record
      setName(data.data.name);
      setSpecialization(data.data.qualification);
      setStep(2);
    } catch (err: any) {
      setVerificationError("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

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
        registrationNumber,
        stateMedicalCouncil,
        qualification: verifiedDoctor?.qualification
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
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-3xl shadow-2xl shadow-teal-900/20 p-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-teal-500/20 mb-2">
            H
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Doctor <span className="text-teal-600 dark:text-teal-400">Registration</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Verified through the Indian Medical Register (NMC)
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 px-4">
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-700"}`} />
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-700"}`} />
        </div>

        {/* Step 1: NMC Verification */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                Step 1: Verify your identity against the <strong>Indian Medical Register</strong> maintained by the National Medical Commission (NMC).
              </p>
            </div>

            {verificationError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">{verificationError}</p>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 pl-1">State Medical Council *</label>
                <select
                  className="w-full border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  value={stateMedicalCouncil}
                  onChange={(e) => setStateMedicalCouncil(e.target.value)}
                  required
                >
                  <option value="">Select your State Medical Council</option>
                  {councils.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 pl-1">NMC Registration Number *</label>
                <input
                  type="text"
                  className="w-full border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-mono"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. DMC-12345"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying with NMC...
                  </>
                ) : (
                  <>
                    Verify Registration
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              We query the Indian Medical Register to confirm your credentials are active and valid.
              <br />For demo, try: <strong className="text-teal-500">DMC-12345</strong> with <strong className="text-teal-500">Delhi Medical Council</strong>
            </p>
          </div>
        )}

        {/* Step 2: Account Creation (only after verification) */}
        {step === 2 && verifiedDoctor && (
          <div className="space-y-5">
            {/* Verification Badge */}
            <div className="flex items-start gap-3 p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-900/30 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-teal-700 dark:text-teal-300">NMC Verification Successful</p>
                <div className="text-[11px] text-teal-600/80 dark:text-teal-400/80 mt-1 space-y-0.5">
                  <p><strong>Name:</strong> {verifiedDoctor.name}</p>
                  <p><strong>Qualification:</strong> {verifiedDoctor.qualification}</p>
                  <p><strong>University:</strong> {verifiedDoctor.university}</p>
                  <p><strong>Reg. No:</strong> {verifiedDoctor.registrationNumber} ({verifiedDoctor.stateMedicalCouncil})</p>
                  <p><strong>Year:</strong> {verifiedDoctor.yearOfRegistration}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 pl-1">Full Name</label>
                <input
                  type="text"
                  className="w-full border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 pl-1">Email</label>
                <input
                  type="email"
                  className="w-full border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 pl-1">Password</label>
                <input
                  type="password"
                  className="w-full border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 pl-1">Specialization</label>
                  <input
                    type="text"
                    className="w-full border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Cardiologist"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 pl-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    className="w-full border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="General Hospital"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Create Verified Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <p className="text-[12px] text-slate-500 dark:text-slate-400 text-center pt-4 border-t border-slate-200 dark:border-slate-800">
          Already have an account? <Link to="/login" className="text-teal-600 dark:text-teal-400 hover:underline font-bold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
