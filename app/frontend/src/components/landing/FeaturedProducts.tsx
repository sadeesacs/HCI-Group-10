import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { bestSellers, formatPrice } from "@/data/mock";
import type { Product } from "@/data/mock";
import QuickViewModal from "@/components/QuickViewModal";

const FeaturedProducts = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground lg:text-4xl">
            Best Sellers
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Pieces our customers keep coming back for.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.slice(0, 8).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={`/product/${product.id}`}
                className="group block overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-white">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {product.category}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatPrice(product.price)}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        setQuickViewProduct(product);
                      }}
                    >
                      <Eye size={14} className="mr-1.5" /> Quick view
                    </Button>
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <Heart size={14} />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/shop">Browse all</Link>
          </Button>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />
    </section>
  );
};

export default FeaturedProducts;
