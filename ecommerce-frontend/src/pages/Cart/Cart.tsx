import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Button } from "../../components/ui/button";

export function Cart() {
  const { items, summary, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();
  const navigate = useNavigate();

  if (isLoading && items.length === 0) {
    return (
      <main className="grow flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary-container">
            progress_activity
          </span>
          <p className="text-sm text-on-surface-variant">Loading your cart...</p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="grow max-w-container-max mx-auto px-margin-mobile md:px-gutter py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-6 text-outline">
          <span className="material-symbols-outlined text-5xl">shopping_cart</span>
        </div>
        <h1 className="font-headline-md text-2xl font-bold text-on-surface mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-on-surface-variant max-w-md mb-8">
          Explore our wide range of premium apparel, tech, footwear, and home essentials to find something you love.
        </p>
        <Button asChild className="bg-primary-container text-on-primary font-bold px-8 py-6 rounded-xl hover:bg-primary">
          <Link to="/shop">Explore Catalog</Link>
        </Button>
      </main>
    );
  }

  const shippingCost = summary.cartTotal >= 999 ? 0 : 99;
  const grandTotal = summary.cartTotal + shippingCost;

  return (
    <main className="grow max-w-container-max mx-auto px-margin-mobile md:px-gutter py-10 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-on-surface font-medium">Cart</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-3xl font-black text-on-surface">
            Shopping Cart
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {summary.totalItems} {summary.totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <Button
          variant="outline"
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const product = item.variant.product;
            const primaryImage =
              product.images?.find((img) => img.isPrimary)?.url ||
              product.images?.[0]?.url ||
              "https://placehold.co/400x500/f6ded2/584235?text=No+Image";
            const unitPrice = Number(item.variant.price || product.basePrice || 0);

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Link
                    to={`/product/${product.id}`}
                    className="w-24 h-28 rounded-xl overflow-hidden bg-surface-variant shrink-0"
                  >
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0">
                    <Link
                      to={`/product/${product.id}`}
                      className="font-bold text-base text-on-surface hover:text-primary transition-colors block truncate"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-on-surface-variant">
                      {item.variant.size && (
                        <span className="bg-surface-container px-2 py-0.5 rounded-md font-medium">
                          Size: {item.variant.size.name}
                        </span>
                      )}
                      {item.variant.color && (
                        <span className="bg-surface-container px-2 py-0.5 rounded-md font-medium">
                          Color: {item.variant.color.name}
                        </span>
                      )}
                    </div>

                    <p className="font-bold text-sm text-primary-container mt-2">
                      ₹{unitPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-variant/20">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-outline-variant/50 rounded-lg bg-surface h-9">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-on-surface">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Total & Remove */}
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm text-on-surface min-w-[70px] text-right">
                      ₹{item.itemTotal.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-on-surface-variant hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                      title="Remove item"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-6">
            <h2 className="font-bold text-lg text-on-surface pb-3 border-b border-outline-variant/30">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Items Subtotal</span>
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
              {shippingCost > 0 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg">
                  Add ₹{(999 - summary.cartTotal).toFixed(2)} more to qualify for FREE Shipping!
                </p>
              )}
              <div className="h-px bg-outline-variant/30 my-3" />
              <div className="flex justify-between text-base font-black text-on-surface">
                <span>Total Amount</span>
                <span className="text-primary-container text-lg">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/checkout")}
              className="w-full bg-primary text-on-primary font-bold py-6 rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Button>

            <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
                100% Secure Checkout
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-emerald-600">sync</span>
                Easy 30-Day Returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
