import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "popular" | "new" | "price-asc" | "price-desc";

interface ShopFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
  resultCount: number;
  sort: SortOption;
  onSortChange: (val: SortOption) => void;
  categories: string[];
}

const ShopFilterBar = ({
  search,
  onSearchChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  selectedCategory,
  onCategoryChange,
  onClearFilters,
  hasFilters,
  resultCount,
  sort,
  onSortChange,
  categories,
}: ShopFilterBarProps) => {
  return (
    <div className="space-y-4">
      {/* Category pills row */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 border",
            selectedCategory === null
              ? "bg-foreground text-white border-foreground"
              : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
          )}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(selectedCategory === cat ? null : cat)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 border",
              selectedCategory === cat
                ? "bg-foreground text-white border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}

        <div className="flex-1" />

        <span className="text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
          />
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-border bg-muted/30 pl-9 text-sm h-10 rounded-lg focus-visible:ring-foreground/20"
          />
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-[100px] border-border bg-muted/30 text-sm h-10 rounded-lg focus-visible:ring-foreground/20"
          />
          <span className="text-muted-foreground/50">—</span>
          <Input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-[100px] border-border bg-muted/30 text-sm h-10 rounded-lg focus-visible:ring-foreground/20"
          />
        </div>

        {/* Sort */}
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-[150px] border-border bg-muted/30 text-sm h-10 rounded-lg">
            <SlidersHorizontal size={14} className="mr-1.5 text-muted-foreground/60" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="new">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low → High</SelectItem>
            <SelectItem value="price-desc">Price: High → Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-10 px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <X size={14} className="mr-1.5" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShopFilterBar;
