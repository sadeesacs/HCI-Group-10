import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface ShopProductCardProps {
  product: Product;
}

const ShopProductCard = ({ product }: ShopProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart:", product.name);
  };


  return (
    <div className="group overflow-hidden rounded-2xl bg-white border border-border shadow-[0_2px_12px_-2px_hsl(30_10%_40%/0.1)] transition-all duration-300 hover:shadow-[0_12px_32px_-8px_hsl(30_10%_40%/0.18)] hover:-translate-y-0.5">
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[hsl(30_15%_95%)] rounded-t-2xl">



          {/* Product Image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Image Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(28_35%_32%)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(30_10%_75%)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(30_10%_75%)]" />
          </div>
        </div>
      </Link>

      {/* Info Section */}
      <div className="px-5 py-5">
        {/* Category */}
        <p className="text-xs font-medium text-[hsl(28_35%_45%)]">
          {product.category}
        </p>

        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1.5 font-serif text-base font-semibold leading-snug text-foreground line-clamp-2 hover:text-[hsl(28_35%_32%)] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="mt-2 text-lg font-bold text-[hsl(28_35%_32%)]">
          {formatPrice(product.price)}
        </p>

        {/* Add to Cart Button */}
        <Button
          asChild
          className="mt-4 w-full rounded-full bg-[hsl(28_35%_32%)] hover:bg-[hsl(28_35%_26%)] text-white font-medium h-11"
        >
          <Link to={`/product/${product.id}`}>
            <Eye size={16} className="mr-2" />
            View Details
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ShopProductCard;
