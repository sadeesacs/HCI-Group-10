export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  tag?: string;
  description: string;
  longDescription?: string;
  dimensions?: string;
  materials?: string[];
  colors: string[];
  images: string[];
  isNew?: boolean;
  popularity: number;
}
