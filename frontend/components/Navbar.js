/**
 * Navbar Component
 * Purpose: Top-level navigation with glassmorphism effect and user actions.
 * Features:
 * - Floating blurred background (Glassmorphism).
 * - Dynamic active link highlighting.
 * - Logout functionality with state cleanup.
 */

"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Wallet,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Current route check karne ke liye

  /**
   * Handles user logout:
   * 1. Clears the local storage token.
   * 2. Redirects to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  /**
   * Helper function to determine if a link is active.
   */
  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full px-6 py-4">
      {/* Floating Glass Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-slate-200/50 rounded-3xl">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          {/* Icon Container with subtle lift */}
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-100 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
            <Wallet className="text-white" size={22} />
          </div>

          {/* Refined Brand Typography - Consistent with Footer */}
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-[900] text-slate-900 tracking-tighter">
              Warranty
              <span className="text-blue-600 font-extrabold">Wallet</span>
            </span>
            {/* Sub-label with increased tracking for professional look */}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-0.5 ml-0.5">
              Digital Vault
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl">
          <NavLink
            href="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={isActive("/dashboard")}
          />
          <NavLink
            href="/upload"
            icon={<PlusCircle size={18} />}
            label="Upload"
            active={isActive("/upload")}
          />
        </div>

        {/* User Actions Section */}
        <div className="flex items-center gap-3">
          {/* User Profile Avatar (Simulated) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
              AD
            </div>
            <span className="text-sm font-semibold text-slate-700">Alok</span>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
            title="Logout Account"
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}

/**
 * Helper Component: NavLink
 * Purpose: Renders a consistent style for navigation items.
 */
function NavLink({ href, icon, label, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
        active
          ? "bg-white text-blue-600 shadow-sm"
          : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
