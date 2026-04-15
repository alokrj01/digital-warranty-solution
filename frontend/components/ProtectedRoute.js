/**
 * ProtectedRoute Wrapper
 * Purpose: Ensures page-level security by verifying JWT tokens.
 * Features:
 * - Premium Full-screen verification overlay.
 * - Smooth transition states.
 * - Dynamic session check logic with brand alignment.
 */

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Wallet } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    /**
     * Session Verification Logic:
     * Check for token presence. 
     * NOTE: In production, you might want to call an API here 
     * to verify if the token is still valid/expired.
     */
    const verifySession = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Replace current history entry to prevent back-button loops
        router.replace('/login');
      } else {
        setAuthenticated(true);
        // Chota sa delay for premium feel
        setTimeout(() => setIsChecking(false), 800);
      }
    };

    verifySession();
  }, [router]);

  /**
   * Premium Loading Screen:
   * Shown while the app is verifying the user's identity.
   */
  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        {/* Subtle Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent -z-10" />
        
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          {/* Logo Pulse Animation */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-600 blur-xl opacity-10 animate-pulse" />
            <div className="relative bg-white p-5 rounded-[2rem] shadow-xl border border-slate-100">
              <Wallet className="text-blue-600" size={36} />
            </div>
            {/* Small Badge on Icon */}
            <div className="absolute -bottom-1 -right-1 bg-green-500 border-4 border-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
              <ShieldCheck className="text-white" size={12} strokeWidth={3} />
            </div>
          </div>

          {/* Verification Text */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin text-blue-600" size={16} />
              <p className="text-slate-900 font-[900] tracking-tighter text-lg">
                Warranty<span className="text-blue-600">Wallet</span>
              </p>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              Securing Your Assets
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Final content render
  return authenticated ? (
    <div className="animate-in fade-in duration-700">
      {children}
    </div>
  ) : null;
}