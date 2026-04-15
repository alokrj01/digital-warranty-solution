/**
 * ProductCard Component
 * Features:
 * - Dynamic color coding based on expiry days.
 * - Visual progress bar for warranty life.
 * - Glassmorphism hover effects.
 */

import { Calendar, ShieldAlert, ShieldCheck, ArrowRight } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns"; // pip install date-fns agar nahi hai

export default function ProductCard({ product }) {
  const daysLeft = product.days_left;

  // Status logic for colors
  const isExpired = daysLeft <= 0;
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 30;

  const statusColor = isExpired
    ? "text-red-600 bg-red-50 border-red-100"
    : isExpiringSoon
      ? "text-orange-600 bg-orange-50 border-orange-100"
      : "text-green-600 bg-green-50 border-green-100";

  return (
    <div className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      {/* Status Badge */}
      <div
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}
      >
        {isExpired ? "Expired" : isExpiringSoon ? "Expiring Soon" : "Protected"}
      </div>

      <div className="flex items-start gap-4 mb-6">
        {/* Brand Icon Placeholder */}
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-500">
          <span className="text-xl font-black text-slate-300 uppercase">
            {product.name?.[0] || "?"}
          </span>
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-lg font-extrabold text-slate-900 truncate tracking-tight">
            {product.name}
          </h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter">
            {product.brand || "Generic Brand"}
          </p>
        </div>
      </div>

      {/* Info Rows */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-slate-500 font-medium">
          <Calendar size={16} className="mr-2 text-slate-400" />
          Expires:{" "}
          <span className="text-slate-900 ml-1 font-bold">
            {product.expiry_date}
          </span>
        </div>

        {/* Progress Bar logic */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
            <span>Warranty Health</span>
            <span className={isExpired ? "text-red-500" : "text-slate-600"}>
              {isExpired ? "0" : daysLeft} Days Left
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${isExpired ? "bg-red-500 w-0" : isExpiringSoon ? "bg-orange-500" : "bg-blue-600"}`}
              style={{
                width: isExpired
                  ? "0%"
                  : `${Math.min((daysLeft / 365) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all">
        View Details{" "}
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );
}
