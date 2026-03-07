import { useState } from "react";
import { Armchair, Plus, Check, Sofa, UtensilsCrossed, Lamp, BedDouble, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import chair1 from "@/assets/products/chair-1.jpg";
import armchair1 from "@/assets/products/armchair-1.jpg";
import table1 from "@/assets/products/table-1.jpg";
import console1 from "@/assets/products/console-1.jpg";
import lamp1 from "@/assets/products/lamp-1.jpg";
import pendant1 from "@/assets/products/pendant-1.jpg";
import bookshelf1 from "@/assets/products/bookshelf-1.jpg";
import bedside1 from "@/assets/products/bedside-1.jpg";

const CATEGORIES = [
  { id: "sofas", label: "Sofas", icon: Sofa },
  { id: "chairs", label: "Chairs", icon: Armchair },
  { id: "dining", label: "Tables", icon: UtensilsCrossed },
  { id: "side", label: "Side", icon: Lamp },
  { id: "beds", label: "Beds", icon: BedDouble },
  { id: "wardrobes", label: "Storage", icon: DoorOpen },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface FurnitureItem {
  id: string;
  name: string;
  price: string;
  category: CategoryId;
  image: string;
}

const MOCK_PRODUCTS: FurnitureItem[] = [
  { id: "f1", name: "Nordic Sofa", price: "LKR 128,500", category: "sofas", image: armchair1 },
  { id: "f2", name: "Soft Curve Sofa", price: "LKR 145,000", category: "sofas", image: chair1 },
  { id: "f3", name: "Linen Lounge Sofa", price: "LKR 162,800", category: "sofas", image: console1 },
  { id: "f4", name: "Vienna Lounge Chair", price: "LKR 48,900", category: "chairs", image: armchair1 },
  { id: "f5", name: "Linen Accent Chair", price: "LKR 36,500", category: "chairs", image: chair1 },
  { id: "f6", name: "Studio Chair", price: "LKR 28,200", category: "chairs", image: table1 },
  { id: "f7", name: "Ashwood Dining Table", price: "LKR 95,400", category: "dining", image: table1 },
  { id: "f8", name: "Oak Round Table", price: "LKR 78,000", category: "dining", image: console1 },
  { id: "f9", name: "Heritage Dining Set", price: "LKR 185,000", category: "dining", image: bookshelf1 },
  { id: "f10", name: "Minimal Side Table", price: "LKR 18,500", category: "side", image: bedside1 },
  { id: "f11", name: "Compact Bedside", price: "LKR 14,200", category: "side", image: lamp1 },
  { id: "f12", name: "Console Table", price: "LKR 32,800", category: "side", image: console1 },
  { id: "f13", name: "Horizon Bed Frame", price: "LKR 112,000", category: "beds", image: pendant1 },
  { id: "f14", name: "Serene Platform Bed", price: "LKR 98,500", category: "beds", image: bookshelf1 },
  { id: "f15", name: "Ceylon King Bed", price: "LKR 145,000", category: "beds", image: lamp1 },
  { id: "f16", name: "Classic Wardrobe", price: "LKR 76,400", category: "wardrobes", image: bookshelf1 },
  { id: "f17", name: "Sliding Wardrobe", price: "LKR 124,000", category: "wardrobes", image: pendant1 },
  { id: "f18", name: "Compact Wardrobe", price: "LKR 58,900", category: "wardrobes", image: bedside1 },
];

const FurnitureLibraryPanel = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("sofas");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const filtered = MOCK_PRODUCTS.filter((p) => p.category === activeCategory);

  const handleAdd = (item: FurnitureItem) => {
    setAddedIds((prev) => new Set(prev).add(item.id));
    toast.success(`${item.name} added to room`, { description: item.price });
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
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                  active
                    ? "bg-[hsl(28,35%,32%)] text-white"
                    : "bg-accent text-muted-foreground hover:bg-accent/80 hover:text-foreground"
                }`}
                aria-pressed={active}
              >
                <cat.icon size={10} strokeWidth={active ? 2 : 1.5} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product cards */}
        <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-0.5">
          {filtered.map((item) => {
            const added = addedIds.has(item.id);
            return (
              <div
                key={item.id}
                className="group flex gap-2 rounded-md border border-border bg-background p-1.5 transition-all hover:bg-accent/50 hover:shadow-sm"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-accent">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
                  <div>
                    <p className="truncate text-[11px] font-medium text-foreground leading-tight">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.price}</p>
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
