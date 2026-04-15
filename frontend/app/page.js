/**
 * Landing Page (Home)
 * Purpose: First point of entry for the application.
 * Features:
 * - High-impact Hero section with professional typography.
 * - Value proposition cards (Bento-style).
 * - Polished UI with Tailwind gradients and transitions.
 */

import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  BellRing,
  Wallet,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-100">
      {/* Background Decor (Subtle Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      {/* --- Main Hero Section --- */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-8 animate-fade-in">
          <SparkleIcon />
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
            AI-Powered Warranty Tracking
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-[900] text-slate-900 tracking-tighter leading-[1.1] mb-6 max-w-4xl">
          Never Lose a{" "}
          <span className="text-blue-600 relative">
            Warranty
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 358 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5.26c59.333-3.333 178-9 356 1"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          Again.
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed font-medium">
          The most secure way to scan, store, and manage your product
          protections. Get smart alerts before they expire. Built for the modern
          consumer.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/login"
            className="group bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center gap-2 active:scale-95"
          >
            Get Started Free
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          {/* <button className="bg-white border border-slate-200 text-slate-700 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95">
            View Demo
          </button> */ }
        </div>

        {/* --- Features Grid (Bento Style) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28 max-w-6xl w-full">
          <FeatureCard
            icon={<ShieldCheck size={24} className="text-blue-600" />}
            title="Secure Vault"
            desc="Military-grade encryption for your digital and paper receipts."
            tag="Security"
          />

          <FeatureCard
            icon={<BellRing size={24} className="text-blue-600" />}
            title="Smart Alerts"
            desc="Automated notifications via push & email before warranty ends."
            tag="Automation"
          />

          <FeatureCard
            icon={<Zap size={24} className="text-blue-600" />}
            title="AI Extraction"
            desc="Powered by Google Vision to auto-detect dates and brands."
            tag="Intelligence"
          />
        </div>
      </main>

      {/* --- Footer Section --- */}
      <footer className="py-14 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Clean Brand Identity */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="bg-blue-600 p-2 rounded-xl shadow-md shadow-blue-100">
              <Wallet className="text-white" size={18} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-[900] text-slate-900 tracking-tight">
                Warranty
                <span className="text-blue-600 font-extrabold">Wallet</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-0.5">
                Digital Vault
              </span>
            </div>
          </div>

          {/* Secondary Info */}
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-sm font-medium">
              © 2026{" "}
              <span className="text-slate-600 font-bold">Warranty Wallet.</span>
              <span className="hidden sm:inline ml-1 italic">
                Protecting your peace of mind. All rights reserved.
              </span>
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8 text-xs font-bold text-slate-500">
            <Link
              href="#"
              className="hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Helper: FeatureCard
 * Professional bento-style card for value propositions.
 */
function FeatureCard({ icon, title, desc, tag }) {
  return (
    <div className="p-8 text-left bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group duration-500">
      <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2 block">
        {tag}
      </span>
      <h3 className="text-xl font-extrabold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}

/**
 * Static Icon Component
 */
function SparkleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-600"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
