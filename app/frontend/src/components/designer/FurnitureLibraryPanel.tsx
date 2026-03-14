import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Armchair, Plus, Check, Sofa, UtensilsCrossed, Lamp, BedDouble, DoorOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types/product";

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

const FurnitureLibraryPanel = () => {
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
