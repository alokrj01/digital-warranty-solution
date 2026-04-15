/**
 * UploadPage Component
 * Purpose: Handles receipt image uploads with real-time AI processing feedback.
 * Features:
 * - Optimized Next.js Image preview.
 * - Dynamic progress messaging ("Scanning text...", etc.).
 * - Memory cleanup for Blob URLs.
 * - Industry-standard professional comments.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

// Professional messages to cycle through during AI processing
const progressSteps = [
  "Uploading your receipt...",
  "Running Google Vision OCR...",
  "Extracting product details...",
  "Identifying warranty dates...",
  "Finalizing and saving...",
];

export default function UploadPage() {
  // --- State Management ---
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [stepIndex, setStepIndex] = useState(0);
  const router = useRouter();

  /**
   * Effect: Cycles through progress steps every 2.5 seconds during loading.
   */
  useEffect(() => {
    let interval;
    if (status === "loading") {
      interval = setInterval(() => {
        setStepIndex((prev) =>
          prev < progressSteps.length - 1 ? prev + 1 : prev,
        );
      }, 2500);
    } else {
      setStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  /**
   * Cleanup: Revokes the blob URL when component unmounts or preview changes
   * to prevent memory leaks in the browser.
   */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /**
   * Handles local file selection and generates preview.
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        return toast.error("File size must be under 5MB");
      }
      // Revoke previous blob URL to prevent memory leak
      if (preview) URL.revokeObjectURL(preview);
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setStatus("idle");
    }
  };

  /**
   * Main Upload Logic: Connects to your pre-built Google Vision backend.
   */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file first.");

    setStatus("loading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      // API call to your backend endpoint
      await api.post("/receipts/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus("success");
      toast.success("AI Analysis Complete!");

      // Delay redirect slightly so user sees the success state
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error) {
      console.error("[UploadError]:", error);
      setStatus("idle");
      toast.error(error.response?.data?.detail || "Failed to process receipt.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />

        {/* --- Full Screen Loading Overlay --- */}
        {status === "loading" && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-600/95 backdrop-blur-lg text-white text-center p-6">
            <div className="relative mb-8">
              <Loader2
                className="animate-spin text-blue-200"
                size={84}
                strokeWidth={1.5}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold tracking-tighter">
                  {Math.round(((stepIndex + 1) / progressSteps.length) * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight animate-pulse transition-all">
                {progressSteps[stepIndex]}
              </h2>
              <p className="text-blue-100 text-sm opacity-70">
                Our AI is analyzing your bill. This usually takes a few seconds.
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex gap-2 mt-10">
              {progressSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-700 ${
                    i <= stepIndex ? "w-10 bg-white" : "w-2 bg-blue-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <main className="max-w-xl mx-auto p-6 mt-12">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Add Warranty
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Upload a bill to auto-extract details.
              </p>
            </header>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* Image Picker / Optimized Preview */}
              <div className="relative">
                {preview ? (
                  <div className="relative group w-full h-80 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                    <Image
                      src={preview}
                      alt="Receipt"
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }}
                      className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 transition-transform active:scale-90"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 transition-all group">
                    <div className="flex flex-col items-center">
                      <div className="p-5 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <ImageIcon className="text-blue-600" size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        Select Receipt Image
                      </p>
                      <p className="text-xs text-slate-400 mt-1 italic font-medium">
                        Max size: 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>

              {/* Action Button */}
              <button
                disabled={status !== "idle" || !file}
                className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                  status === "idle" && file
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {status === "success" ? (
                  <>
                    {" "}
                    <CheckCircle2 size={22} /> Redirecting...{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <Upload size={22} /> Start AI Extraction{" "}
                  </>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
