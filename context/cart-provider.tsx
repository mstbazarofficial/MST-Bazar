// context/cart-provider.tsx
"use client";

import {
  clearServerCart,
  getDbCart,
  mutateCartItem,
  PopulatedCartItem,
  resolveGuestCart,
  syncGuestCartToDb,
} from "@/actions/main/cart-actions";
import { authClient } from "@/lib/auth-client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type CartState = {
  items: PopulatedCartItem[];
  isLoading: boolean;
  totalItems: number;
  subTotal: number;
  totalDiscount: number;
  totalPrice: number;
  errors: Record<string, string>;
  totalUniqueItems: number;
};

interface CartContextType extends CartState {
  addItem: (
    product: PopulatedCartItem["product"],
    productId: string,
    qty?: number,
  ) => void;
  updateQuantity: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  clearError: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const GUEST_CART_KEY = "guest_cart_v1";
const MAX_QTY = 10;
const SYNC_DEBOUNCE_MS = 500;
const SYNC_ERROR_MESSAGE = "Couldn't save. Try again.";

type LocalCartItem = { productId: string; quantity: number };

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [items, setItems] = useState<PopulatedCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const lastGoodItemsRef = useRef<PopulatedCartItem[]>([]);
  const syncTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  useEffect(() => {
    lastGoodItemsRef.current = items;
  }, [items]);

  const setItemError = useCallback((productId: string, message: string) => {
    setErrors((prev) => ({ ...prev, [productId]: message }));
  }, []);

  const clearError = useCallback((productId: string) => {
    setErrors((prev) => {
      if (!(productId in prev)) return prev;
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  // --- 1. Bootstrapping the Cart on Mount/Auth Change ---
  useEffect(() => {
    const initCart = async () => {
      setIsLoading(true);
      try {
        const rawLocal = localStorage.getItem(GUEST_CART_KEY);
        const localItems: LocalCartItem[] = rawLocal
          ? JSON.parse(rawLocal)
          : [];

        if (userId) {
          if (localItems.length > 0) {
            const mergedCart = await syncGuestCartToDb(localItems);
            setItems(mergedCart);
            localStorage.removeItem(GUEST_CART_KEY);
          } else {
            const dbCart = await getDbCart();
            setItems(dbCart);
          }
        } else {
          if (localItems.length > 0) {
            const populatedGuestCart = await resolveGuestCart(localItems);
            setItems(populatedGuestCart);
          } else {
            setItems([]);
          }
        }
      } catch (error) {
        console.error("Failed to init cart", error);
      } finally {
        setIsLoading(false);
      }
    };

    initCart();
  }, [userId]);

  // --- 2. Persist Guest Cart safely ---
  useEffect(() => {
    if (!userId && !isLoading) {
      const safeLocalData: LocalCartItem[] = items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      }));
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(safeLocalData));
    }
  }, [items, userId, isLoading]);

  // Debounced background sync with rollback + error tagging on failure.
  const scheduleSync = useCallback(
    (productId: string, quantity: number) => {
      if (!userId) return;

      const timers = syncTimersRef.current;
      const existingTimer = timers.get(productId);
      if (existingTimer) clearTimeout(existingTimer);

      const timer = setTimeout(async () => {
        timers.delete(productId);
        try {
          await mutateCartItem(productId, quantity);
          clearError(productId);
        } catch (error) {
          console.error("Failed to sync cart item, rolling back", error);
          setItemError(productId, SYNC_ERROR_MESSAGE);
          setItems((prev) => {
            const lastGood = lastGoodItemsRef.current.find(
              (i) => i.productId === productId,
            );
            const withoutProduct = prev.filter(
              (i) => i.productId !== productId,
            );
            return lastGood ? [...withoutProduct, lastGood] : withoutProduct;
          });
        }
      }, SYNC_DEBOUNCE_MS);

      timers.set(productId, timer);
    },
    [userId, clearError, setItemError],
  );

  useEffect(() => {
    const timers = syncTimersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  // --- 3. Core Actions (Optimistic UI) ---

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((i) => i.productId !== productId));

      if (userId) {
        const timers = syncTimersRef.current;
        const existingTimer = timers.get(productId);
        if (existingTimer) clearTimeout(existingTimer);
        timers.delete(productId);
        mutateCartItem(productId, 0)
          .then(() => clearError(productId))
          .catch((error) => {
            console.error("Failed to remove cart item, rolling back", error);
            setItemError(productId, SYNC_ERROR_MESSAGE);
            setItems((prev) => {
              const lastGood = lastGoodItemsRef.current.find(
                (i) => i.productId === productId,
              );
              if (!lastGood || prev.some((i) => i.productId === productId))
                return prev;
              return [...prev, lastGood];
            });
          });
      }
    },
    [userId, clearError, setItemError],
  );

  const addItem = useCallback(
    (product: PopulatedCartItem["product"], productId: string, qty = 1) => {
      clearError(productId);
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        const newQty = Math.min((existing?.quantity || 0) + qty, MAX_QTY);

        const newItems = existing
          ? prev.map((i) =>
              i.productId === productId ? { ...i, quantity: newQty } : i,
            )
          : [
              ...prev,
              {
                id: `local-${productId}`,
                productId,
                quantity: newQty,
                product,
              },
            ];

        scheduleSync(productId, newQty);
        return newItems;
      });
    },
    [scheduleSync, clearError],
  );

  const updateQuantity = useCallback(
    (productId: string, qty: number) => {
      if (qty <= 0) {
        removeItem(productId);
        return;
      }

      clearError(productId);
      setItems((prev) => {
        const newQty = Math.min(qty, MAX_QTY);
        const newItems = prev.map((i) =>
          i.productId === productId ? { ...i, quantity: newQty } : i,
        );

        scheduleSync(productId, newQty);
        return newItems;
      });
    },
    [removeItem, scheduleSync, clearError],
  );

  const clearCart = useCallback(() => {
    syncTimersRef.current.forEach((t) => clearTimeout(t));
    syncTimersRef.current.clear();

    setItems([]);
    setErrors({});
    if (userId) {
      clearServerCart().catch(console.error);
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
    }
  }, [userId]);

  const { totalItems, totalUniqueItems, subTotal, totalDiscount, totalPrice } =
    useMemo(() => {
      const totals = items.reduce(
        (acc, item) => {
          const itemPrice = item.product.price;
          const discountAmount =
            itemPrice * (item.product.discountPercentage / 100);
          const finalItemPrice = itemPrice - discountAmount;

          acc.totalItems += item.quantity;
          acc.subTotal += itemPrice * item.quantity;
          acc.totalDiscount += discountAmount * item.quantity;
          acc.totalPrice += finalItemPrice * item.quantity;

          return acc;
        },
        {
          totalItems: 0,
          subTotal: 0,
          totalDiscount: 0,
          totalPrice: 0,
        },
      );

      return {
        ...totals,
        totalUniqueItems: items.length,
      };
    }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        totalItems,
        subTotal,
        totalDiscount,
        totalPrice,
        errors,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        clearError,
        totalUniqueItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}

// Lightweight selector so a single product's button doesn't need to
// destructure the whole cart just to read its own error.
export function useCartItemError(productId: string) {
  const { errors, clearError } = useCart();
  return { error: errors[productId], clearError: () => clearError(productId) };
}
