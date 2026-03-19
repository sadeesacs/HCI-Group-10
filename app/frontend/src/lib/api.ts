import type { Product } from "@/types/product";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ListParams = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "popular" | "new" | "price-asc" | "price-desc";
};

export type AuthResponse = {
  user: { id: string; name: string; email: string };
  token: string;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  selectedColor?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId?: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    notes?: string;
    location: { lat: number; lng: number };
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "cash-on-delivery" | "online-mock";
  status: "placed" | "paid" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

export type CheckoutPayload = {
  customer: { name: string; email: string; phone: string };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    notes?: string;
    location: { lat: number; lng: number };
  };
  items: Array<{ productId: string; quantity: number; selectedColor?: string }>;
  paymentMethod: "cash-on-delivery" | "online-mock";
  userId?: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

function buildUrl(path: string, params?: Record<string, unknown>): URL {
  const base = API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`;
  const normalizedPath = path.replace(/^\//, "");
  const url = new URL(normalizedPath, base);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  return url;
}

async function requestJson<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    params?: Record<string, unknown>;
    body?: Record<string, unknown> | Array<unknown>;
    token?: string;
  } = {}
): Promise<T> {
  const { method = "GET", params, body, token } = options;
  const url = buildUrl(path, params);

  const headers: Record<string, string> = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers: Object.keys(headers).length ? headers : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof payload === "string" ? payload : payload?.message;
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  return payload as T;
}

export async function fetchProducts(params?: ListParams): Promise<Product[]> {
  return requestJson<Product[]>("/products", { params });
}

export async function fetchProduct(id: string): Promise<Product> {
  return requestJson<Product>(`/products/${id}`);
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return requestJson<AuthResponse>("/auth/register", { method: "POST", body: payload });
}

export async function loginUser(payload: { email: string; password: string }): Promise<AuthResponse> {
  return requestJson<AuthResponse>("/auth/login", { method: "POST", body: payload });
}

export async function createCheckout(payload: CheckoutPayload): Promise<{ order: Order; message: string }> {
  return requestJson<{ order: Order; message: string }>("/checkout", { method: "POST", body: payload });
}

export async function fetchOrder(orderNumber: string): Promise<{ order: Order }> {
  return requestJson<{ order: Order }>(`/checkout/${orderNumber}`);
}

export async function submitContact(payload: ContactPayload): Promise<{ message: string }> {
  return requestJson<{ message: string }>("/contact", { method: "POST", body: payload });
}

/* ── Design API ── */

export interface DesignResponse {
  id: string;
  slotIndex: number;
  name: string;
  roomConfig: Record<string, unknown>;
  items: Array<Record<string, unknown>>;
  createdAt: string;
  updatedAt: string;
}

export async function fetchDesigns(token: string): Promise<{ designs: DesignResponse[] }> {
  return requestJson<{ designs: DesignResponse[] }>("/designs", { token });
}

export async function saveDesign(
  token: string,
  slotIndex: number,
  data: { name: string; roomConfig: unknown; items: unknown[] }
): Promise<{ design: DesignResponse }> {
  return requestJson<{ design: DesignResponse }>(`/designs/${slotIndex}`, {
    method: "PUT",
    body: data as Record<string, unknown>,
    token,
  });
}

export async function deleteDesignApi(token: string, slotIndex: number): Promise<{ message: string }> {
  return requestJson<{ message: string }>(`/designs/${slotIndex}`, {
    method: "DELETE",
    token,
  });
}

export async function renameDesignApi(
  token: string,
  slotIndex: number,
  name: string
): Promise<{ design: DesignResponse }> {
  return requestJson<{ design: DesignResponse }>(`/designs/${slotIndex}/rename`, {
    method: "PATCH",
    body: { name },
    token,
  });
}
