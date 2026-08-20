import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, CartSummary } from "../types/commerce.types";
import * as cartService from "../api/services/cart.service";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface CartContextValue {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    totalItems: 0,
    cartTotal: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setSummary({ totalItems: 0, cartTotal: 0 });
      return;
    }

    try {
      setIsLoading(true);
      const res = await cartService.getCart();
      if (res.success && res.data) {
        setItems(res.data.items || []);
        setSummary(res.data.summary || { totalItems: 0, cartTotal: 0 });
      }
    } catch {
      // User might be unauthorized or cart empty
      setItems([]);
      setSummary({ totalItems: 0, cartTotal: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Sync cart when authentication changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (variantId: string, quantity = 1): Promise<boolean> => {
      if (!isAuthenticated) {
        toast.error("Please sign in to add items to your cart");
        return false;
      }

      try {
        const res = await cartService.addToCart({ variantId, quantity });
        if (res.success) {
          toast.success("Added to cart!");
          await refreshCart();
          setIsCartOpen(true);
          return true;
        }
        return false;
      } catch (err: any) {
        toast.error(err.message || "Failed to add item to cart");
        return false;
      }
    },
    [isAuthenticated, refreshCart]
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }

      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity,
                itemTotal:
                  Number(item.variant.price || item.variant.product.basePrice) *
                  quantity,
              }
            : item
        )
      );

      try {
        await cartService.updateCartItem(cartItemId, { quantity });
        await refreshCart();
      } catch (err: any) {
        toast.error(err.message || "Failed to update quantity");
        await refreshCart();
      }
    },
    [refreshCart]
  );

  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      // Optimistic removal
      setItems((prev) => prev.filter((item) => item.id !== cartItemId));

      try {
        await cartService.removeCartItem(cartItemId);
        toast.success("Item removed from cart");
        await refreshCart();
      } catch (err: any) {
        toast.error(err.message || "Failed to remove item");
        await refreshCart();
      }
    },
    [refreshCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      setItems([]);
      setSummary({ totalItems: 0, cartTotal: 0 });
      toast.success("Cart cleared");
    } catch (err: any) {
      toast.error(err.message || "Failed to clear cart");
    }
  }, []);

  const value: CartContextValue = {
    items,
    summary,
    isLoading,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return context;
}
