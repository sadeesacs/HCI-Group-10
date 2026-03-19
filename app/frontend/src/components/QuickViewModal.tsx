import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ExternalLink } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickViewModal = ({ product, open, onOpenChange }: QuickViewModalProps) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();

  if (!product) return null;


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-2xl border-border/40 bg-card p-0 shadow-card-hover sm:max-w-3xl">
        <div className="grid sm:grid-cols-2">
          {/* Image side */}
          <div className="relative bg-warm-beige">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-3 flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "h-12 w-12 overflow-hidden rounded-lg border-2 transition-colors",
                      activeImage === i ? "border-accent" : "border-background/60"
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info side */}
          <div className="flex flex-col gap-4 p-6 sm:p-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {product.category}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
                {product.name}
              </h3>
              <p className="mt-1 text-lg font-medium text-foreground">
                {formatPrice(product.price)}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Color chips */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Finish
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(i)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      selectedColor === i
                        ? "border-accent bg-accent/10 text-accent-foreground"
                        : "border-border text-muted-foreground hover:border-accent/50"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Quantity
              </p>
              <div className="inline-flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-2">
              <Button
                className="w-full"
                onClick={() => {
                  addItem(product.id, { quantity, selectedColor: product.colors[selectedColor] });
                  onOpenChange(false);
                }}
              >
                Add to Cart
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                <Link to={`/product/${product.id}`}>
                  View full details <ExternalLink size={14} className="ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
