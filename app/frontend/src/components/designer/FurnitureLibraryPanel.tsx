import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Armchair, Plus, Check, Sofa, UtensilsCrossed, Lamp, BedDouble, DoorOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types/product";
import type { PlacedFurniture } from "@/components/designer/RoomCanvas2D";

/* ─── Local furniture catalog (GLB-backed items) ─── */
export interface DragFurnitureTemplate {
  name: string;
  widthM: number;
  depthM: number;
  color: string;
  glbPath: string;
  label: string;
}

const LOCAL_CATALOG: Array<DragFurnitureTemplate & { id: string; image: string; price?: number; category: string }> = [
  {
    id: "kandy-lounge-chair",
    name: "Kandy Lounge Chair",
    category: "Seating",
    widthM: 0.8,
    depthM: 0.85,
    color: "#D4B896",
    glbPath: "/models/kandy.glb",
    label: "Kandy",
    image: "/assets/products/chairs/mid-century-armchair-1.jpg",
    price: 45000,
  },
];

const PX_PER_M_BASE = 120; // matches Room3DPreview constant
const CATEGORY_ICONS: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
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

interface FurnitureLibraryPanelProps {
  onAddFurniture?: (item: PlacedFurniture) => void;
}

const FurnitureLibraryPanel = ({ onAddFurniture }: FurnitureLibraryPanelProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts({ sort: "popular" });
        setProducts(data);
        const defaultCategory = data.find((p) => p.category && p.category !== "Lighting")?.category ?? "";
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
    const names = Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[];
    return names.filter((name) => name !== "Lighting");
  }, [products]);

  const filtered = useMemo(
    () => products.filter((p) => (activeCategory ? p.category === activeCategory : true)),
    [products, activeCategory]
  );

  const handleAdd = (item: Product) => {
    setAddedIds((prev) => new Set(prev).add(item.id));
    const description = item.price ? formatPrice(item.price) : undefined;
    toast.success(`${item.name} added to room`, { description });
  };

  const handleDragStart = (e: React.DragEvent, item: DragFurnitureTemplate) => {
    const payload: DragFurnitureTemplate = {
      name: item.name,
      widthM: item.widthM,
      depthM: item.depthM,
      color: item.color,
      glbPath: item.glbPath,
      label: item.label,
    };
    e.dataTransfer.setData("application/furniture", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleLocalAdd = (item: typeof LOCAL_CATALOG[0]) => {
    if (!onAddFurniture) return;
    const w = Math.round(item.widthM * PX_PER_M_BASE);
    const h = Math.round(item.depthM * PX_PER_M_BASE);
    onAddFurniture({
      id: `p${Date.now()}`,
      name: item.name,
      x: 60,
      y: 60,
      width: w,
      height: h,
      rotation: 0,
      color: item.color,
      label: item.label,
      glbPath: item.glbPath,
    });
    toast.success(`${item.name} added to room`, {
      description: item.price ? formatPrice(item.price) : undefined,
    });
  };

  return (
    <div className="rounded-lg border border-border bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Armchair size={14} className="text-muted-foreground" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/70">Furniture</span>
      </div>

      <div className="border-t border-border px-3 pb-3 pt-2.5">
                {/* ── Local Seating Section (GLB models) ── */}
                <div className="mb-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Featured</p>
                  {LOCAL_CATALOG.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="group flex gap-2 rounded-md border border-[hsl(28,35%,32%)/30] bg-[hsl(28,35%,32%)/5] p-1.5 transition-all hover:bg-accent/50 hover:shadow-sm cursor-grab active:cursor-grabbing"
                      title="Drag into the room canvas to place"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-accent">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
                        <div>
                          <p className="truncate text-[11px] font-medium text-foreground leading-tight">{item.name}</p>
                          {item.price && (
                            <p className="text-[10px] text-muted-foreground">{formatPrice(item.price)}</p>
                          )}
                          <p className="text-[9px] text-muted-foreground/70 mt-0.5">
                            {item.widthM * 100}cm × {item.depthM * 100}cm · 3D model
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleLocalAdd(item)}
                          disabled={!onAddFurniture}
                          className="h-5 w-full gap-1 text-[9px] font-medium rounded bg-[hsl(28,35%,32%)] text-white hover:bg-[hsl(28,35%,26%)]"
                        >
                          <Plus size={8} strokeWidth={2.5} />Add to Room
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-3 border-t border-border pt-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Catalogue</p>
                </div>

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
              const added = addedIds.has(item.id);
              const image = getImage(item);
              return (
                <div
                  key={item.id}
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
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(item)}
                      disabled={added}
                      className={`h-5 w-full gap-1 text-[9px] font-medium rounded ${
                        added
                          ? "bg-accent text-muted-foreground cursor-default"
                          : "bg-[hsl(28,35%,32%)] text-white hover:bg-[hsl(28,35%,26%)]"
                      }`}
                    >
                      {added ? <><Check size={8} strokeWidth={2.5} />Added</> : <><Plus size={8} strokeWidth={2.5} />Add</>}
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
