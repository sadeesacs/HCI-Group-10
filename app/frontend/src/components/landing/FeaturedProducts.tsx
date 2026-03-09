import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { bestSellers, formatPrice } from "@/data/mock";
import type { Product } from "@/data/mock";
import QuickViewModal from "@/components/QuickViewModal";

const FeaturedProducts = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <section className="py-12 lg:py-16 bg-warm-cream/60">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Curated for you
          </p>
          <h2 className="font-display text-3xl font-normal text-foreground lg:text-5xl">
            Best Sellers
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
            Pieces our customers keep coming back for.
          </p>
        </div>

        {/* Product Grid — single row, 4 items */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <div className="group overflow-hidden rounded-xl border-2 border-warm-tan/40 bg-white shadow-[0_2px_16px_-4px_hsl(30_15%_28%/0.08)] transition-all duration-300 hover:shadow-[0_8px_30px_-6px_hsl(30_15%_28%/0.16)] hover:-translate-y-1">
                {/* Image */}
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-white">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Divider */}
                <div className="h-px bg-warm-tan/30" />

                {/* Content */}
                <div className="px-5 py-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {product.category}
                  </p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="mt-2 font-display text-base font-semibold leading-snug text-foreground transition-colors hover:text-muted-foreground">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="mt-2 text-sm font-semibold tracking-wide text-foreground">
                    {formatPrice(product.price)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full text-xs font-medium tracking-wide border-warm-tan/50 hover:bg-warm-cream"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    Quick View
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Button asChild variant="outline" size="lg" className="border-foreground/20 hover:bg-warm-cream">
            <Link to="/shop">
              Browse All <ArrowRight size={16} className="ml-1" />
            </Link>
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
