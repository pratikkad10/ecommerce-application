import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign, ShoppingCart, Users, TrendingUp,
  ArrowUpRight, Package, Clock,
} from "lucide-react";
import * as adminService from "../../api/services/admin.service";
import type { DashboardStats, RecentOrder } from "../../types/admin.types";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: string;
}

function StatCard({ title, value, icon, gradient, trend }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/6 bg-[#0f0f18] p-5 transition-all duration-300 hover:border-white/10">
      <div className={`absolute inset-0 opacity-[0.03] ${gradient}`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${gradient} shadow-lg`}>
            {icon}
          </div>
          {trend && (
            <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />{trend}
            </span>
          )}
        </div>
        <p className="mt-4 text-2xl font-bold tracking-tight text-white">{value}</p>
        <p className="mt-1 text-xs font-medium text-white/40">{title}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = useMemo(() => {
    const s: Record<string, string> = {
      PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      PROCESSING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      SHIPPED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return s[status] ?? "bg-white/5 text-white/50 border-white/10";
  }, [status]);
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config}`}>
      {status}
    </span>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const formattedRevenue = useMemo(() => {
    if (!stats) return "₹0";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(stats.totalRevenue));
  }, [stats]);

  if (isLoading) return <DashboardSkeleton />;
  if (error) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-red-400">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-3 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">Try Again</button>
      </div>
    </div>
  );
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/40">Overview of your store performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={formattedRevenue} icon={<DollarSign className="h-5 w-5 text-white" />} gradient="bg-gradient-to-br from-primary to-amber-500" />
        <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={<ShoppingCart className="h-5 w-5 text-white" />} gradient="bg-gradient-to-br from-blue-500 to-cyan-500" />
        <StatCard title="Total Customers" value={stats.totalUsers.toLocaleString()} icon={<Users className="h-5 w-5 text-white" />} gradient="bg-gradient-to-br from-purple-500 to-pink-500" />
        <StatCard title="Conversion Rate" value={stats.totalUsers > 0 ? `${((stats.totalOrders / stats.totalUsers) * 100).toFixed(1)}%` : "0%"} icon={<TrendingUp className="h-5 w-5 text-white" />} gradient="bg-gradient-to-br from-emerald-500 to-teal-500" trend="+4.2%" />
      </div>

      {/* Recent Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-white/6 bg-[#0f0f18]">
        <div className="flex items-center justify-between border-b border-white/6 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-white/40" />
            <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
          </div>
          <button onClick={() => navigate("/admin/orders")} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80">
            View all <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-10 w-10 text-white/10" />
            <p className="mt-3 text-sm text-white/30">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/4">
                  {["Order", "Customer", "Status", "Amount", "Date"].map((h) => (
                    <th key={h} className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/30 ${h === "Amount" || h === "Date" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {stats.recentOrders.map((order: RecentOrder) => (
                  <tr key={order.id} className="cursor-pointer transition-colors hover:bg-white/2" onClick={() => navigate("/admin/orders")}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
                          <Package className="h-3.5 w-3.5 text-white/40" />
                        </div>
                        <span className="text-sm font-medium text-white/80">#{order.orderNumber}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-white/70">{order.user.firstName} {order.user.lastName ?? ""}</p>
                      <p className="text-[11px] text-white/30">{order.user.email}</p>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-white/80">₹{Number(order.totalAmount).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3.5 text-right text-xs text-white/40">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "Add Product", desc: "Create a new product listing", icon: <Package className="h-5 w-5" />, to: "/admin/products/new" },
          { title: "Manage Orders", desc: "Update order statuses", icon: <ShoppingCart className="h-5 w-5" />, to: "/admin/orders" },
          { title: "View Customers", desc: "See all registered users", icon: <Users className="h-5 w-5" />, to: "/admin/users" },
        ].map((a) => (
          <button key={a.title} onClick={() => navigate(a.to)} className="group flex items-center gap-4 rounded-2xl border border-white/6 bg-[#0f0f18] p-4 text-left transition-all duration-200 hover:border-primary/20">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/4 text-white/40 group-hover:bg-primary/10 group-hover:text-primary">{a.icon}</div>
            <div>
              <p className="text-sm font-semibold text-white/80">{a.title}</p>
              <p className="text-xs text-white/30">{a.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div><div className="h-7 w-32 animate-pulse rounded-lg bg-white/6" /><div className="mt-2 h-4 w-64 animate-pulse rounded-lg bg-white/4" /></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (<div key={`s-${i}`} className="h-32 animate-pulse rounded-2xl bg-white/4" />))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-white/4" />
    </div>
  );
}
