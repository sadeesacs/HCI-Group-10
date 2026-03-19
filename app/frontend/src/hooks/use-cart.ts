import { useMemo, useSyncExternalStore } from "react";

const CART_KEY = "casa-cart-v1";

export type CartEntry = {
  productId: string;
  quantity: number;
  selectedColor?: string;
};

let cartCache: CartEntry[] | null = null;

function normalize(entries: unknown): CartEntry[] {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((item) => ({
      productId: String((item as any)?.productId),
      quantity: Math.max(1, Number((item as any)?.quantity) || 1),
      selectedColor: (item as any)?.selectedColor ? String((item as any)?.selectedColor) : undefined,
    }))
    .filter((item) => item.productId);
}

function loadCartFromStorage(): CartEntry[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return normalize(JSON.parse(raw));
  } catch {
    return [];
  }
}

function getSnapshot(): CartEntry[] {
  if (cartCache === null) {
    cartCache = loadCartFromStorage();
  }
  return cartCache;
}

function writeCart(entries: CartEntry[]) {
  cartCache = entries;
  localStorage.setItem(CART_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("cart-changed"));
}

function subscribe(listener: () => void) {
  const storageHandler = (e: StorageEvent) => {
    if (e.key === CART_KEY) {
      cartCache = loadCartFromStorage();
      listener();
    }
  };
  const cartChanged = () => listener();
  window.addEventListener("storage", storageHandler);
  window.addEventListener("cart-changed", cartChanged);
  return () => {
    window.removeEventListener("storage", storageHandler);
    window.removeEventListener("cart-changed", cartChanged);
  };
}

export function useCart() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, () => []);

  const api = useMemo(() => {
    const persist = (next: CartEntry[]) => writeCart(next);

    const addItem = (productId: string, options?: { quantity?: number; selectedColor?: string }) => {
      const qty = Math.max(1, options?.quantity ?? 1);
      const color = options?.selectedColor;
      const current = getSnapshot();
      const existing = current.find((c) => c.productId === productId && c.selectedColor === color);
      let next: CartEntry[];
      if (existing) {
        next = current.map((c) =>
          c === existing ? { ...c, quantity: c.quantity + qty } : c
        );
      } else {
        next = [...current, { productId, quantity: qty, selectedColor: color }];
      }
      persist(next);
    };

    const updateQuantity = (productId: string, quantity: number, selectedColor?: string) => {
      const qty = Math.max(1, quantity);
      const next = getSnapshot().map((c) =>
        c.productId === productId && c.selectedColor === selectedColor ? { ...c, quantity: qty } : c
      );
      persist(next);
    };

    const removeItem = (productId: string, selectedColor?: string) => {
      const next = getSnapshot().filter(
        (c) => !(c.productId === productId && c.selectedColor === selectedColor)
      );
      persist(next);
    };

    const clear = () => persist([]);

    const totalQuantity = entries.reduce((sum, item) => sum + item.quantity, 0);

    return { entries, addItem, updateQuantity, removeItem, clear, totalQuantity };
  }, [entries]);

  return api;
}