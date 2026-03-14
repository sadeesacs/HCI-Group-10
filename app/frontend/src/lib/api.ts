import type { Product } from "@/types/product";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ListParams = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "popular" | "new" | "price-asc" | "price-desc";
};

async function fetchJson<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchProducts(params?: ListParams): Promise<Product[]> {
  return fetchJson<Product[]>("/products", params);
}

export async function fetchProduct(id: string): Promise<Product> {
  return fetchJson<Product>(`/products/${id}`);
}
