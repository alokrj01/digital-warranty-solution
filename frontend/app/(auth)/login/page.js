/**
 * LoginPage Component
 * Purpose: Secure authentication interface for user access.
 * Features:
 * - OAuth2 compliant login (x-www-form-urlencoded).
 * - Interactive UI with loading states and brand identity.
 * - Form validation and persistent token storage.
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
  Mail,
  Lock,
  Wallet,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  // --- States ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Handles the authentication flow.
   * Note: FastAPI's OAuth2 expects data in form-url-encoded format.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Construction of URLSearchParams for OAuth2 compatibility
      const params = new URLSearchParams();
      params.append("username", email); // FastAPI uses 'username' field for login
      params.append("password", password);

      const response = await api.post("/auth/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Securely store the access token
      localStorage.setItem("token", response.data.access_token);

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      console.error("[LoginError]:", error);
      const errorMsg =
        error.response?.data?.detail || "Invalid email or password";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] px-4 font-sans">
      {/* Branding Section Above Card */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-100">
          <Wallet className="text-white" size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
          Warranty<span className="text-blue-600">Wallet</span>
        </h1>
      </div>

      {/* Main Login Card */}
      <div className="p-10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] w-full max-w-md border border-slate-100">
        <header className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Enter your details to access your dashboard
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input Field */}
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
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Password
              </label>
              <Link
                href="#"
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                size={18}
              />

              <input
                type={showPassword ? "text" : "password"} // Dynamic type switching
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-slate-900 transition-all font-medium"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Toggle Button */}
              <button
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword)}}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            disabled={loading}
            className={`w-full py-4 mt-2 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-blue-100 ${
              loading
                ? "bg-blue-400 cursor-wait text-white"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                {" "}
                <Loader2 className="animate-spin" size={20} />{" "}
                <span>Authenticating...</span>{" "}
              </>
            ) : (
              <>
                {" "}
                <span>Sign In</span> <ArrowRight size={18} />{" "}
              </>
            )}
          </button>

          {/* Footer Link */}
          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            New here?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-bold hover:underline transition-all"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>

      {/* Trust Badge */}
      <p className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        
      </p>
    </div>
  );
}
