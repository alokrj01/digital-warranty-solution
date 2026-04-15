/**
 * Root Layout Component
 * Purpose: Provides global configuration including Fonts, Toast Notifications, 
 * and high-level CSS styles (Antialiasing, Background colors).
 */

import { Outfit } from "next/font/google"; 
import { Toaster } from "react-hot-toast"; 
import "./globals.css";

// Configure Outfit font: A modern, geometric sans-serif that fits the Tech-SaaS vibe.
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata = {
  title: "Warranty Wallet | AI-Powered Asset Protection",
  description: "Securely scan, store, and manage your product warranties with AI-driven insights.",
  keywords: "warranty tracker, ocr, receipt scanner, asset management",
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      data-scroll-behavior="smooth"
      className={`${outfit.variable} h-full antialiased scroll-smooth selection:bg-blue-100 selection:text-blue-900`}
    >
      <body className={`${outfit.className} min-h-full flex flex-col bg-[#F8FAFC] text-slate-900`}>
        
        {/* Toaster Configuration: 
          Customized to match the app's professional color palette.
        */}
        <Toaster 
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#0F172A', // Slate-900
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '600',
              border: '1px solid #E2E8F0', // Slate-200
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#2563EB', // Blue-600
                secondary: '#FFFFFF',
              },
            },
          }} 
        />
        
        {/* Main Application Content Wrapper */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Global UI Overlays (Modals/Portals) can be added here */}
      </body>
    </html>
  );
}