import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/button";

export function CartDrawer() {
  const { isCartOpen, closeCart, items, summary, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Prevent background scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-110 max-w-[95vw] bg-white dark:bg-[#14141d] border-l border-outline-variant/40 shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-xl">
                shopping_bag
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                Shopping Cart
              </h2>
              <p className="text-[11px] text-on-surface-variant font-medium">
                {summary.totalItems} {summary.totalItems === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-full bg-surface-variant/80 hover:bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 divide-y divide-transparent">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-4 text-outline">
                <span className="material-symbols-outlined text-4xl">shopping_cart</span>
              </div>
              <h3 className="font-bold text-on-surface text-base mb-1.5">Your cart is empty</h3>
              <p className="text-xs text-on-surface-variant w-full max-w-70 mx-auto mb-6 leading-relaxed text-center">
                Looks like you haven't added anything to your cart yet. Explore our latest arrivals!
              </p>
              <Button
                onClick={() => {
                  closeCart();
                  navigate("/shop");
                }}
                className="bg-primary-container text-on-primary font-bold px-6 py-2.5 rounded-xl hover:bg-primary transition-all cursor-pointer"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const product = item.variant.product;
              const primaryImage =
                product.images?.find((img) => img.isPrimary)?.url ||
                product.images?.[0]?.url ||
                "https://placehold.co/400x500/f6ded2/584235?text=No+Image";
              const unitPrice = Number(item.variant.price || product.basePrice || 0);

              return (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-surface border border-outline-variant/40 shadow-xs transition-all hover:border-primary-container/40"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${product.id}`}
                    onClick={closeCart}
                    className="w-20 h-24 rounded-xl overflow-hidden bg-surface-variant shrink-0 relative block"
                  >
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${product.id}`}
                          onClick={closeCart}
                          className="font-semibold text-sm text-on-surface hover:text-primary transition-colors truncate block"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-on-surface-variant hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                          aria-label={`Remove ${product.name} from cart`}
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>

                      {/* Variant Attributes */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
                        {item.variant.size && (
                          <span className="bg-surface-container px-1.5 py-0.5 rounded font-medium">
                            Size: {item.variant.size.name}
                          </span>
                        )}
                        {item.variant.color && (
                          <span className="bg-surface-container px-1.5 py-0.5 rounded font-medium">
                            Color: {item.variant.color.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Quantity Stepper */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/20">
                      <span className="font-bold text-sm text-primary-container">
                        ₹{unitPrice.toFixed(2)}
                      </span>

                      <div className="flex items-center border border-outline-variant/50 rounded-lg bg-surface-container-lowest h-8">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors text-sm cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-on-surface">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors text-sm cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 bg-surface-container-low border-t border-outline-variant/30 space-y-4 shrink-0">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">
                  ₹{summary.cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">
                  {summary.cartTotal >= 999 ? "FREE" : "₹99.00"}
                </span>
              </div>
              <div className="h-px bg-outline-variant/30 my-2" />
              <div className="flex justify-between text-base font-bold text-on-surface">
                <span>Estimated Total</span>
                <span className="text-primary-container text-lg font-black">
                  ₹{(summary.cartTotal + (summary.cartTotal >= 999 ? 0 : 99)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => {
                  closeCart();
                  navigate("/checkout");
                }}
                className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  closeCart();
                  navigate("/cart");
                }}
                className="w-full border-outline-variant/60 font-semibold text-xs py-2.5 rounded-xl hover:bg-surface-variant transition-colors cursor-pointer"
              >
                View Full Cart
              </Button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
