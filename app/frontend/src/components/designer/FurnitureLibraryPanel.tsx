import { useEffect, useMemo, useState } from "react";
import { Armchair, Plus, Sofa, UtensilsCrossed, Lamp, BedDouble, DoorOpen, Loader2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types/product";
import type { PlacedFurniture } from "@/types/designer";

/* ─── Local furniture catalog (GLB-backed items) ─── */
export interface DragFurnitureTemplate {
  name: string;
  widthM: number;
  depthM: number;
  heightM: number;
  color: string;
  glbPath: string;
  label: string;
  cushionColor?: string;
  price?: number;
  productId?: string;
  image?: string;
}

/** Product IDs that have GLB models in /models/{id}.glb */
const GLB_PRODUCT_IDS = new Set([
  "69b4ddcde8135ff7a1a1503f", // Kandy Lounge Chair
  "69b4ddcde8135ff7a1a15040",
  "69b4ddcde8135ff7a1a15045",
  "69b4ddcde8135ff7a1a1504b",
  "69b4ddcde8135ff7a1a15050",
  "69b4ddcde8135ff7a1a15077", // Lounge Chair with Ottoman
  "69b4ddcde8135ff7a1a15047", // Dambulla Sofa
  "69b4ddcde8135ff7a1a15070", // Mid-Century Teak Armchair
  "69b4ddcde8135ff7a1a1505d", // Bouclé Cloud Sofa
  "69b4ddcde8135ff7a1a1505c", // Mid-Century Teak Frame Sofa
  "69b4ddcde8135ff7a1a1505e", // Minimalist Daybed
  "69b4ddcde8135ff7a1a15062", // Scandinavian 2-Seater Sofa
  "69b4ddcde8135ff7a1a15064",
  "69b4ddcde8135ff7a1a1506a",
  "69b4ddcde8135ff7a1a15080",
  "69b4ddcde8135ff7a1a15087",
]);

const hasGlbModel = (productId: string) => GLB_PRODUCT_IDS.has(productId);
const glbPathFor = (productId: string) => `/models/${productId}.glb`;

const PX_PER_M_BASE = 120; // matches Room3DPreview constant
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Sofas: Sofa,
  Seating: Armchair,
  Chairs: Armchair,
  Dining: UtensilsCrossed,
  Tables: UtensilsCrossed,
  Beds: BedDouble,
  Storage: DoorOpen,
  Wardrobes: DoorOpen,
  Lighting: Lamp,
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(value);

const getImage = (product: Product) => product.images?.[0] ?? "/assets/products/chair-1.jpg";

const COLOR_NAME_MAP: Record<string, string> = {
  beige: "#D4B896", charcoal: "#3C3C3C", olive: "#6B7E3C", cream: "#FFF8E7",
  sage: "#8B9E7E", "natural oak": "#C4A86B", walnut: "#5C4033", cherry: "#8B2252",
  brass: "#B5A642", "matte black": "#2A2A2A", natural: "#C8B078", black: "#1A1A1A",
  emerald: "#2E8B57", navy: "#2C3E5A", burgundy: "#800020", cognac: "#9A5B3D",
  tan: "#D2B48C", ivory: "#FFFFF0", "dusty rose": "#C9A0A0", teal: "#4A7C7E",
  grey: "#808080", "light grey": "#C0C0C0", white: "#F5F5F5", mustard: "#C9A83E",
  "natural ash": "#D4C5A9", "walnut stain": "#5C4033", "honey stain": "#C9982A",
};

const colorToHex = (name: string): string =>
  COLOR_NAME_MAP[name.toLowerCase()] ?? "#A0896C";

interface FurnitureLibraryPanelProps {
  onAddFurniture?: (item: PlacedFurniture) => void;
}

const FurnitureLibraryPanel = ({ onAddFurniture }: FurnitureLibraryPanelProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const glbProducts = useMemo(
    () => products.filter((p) => hasGlbModel(p.id)),
    [products],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts({ sort: "popular" });
        setProducts(data);
        const defaultCategory = data.find((p) => hasGlbModel(p.id) && p.category && p.category !== "Lighting")?.category ?? "";
        setActiveCategory(defaultCategory);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load furniture";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const categories = useMemo(() => {
    const names = Array.from(new Set(glbProducts.map((p) => p.category).filter(Boolean))) as string[];
    return names.filter((name) => name !== "Lighting");
  }, [glbProducts]);

  const filtered = useMemo(
    () => glbProducts.filter((p) => (activeCategory ? p.category === activeCategory : true)),
    [glbProducts, activeCategory]
  );

  /* Parse product dimensions like "W 220 cm × D 92 cm × H 84 cm" or "220 x 92 x 84 cm" */
  const parseDimsCm = (dims?: string): { lengthCm: number; widthCm: number; heightCm: number } => {
    const defaults = { lengthCm: 60, widthCm: 60, heightCm: 80 };
    if (!dims) return defaults;

    const firstSentence = dims.split(".")[0] ?? dims;
    const read = (pattern: RegExp) => {
      const match = firstSentence.match(pattern);
      return match ? Number(match[1]) : null;
    };

    const lengthLabel = read(/(?:W|L)\s*(\d+(?:\.\d+)?)\s*cm/i);
    const widthLabel = read(/D\s*(\d+(?:\.\d+)?)\s*cm/i);
    const heightLabel = read(/H\s*(\d+(?:\.\d+)?)\s*cm/i);

    if (lengthLabel && widthLabel && heightLabel) {
      return {
        lengthCm: lengthLabel,
        widthCm: widthLabel,
        heightCm: heightLabel,
      };
    }

    // Fallback: parse first 3 cm values in order (L/W, D, H)
    const ordered = [...firstSentence.matchAll(/(\d+(?:\.\d+)?)\s*cm/gi)]
      .slice(0, 3)
      .map((m) => Number(m[1]));

    if (ordered.length >= 3) {
      return {
        lengthCm: ordered[0],
        widthCm: ordered[1],
        heightCm: ordered[2],
      };
    }

    return defaults;
  };

  const handleAdd = (item: Product) => {
    if (!onAddFurniture) return;
    const { lengthCm, widthCm, heightCm } = parseDimsCm(item.dimensions);
    const wM = lengthCm / 100;
    const dM = widthCm / 100;
    const hM = heightCm / 100;
    const w = Math.round(wM * PX_PER_M_BASE);
    const h = Math.round(dM * PX_PER_M_BASE);
    const image = getImage(item);
    const glbPath = hasGlbModel(item.id) ? glbPathFor(item.id) : undefined;
    onAddFurniture({
      id: `p${Date.now()}`,
      name: item.name,
      x: 60,
      y: 60,
      width: w,
      height: h,
      heightM: hM,
      rotation: 0,
      color: item.colors?.[0] ? colorToHex(item.colors[0]) : "#A0896C",
      label: item.name.split(" ").map((w) => w[0]).join("").slice(0, 3),
      price: item.price,
      productId: item.id,
      image,
      glbPath,
      cushionColor: glbPath ? (item.colors?.[0] ? colorToHex(item.colors[0]) : "#D4B896") : undefined,
    });
    toast.success(`${item.name} added to room`, { description: formatPrice(item.price) });
  };

  const handleDragStart = (e: React.DragEvent, item: Product) => {
    const { lengthCm, widthCm, heightCm } = parseDimsCm(item.dimensions);
    const payload: DragFurnitureTemplate = {
      name: item.name,
      widthM: lengthCm / 100,
      depthM: widthCm / 100,
      heightM: heightCm / 100,
      color: item.colors?.[0] ? colorToHex(item.colors[0]) : "#A0896C",
      glbPath: glbPathFor(item.id),
      label: item.name.split(" ").map((w) => w[0]).join("").slice(0, 3),
      cushionColor: item.colors?.[0] ? colorToHex(item.colors[0]) : "#D4B896",
      price: item.price,
      productId: item.id,
      image: getImage(item),
    };
    e.dataTransfer.setData("application/furniture", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="rounded-lg border border-border bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Armchair size={14} className="text-muted-foreground" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/70">Furniture</span>
      </div>

      <div className="border-t border-border px-3 pb-3 pt-2.5">

        {/* Category chips */}
        <div className="mb-3 flex flex-wrap gap-1">
          {categories.map((name) => {
            const Icon = CATEGORY_ICONS[name] ?? Armchair;
            const active = activeCategory === name;
            return (
              <button
                key={name}
                onClick={() => setActiveCategory(name)}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                  active
                    ? "bg-[hsl(28,35%,32%)] text-white"
                    : "bg-accent text-muted-foreground hover:bg-accent/80 hover:text-foreground"
                }`}
                aria-pressed={active}
              >
                <Icon size={10} strokeWidth={active ? 2 : 1.5} />
                {name}
              </button>
            );
          })}
        </div>

        {/* Product cards */}
        <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-0.5">
          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-1 py-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading furniture...
            </div>
          )}

          {error && !loading && (
            <div className="text-xs text-destructive px-1 py-2">{error}</div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-xs text-muted-foreground px-1 py-2">No products available for this category.</div>
          )}

          {!loading && !error &&
            filtered.map((item) => {
              const image = getImage(item);
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="group flex gap-2 rounded-md border border-border bg-background p-1.5 transition-all hover:bg-accent/50 hover:shadow-sm"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-accent">
                    <img src={image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
                    <div>
                      <p className="truncate text-[11px] font-medium text-foreground leading-tight">{item.name}</p>
                      {item.price && (
                        <p className="text-[10px] text-muted-foreground">{formatPrice(item.price)}</p>
                      )}
                      {item.dimensions && (
                        <p className="text-[9px] text-muted-foreground/70 mt-0.5 truncate">{item.dimensions.split(".")[0]}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(item)}
                      disabled={!onAddFurniture}
                      className="h-5 w-full gap-1 text-[9px] font-medium rounded bg-[hsl(28,35%,32%)] text-white hover:bg-[hsl(28,35%,26%)]"
                    >
                      <Plus size={8} strokeWidth={2.5} />Add
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default FurnitureLibraryPanel;
