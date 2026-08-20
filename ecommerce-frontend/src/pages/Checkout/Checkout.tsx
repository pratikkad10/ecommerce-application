import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import * as addressService from "../../api/services/address.service";
import * as orderService from "../../api/services/order.service";
import type { Address } from "../../types/commerce.types";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, summary, refreshCart } = useCart();

  // Address selection / Form state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(true);

  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to proceed to checkout");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Load saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const res = await addressService.getAddresses();
        if (res.success && res.data && res.data.length > 0) {
          setAddresses(res.data);
          const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
          setSelectedAddressId(defaultAddr.id);
          setStreet(defaultAddr.street);
          setCity(defaultAddr.city);
          setState(defaultAddr.state);
          setCountry(defaultAddr.country);
          setPostalCode(defaultAddr.postalCode);
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const handleAddressSelect = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setStreet("");
      setCity("");
      setState("");
      setPostalCode("");
    } else {
      const selected = addresses.find((a) => a.id === addrId);
      if (selected) {
        setStreet(selected.street);
        setCity(selected.city);
        setState(selected.state);
        setCountry(selected.country);
        setPostalCode(selected.postalCode);
      }
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !city.trim() || !state.trim() || !postalCode.trim() || !phone.trim()) {
      toast.error("Please fill in all shipping details");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/shop");
      return;
    }

    setIsProcessingOrder(true);
    try {
      // Save address if requested and it's a new address
      if (selectedAddressId === "new" && saveAddressForFuture) {
        try {
          await addressService.createAddress({
            street: street.trim(),
            city: city.trim(),
            state: state.trim(),
            country: country.trim(),
            postalCode: postalCode.trim(),
            isDefault: addresses.length === 0,
          });
        } catch {
          // Continue even if address saving fails
        }
      }

      // Initialize checkout
      const checkoutRes = await orderService.initializeCheckout({
        shippingStreet: street.trim(),
        shippingCity: city.trim(),
        shippingState: state.trim(),
        shippingCountry: country.trim(),
        shippingZip: postalCode.trim(),
        contactPhone: phone.trim(),
      });

      if (!checkoutRes.success || !checkoutRes.data) {
        throw new Error("Failed to initialize checkout");
      }

      const { razorpayOrderId, amount, currency } = checkoutRes.data;

      // Load Razorpay Checkout SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        toast.error("Could not load payment gateway. Please check your connection.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_key",
        amount,
        currency,
        name: "Kraya E-Commerce",
        description: `Order #${checkoutRes.data.order.orderNumber}`,
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await orderService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              toast.success("Payment verified! Your order has been placed.");
              await refreshCart();
              navigate("/orders");
            }
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed");
          }
        },
        prefill: {
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          email: user?.email || "",
          contact: phone,
        },
        theme: {
          color: "#b05322",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error?.description || "Transaction cancelled"}`);
      });
      razorpay.open();
    } catch (err: any) {
      toast.error(err.message || "Checkout failed. Please try again.");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const shippingCost = summary.cartTotal >= 999 ? 0 : 99;
  const grandTotal = summary.cartTotal + shippingCost;

  return (
    <main className="grow max-w-container-max mx-auto px-margin-mobile md:px-gutter py-10 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-on-surface font-medium">Checkout</span>
      </div>

      <h1 className="font-headline-lg text-3xl font-black text-on-surface mb-8">
        Checkout & Payment
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Address & Contact */}
        <div className="lg:col-span-8 space-y-6">
          {/* Saved Addresses Picker */}
          {!isLoadingAddresses && addresses.length > 0 && (
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
              <h2 className="font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-xl">
                  local_shipping
                </span>
                Select Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    onClick={() => handleAddressSelect(addr.id)}
                    className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? "border-primary-container bg-primary-container/5 ring-2 ring-primary-container/20"
                        : "border-outline-variant/40 bg-surface hover:border-outline-variant"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => handleAddressSelect(addr.id)}
                          className="accent-primary-container"
                        />
                        <span className="font-bold text-sm text-on-surface">
                          {addr.isDefault ? "Default Address" : "Saved Address"}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                  </label>
                ))}

                <label
                  onClick={() => handleAddressSelect("new")}
                  className={`flex items-center justify-center p-4 rounded-xl border border-dashed cursor-pointer transition-all ${
                    selectedAddressId === "new"
                      ? "border-primary-container bg-primary-container/5 text-primary-container font-bold"
                      : "border-outline-variant/60 text-on-surface-variant hover:border-primary-container"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-lg">add</span>
                    <span>Use a Different Address</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Shipping Form Fields */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <h2 className="font-bold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container text-xl">
                home_pin
              </span>
              Shipping Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 123 Fashion Avenue, Suite 400"
                  required
                  className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    required
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                    required
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400001"
                    required
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="India"
                    required
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none"
                />
              </div>

              {selectedAddressId === "new" && (
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={saveAddressForFuture}
                    onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                    className="accent-primary-container"
                  />
                  <span className="text-xs text-on-surface-variant">
                    Save this address to my profile for future orders
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-28 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-6">
            <h2 className="font-bold text-lg text-on-surface pb-3 border-b border-outline-variant/30">
              Order Review ({summary.totalItems} items)
            </h2>

            {/* Item Previews */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <span className="w-6 h-6 rounded-md bg-surface-variant flex items-center justify-center font-bold shrink-0">
                    {item.quantity}x
                  </span>
                  <span className="flex-1 truncate font-medium text-on-surface">
                    {item.variant.product.name}
                  </span>
                  <span className="font-bold text-on-surface shrink-0">
                    ₹{item.itemTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-outline-variant/20 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">
                  ₹{summary.cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">
                  {shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="h-px bg-outline-variant/30 my-2" />
              <div className="flex justify-between text-base font-black text-on-surface">
                <span>Total Amount</span>
                <span className="text-primary-container text-lg">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isProcessingOrder}
              className="w-full bg-primary text-on-primary font-bold py-6 rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isProcessingOrder ? (
                <span>Initializing Razorpay...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">lock</span>
                  <span>Pay with Razorpay (₹{grandTotal.toFixed(2)})</span>
                </>
              )}
            </Button>

            <div className="flex flex-col gap-1.5 text-[11px] text-center text-on-surface-variant">
              <span>Supports UPI, Debit/Credit Cards, Net Banking & Wallets</span>
              <span className="text-[10px] text-outline">
                Encrypted with 256-bit SSL for high security
              </span>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
