import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false);

  const currentImage = hovered && product.images.length > 1 ? product.images[1] : product.images[0];

  return (
    <div
      className="group overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-white">
          <img
            src={currentImage}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
          {product.tag && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
              {product.tag}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 font-display text-lg font-semibold text-foreground transition-colors hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm font-medium text-foreground">
          {formatPrice(product.price)}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onQuickView(product)}
          >
            <Eye size={14} className="mr-1.5" /> Quick view
          </Button>
          <button
            onClick={() => toggle(product.id)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
              wishlisted
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:border-accent hover:text-accent"
            )}
          >
            <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
