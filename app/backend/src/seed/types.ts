export interface ProductSeed {
  name: string;
  price: number;
  category: string;
  tag?: string;
  description: string;
  colors: string[];
  images: string[];
  isNew?: boolean;
  popularity: number;
  longDescription?: string;
  dimensions?: string;
  materials?: string[];
}

export type ProductExtras = Record<string, { longDescription: string; dimensions: string; materials: string[] }>;
