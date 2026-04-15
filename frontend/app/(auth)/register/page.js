/**
 * RegisterPage Component
 * Purpose: User onboarding and account creation.
 * Features:
 * - Unified brand identity (WarrantyWallet).
 * - Multi-input form handling with state objects.
 * - Loading feedback and professional typography.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Lock,
  Wallet,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  // --- State Management ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Dispatches registration data to the FastAPI backend.
   * On success, redirects user to the login flow.
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend registration endpoint call
      await api.post("/auth/register", formData);

      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (error) {
      console.error("[RegistrationError]:", error.response?.data);
      const errorDetail = error.response?.data?.detail;
      if (Array.isArray(errorDetail)) {
        toast.error(errorDetail[0].msg);
      } else {
        toast.error(errorDetail || "Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] px-4 font-sans">
      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-100 animate-bounce-slow">
          <Wallet className="text-white" size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
          Warranty<span className="text-blue-600">Wallet</span>
        </h1>
      </div>

      {/* Main Registration Card */}
      <div className="p-10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] w-full max-w-md border border-slate-100 transition-all">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
            <Sparkles size={12} /> New Account
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Join Us
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Start protecting your assets today
          </p>
        </header>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Your Name"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-slate-900 transition-all font-medium"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Email Address Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                size={18}
              />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-slate-900 transition-all font-medium"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                size={18}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-slate-900 transition-all font-medium"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className={`w-full py-4 mt-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-blue-100 ${
              loading
                ? "bg-blue-400 cursor-wait text-white"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                {" "}
                <Loader2 className="animate-spin" size={20} />{" "}
                <span>Creating Account...</span>{" "}
              </>
            ) : (
              "Create My Wallet"
            )}
          </button>

          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-bold hover:underline transition-all"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>

      {/* Minimalist Footer */}
      <footer className="mt-12 text-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          
        </p>
      </footer>
    </div>
  );
}
