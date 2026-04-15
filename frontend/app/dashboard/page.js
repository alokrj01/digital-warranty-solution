/**
 * Dashboard Component
 * Purpose: Central hub for warranty management.
 * Features:
 * - Real-time statistics summary.
 * - Search functionality for product filtering.
 * - Responsive grid for warranty cards.
 * - Integration with ProtectedRoute and API.
 */

"use client";

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Plus, Search, Filter, LayoutGrid, AlertTriangle, ShieldCheck, Inbox } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  // --- States ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Fetch user products from the backend on component mount.
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products/');
        // Mapping results: Backend should return { products: [...] }
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("[DashboardError]:", err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /**
   * Memoized Stats Calculation: 
   * Updates only when the products array changes.
   */
  const stats = useMemo(() => {
    const active = products.filter(p => p.days_left > 30).length;
    const critical = products.filter(p => p.days_left <= 30 && p.days_left > 0).length;
    const expired = products.filter(p => p.days_left <= 0).length;
    return { active, critical, expired, total: products.length };
  }, [products]);

  /**
   * Filtered list based on Search Query.
   */
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] font-sans">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Warranty Wallet</h1>
              <p className="text-slate-500 font-medium">Manage and track your product protections.</p>
            </div>
            <Link 
              href="/upload" 
              className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
            >
              <Plus size={20} className="mr-2" /> Add New Receipt
            </Link>
          </div>

          {/* --- Stats Overview Section --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon={<LayoutGrid size={20}/>} label="Total Assets" value={stats.total} color="blue" />
            <StatCard icon={<ShieldCheck size={20}/>} label="Active" value={stats.active} color="green" />
            <StatCard icon={<AlertTriangle size={20}/>} label="Expiring Soon" value={stats.critical} color="orange" />
            <StatCard icon={<Inbox size={20}/>} label="Expired" value={stats.expired} color="gray" />
          </div>

          {/* --- Search & Controls --- */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search by product name or brand..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Filter size={20} />
            </button>
          </div>

          {/* --- Main Grid Content --- */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-white border border-slate-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* --- Empty State --- */
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <Inbox size={48} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No warranties found</h3>
              <p className="text-slate-500 mt-1 mb-6">Start by scanning your first purchase receipt.</p>
              <Link href="/upload" className="text-blue-600 font-bold hover:underline">
                Upload now &rarr;
              </Link>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

/**
 * Helper Component: StatCard
 * Renders a small summary card with an icon and value.
 */
function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    orange: 'text-orange-600 bg-orange-50',
    gray: 'text-slate-500 bg-slate-100',
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}