import type { Product } from "@/types/product";
export const productExtras: Record<string, { longDescription: string; dimensions: string; materials: string[] }> = {};

export const allProducts: Product[] = [];

export const bestSellers: Product[] = [];

export const productCategories: string[] = [];

export const productColors: string[] = [];

export const inspirationRooms = [
  { id: "1", label: "Living Room", subtitle: "Warm & inviting spaces" },
  { id: "2", label: "Dining", subtitle: "Gather around the table" },
  { id: "3", label: "Bedroom", subtitle: "Restful retreats" },
  { id: "4", label: "Office", subtitle: "Productive & stylish" },
  { id: "5", label: "Small Spaces", subtitle: "Make every corner count" },
  { id: "6", label: "Outdoor", subtitle: "Bring comfort outside" },
];

export const faqs = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery across Sri Lanka takes 5–10 business days. For Colombo metro, we offer express 2-day delivery on in-stock items. Custom orders may take 3–6 weeks depending on the piece.",
  },
  {
    q: "Do you offer custom sizes or dimensions?",
    a: "Yes. Most of our furniture lines can be customized in size, finish, and upholstery. Reach out to our design team with your requirements and we'll provide a quote within 48 hours.",
  },
  {
    q: "What warranty do your products carry?",
    a: "All Casa Ceylon furniture comes with a 2-year structural warranty covering manufacturing defects. Upholstery and finishes are covered for 1 year. Extended warranties are available at checkout.",
  },
  {
    q: "Can I choose different finishes or colors?",
    a: "Absolutely. We offer a curated palette of wood stains, fabric swatches, and metal finishes. You can preview combinations using our 'Try in Your Room' tool before ordering.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "We accept returns within 14 days of delivery for unused items in original packaging. Custom-made pieces are final sale. Exchanges for manufacturing issues are handled at no additional cost.",
  },
];
