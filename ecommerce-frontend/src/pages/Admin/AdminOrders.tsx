import { useEffect, useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, Eye, MapPin } from "lucide-react";
import * as adminService from "../../api/services/admin.service";
import type { AdminOrder, OrderStatus, PaginationMeta } from "../../types/admin.types";
import { toast } from "sonner";

const ORDER_STATUSES: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    PROCESSING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    SHIPPED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
    PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
    REFUNDED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[status] ?? "bg-white/5 text-white/50 border-white/10"}`}>
      {status}
    </span>
  );
}

export function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const data = await adminService.getAdminOrders(page, 10);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(currentPage); }, [currentPage, fetchOrders]);

  const handleStatusUpdate = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      fetchOrders(currentPage);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  }, [currentPage, fetchOrders]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase();
    return orders.filter((o) =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.user.email.toLowerCase().includes(q) ||
      o.user.firstName.toLowerCase().includes(q)
    );
  }, [orders, searchQuery]);

  if (isLoading && orders.length === 0) return <OrdersSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Orders</h1>
          <p className="mt-1 text-sm text-white/40">{pagination?.totalCount ?? 0} total orders</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/8 bg-white/3 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-primary/30 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/6 bg-[#0f0f18]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6">
                {["Order", "Customer", "Status", "Payment", "Amount", "Date", "Actions"].map((h) => (
                  <th key={h} className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/30 ${h === "Amount" || h === "Date" || h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-white/30">No orders found</td></tr>
              ) : filteredOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrder === order.id}
                  onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/30">Page {pagination.currentPage} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <button disabled={!pagination.hasPrevPage} onClick={() => setCurrentPage((p) => p - 1)} className="flex items-center gap-1 rounded-lg border border-white/8 px-3 py-1.5 text-xs text-white/50 disabled:opacity-30 hover:bg-white/4">
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <button disabled={!pagination.hasNextPage} onClick={() => setCurrentPage((p) => p + 1)} className="flex items-center gap-1 rounded-lg border border-white/8 px-3 py-1.5 text-xs text-white/50 disabled:opacity-30 hover:bg-white/4">
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderRow({ order, isExpanded, onToggle, onStatusUpdate }: {
  order: AdminOrder;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}) {
  return (
    <>
      <tr className="transition-colors hover:bg-white/2">
        <td className="px-5 py-3.5 text-sm font-medium text-white/80">#{order.orderNumber}</td>
        <td className="px-5 py-3.5">
          <p className="text-sm text-white/70">{order.user.firstName} {order.user.lastName ?? ""}</p>
          <p className="text-[11px] text-white/30">{order.user.email}</p>
        </td>
        <td className="px-5 py-3.5">
          <select
            value={order.status}
            onChange={(e) => onStatusUpdate(order.id, e.target.value as OrderStatus)}
            className="rounded-lg border border-white/8 bg-transparent px-2 py-1 text-xs text-white/70 focus:border-primary/30 focus:outline-none"
            aria-label={`Update status for order ${order.orderNumber}`}
          >
            {ORDER_STATUSES.map((s) => <option key={s} value={s} className="bg-[#0f0f18]">{s}</option>)}
          </select>
        </td>
        <td className="px-5 py-3.5"><StatusBadge status={order.paymentStatus} /></td>
        <td className="px-5 py-3.5 text-right text-sm font-semibold text-white/80">₹{Number(order.totalAmount).toLocaleString("en-IN")}</td>
        <td className="px-5 py-3.5 text-right text-xs text-white/40">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
        <td className="px-5 py-3.5 text-right">
          <button onClick={onToggle} className="rounded-lg p-1.5 text-white/30 hover:bg-white/6 hover:text-white/60" aria-label="Toggle order details">
            <Eye className="h-4 w-4" />
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7} className="bg-white/1 px-5 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-white/30">Items</p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg bg-white/3 px-3 py-2">
                      <div>
                        <p className="text-sm text-white/70">{item.productName}</p>
                        <p className="text-[11px] text-white/30">SKU: {item.variantSku} · Qty: {item.quantity}{item.sizeName ? ` · ${item.sizeName}` : ""}{item.colorName ? ` · ${item.colorName}` : ""}</p>
                      </div>
                      <p className="text-sm font-medium text-white/60">₹{Number(item.unitPrice).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-white/30">Shipping Address</p>
                <div className="flex items-start gap-2 rounded-lg bg-white/3 p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                  <p className="text-sm text-white/50">{order.shippingStreet}, {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}, {order.shippingCountry}</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-6">
      <div><div className="h-7 w-24 animate-pulse rounded-lg bg-white/6" /></div>
      <div className="h-96 animate-pulse rounded-2xl bg-white/4" />
    </div>
  );
}
