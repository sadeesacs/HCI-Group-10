import { motion } from "framer-motion";
import { Utensils, Sofa, BedDouble, LampDesk, Armchair, LayoutGrid, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  delay: number;
}

const CategoryCard = ({ label, icon, active, onClick, delay }: CategoryCardProps) => (
  <motion.button
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    onClick={onClick}
    className={cn(
      "group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 p-6 transition-all duration-300",
      active
        ? "border-[hsl(28_35%_32%)] bg-[hsl(28_35%_32%/0.1)] shadow-lg"
        : "border-[hsl(28_35%_32%/0.4)] bg-warm-cream/40 hover:border-[hsl(28_35%_32%)] hover:bg-[hsl(28_35%_32%/0.08)] hover:shadow-lg"
    )}
  >
    <span
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300",
        active
          ? "bg-[hsl(28_35%_32%)] text-white shadow-md"
          : "bg-[hsl(28_35%_32%/0.12)] text-[hsl(28_35%_32%)] group-hover:bg-[hsl(28_35%_32%)] group-hover:text-white group-hover:shadow-md"
      )}
    >
      {icon}
    </span>
    <span
      className={cn(
        "text-[12px] font-bold uppercase tracking-widest transition-colors text-center",
        active ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"
      )}
    >
      {label}
    </span>
  </motion.button>
);

interface ShopCategoryCardsProps {
  selected: string | null;
  onSelect: (cat: string | null) => void;
  categories: string[];
}

const iconForCategory = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes("dining") || normalized.includes("table")) return <Utensils size={28} strokeWidth={1.5} />;
  if (normalized.includes("sofa") || normalized.includes("seat")) return <Sofa size={28} strokeWidth={1.5} />;
  if (normalized.includes("bed")) return <BedDouble size={28} strokeWidth={1.5} />;
  if (normalized.includes("light")) return <LampDesk size={28} strokeWidth={1.5} />;
  if (normalized.includes("chair")) return <Armchair size={28} strokeWidth={1.5} />;
  if (normalized.includes("storage")) return <LayoutGrid size={28} strokeWidth={1.5} />;
  return <ShoppingBag size={28} strokeWidth={1.5} />;
};

const ShopCategoryCards = ({ selected, onSelect, categories }: ShopCategoryCardsProps) => {
  return (
    <section className="border-b border-border/40 bg-white py-10 lg:py-14">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 text-center font-display text-2xl font-semibold text-foreground"
        >
          Browse by Category
        </motion.h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <CategoryCard
              key={cat}
              label={cat}
              icon={iconForCategory(cat)}
              active={selected === cat}
              onClick={() => onSelect(selected === cat ? null : cat)}
              delay={i * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopCategoryCards;