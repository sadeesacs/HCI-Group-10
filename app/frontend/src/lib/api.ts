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
    method?: "GET" | "POST";
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
  } = {}
): Promise<T> {
  const { method = "GET", params, body } = options;
  const url = buildUrl(path, params);

  const res = await fetch(url.toString(), {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
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
