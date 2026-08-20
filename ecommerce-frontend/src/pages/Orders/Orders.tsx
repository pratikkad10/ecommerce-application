import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as orderService from "../../api/services/order.service";
import type { Order } from "../../types/commerce.types";
import { Button } from "../../components/ui/button";

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await orderService.getUserOrders();
        if (res.success && Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Failed to load user orders", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SHIPPED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-100 text-emerald-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  if (isLoading) {
    return (
      <main className="grow flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary-container">
            progress_activity
          </span>
          <p className="text-sm text-on-surface-variant">Loading your orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="grow max-w-container-max mx-auto px-margin-mobile md:px-gutter py-10 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-on-surface font-medium">My Orders</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-3xl font-black text-on-surface">
            Order History
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Track and manage your past purchases
          </p>
        </div>

        <Button asChild variant="outline" className="rounded-xl font-semibold text-xs">
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-4 text-outline">
            <span className="material-symbols-outlined text-4xl">inventory_2</span>
          </div>
          <h2 className="font-bold text-lg text-on-surface mb-1">No Orders Found</h2>
          <p className="text-xs text-on-surface-variant max-w-sm mb-6">
            You haven't placed any orders yet. Once you make a purchase, it will appear here.
          </p>
          <Button asChild className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-xl hover:bg-primary-container">
            <Link to="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs overflow-hidden"
            >
              {/* Order Header Bar */}
              <div className="p-5 bg-surface-container-low border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                      Order Placed
                    </span>
                    <span className="text-xs font-semibold text-on-surface">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                      Total Amount
                    </span>
                    <span className="text-xs font-bold text-primary-container">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                      Order Number
                    </span>
                    <span className="text-xs font-mono text-on-surface">
                      #{order.orderNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getPaymentStatusBadge(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 divide-y divide-outline-variant/20">
                {order.items.map((item) => {
                  const image =
                    item.variant?.product?.images?.find((img) => img.isPrimary)?.url ||
                    item.variant?.product?.images?.[0]?.url ||
                    "https://placehold.co/400x500/f6ded2/584235?text=No+Image";

                  return (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 h-20 rounded-xl overflow-hidden bg-surface-variant shrink-0">
                          <img src={image} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-on-surface truncate">
                            {item.productName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant">
                            {item.sizeName && <span>Size: {item.sizeName}</span>}
                            {item.sizeName && item.colorName && <span>•</span>}
                            {item.colorName && <span>Color: {item.colorName}</span>}
                            <span>•</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <span className="text-xs font-semibold text-primary-container mt-1 block">
                            ₹{Number(item.unitPrice).toFixed(2)} each
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm text-on-surface">
                          ₹{(Number(item.unitPrice) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shipping Address Footer Snapshot */}
              <div className="px-6 py-3 bg-surface-container-lowest border-t border-outline-variant/20 text-xs text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-outline">location_on</span>
                <span>
                  Delivering to: {order.shippingStreet}, {order.shippingCity}, {order.shippingState} - {order.shippingPostalCode}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
