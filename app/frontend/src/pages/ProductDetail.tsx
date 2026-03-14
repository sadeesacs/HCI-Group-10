import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShieldCheck, RotateCcw, Box, ChevronRight, PackageOpen, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Product } from "@/types/product";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import ShopProductCard from "@/components/shop/ShopProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<"gallery" | "360" | "3d">("gallery");
  const [show3dModal, setShow3dModal] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    let active = true;

    if (!id) {
      setError("Product not found");
      setLoading(false);
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        setLoading(true);
        const item = await fetchProduct(id);
        if (!active) return;
        setProduct(item);
        const others = await fetchProducts({ sort: "popular" });
        if (!active) return;
        setRelated(others.filter((p) => p.id !== id).slice(0, 4));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load product");
        setProduct(null);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container text-center text-muted-foreground">
          Loading product…
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-20">
        <div className="container flex justify-center">
          <div className="max-w-md rounded-2xl bg-card p-12 text-center shadow-card">
            <PackageOpen size={48} strokeWidth={1.5} className="mx-auto text-muted-foreground/50" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">Product not found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {error || "The product you're looking for doesn't exist or has been removed."}
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/shop">Back to Shop</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Back navigation */}
      <div className="container pt-6 pb-2">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronRight size={14} className="rotate-180" />
          Back to Shop
        </Link>
      </div>

      {/* Main section */}
      <section className="pt-4 pb-10 lg:pt-6 lg:pb-16">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {viewMode === "gallery" ? (
              <>
                <div className="overflow-hidden rounded-2xl bg-warm-beige">
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="aspect-square w-full object-cover"
                  />
                </div>
                {/* Thumbnails */}
                <div className="mt-3 flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors",
                        activeImage === i ? "border-accent" : "border-border/40"
                      )}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            ) : viewMode === "360" ? (
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-warm-beige">
                <div className="text-center">
                  <RotateCcw size={48} strokeWidth={1.5} className="mx-auto text-muted-foreground/40" />
                  <p className="mt-3 font-display text-lg font-semibold text-foreground">360° View</p>
                  <p className="mt-1 text-sm text-muted-foreground">Interactive spin coming soon</p>
                </div>
              </div>
            ) : null}

            {/* View mode buttons */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setViewMode("gallery")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                  viewMode === "gallery"
                    ? "border-accent bg-accent/10 text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent/50"
                )}
              >
                Gallery
              </button>
              <button
                onClick={() => setViewMode("360")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                  viewMode === "360"
                    ? "border-accent bg-accent/10 text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent/50"
                )}
              >
                <RotateCcw size={13} /> 360° View
              </button>
              <button
                onClick={() => setShow3dModal(true)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/50"
              >
                <Box size={13} /> 3D Preview
              </button>
            </div>
          </motion.div>

          {/* Right — Purchase panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              
              <h1 className="mt-1 font-serif text-3xl font-bold text-foreground lg:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              <p className="mt-4 text-2xl font-semibold text-foreground">{formatPrice(product.price)}</p>

              {/* Colors */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Finish</p>
                <div className="flex gap-3">
                  {product.colors.map((color, i) => {
                    const colorMap: Record<string, string> = {
                      Beige: "hsl(38 30% 75%)",
                      Charcoal: "hsl(0 0% 30%)",
                      Olive: "hsl(80 25% 40%)",
                      Walnut: "hsl(28 35% 32%)",
                      Oak: "hsl(35 40% 60%)",
                      Teak: "hsl(30 45% 45%)",
                      White: "hsl(0 0% 95%)",
                      Black: "hsl(0 0% 12%)",
                      Natural: "hsl(40 30% 65%)",
                      Cream: "hsl(40 30% 85%)",
                    };
                    const bg = colorMap[color] || "hsl(30 10% 60%)";
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(i)}
                        title={color}
                        className={cn(
                          "h-8 w-8 rounded-full border-2 transition-all duration-200",
                          selectedColor === i
                            ? "border-foreground scale-110 ring-2 ring-foreground/20"
                            : "border-transparent hover:scale-105"
                        )}
                        style={{ backgroundColor: bg }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Quantity</p>
                <div className="inline-flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-12 text-center text-sm font-medium text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="flex-1 rounded-full bg-[hsl(28_35%_32%)] hover:bg-[hsl(28_35%_26%)] text-white font-medium">
                  <ShoppingCart size={16} className="mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-full border-[hsl(28_35%_32%)] text-[hsl(28_35%_32%)] hover:bg-[hsl(28_35%_32%/0.06)] font-medium"
                  asChild
                >
                  <Link to="/designer">
                    <Box size={16} className="mr-2" />
                    View in Your Room
                  </Link>
                </Button>
              </div>

              {/* Warranty */}
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-[hsl(28_35%_32%/0.06)] px-4 py-3 text-sm font-medium text-foreground">
                <ShieldCheck size={18} className="text-[hsl(28_35%_32%)]" />
                <span>12-month structural warranty included</span>
              </div>

              {/* Customization */}
              <div className="mt-6 border-t border-border/40 pt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Customization request</p>
                <Textarea
                  placeholder="Tell us about custom dimensions, fabric preferences, or special requirements…"
                  className="min-h-[80px] resize-none border-border bg-background text-sm"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="-mt-4 pb-8 lg:-mt-6 lg:pb-10">
        <div className="container space-y-3">
          {/* Description */}
          <div className="flex items-start gap-4 rounded-lg border-2 border-border bg-white px-5 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(28_35%_32%/0.1)] text-[hsl(28_35%_32%)]">
              <PackageOpen size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">Description</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {product.longDescription || product.description}
              </p>
            </div>
          </div>

          {/* Dimensions */}
          <div className="flex items-start gap-4 rounded-lg border-2 border-border bg-white px-5 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(28_35%_32%/0.1)] text-[hsl(28_35%_32%)]">
              <RotateCcw size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">Dimensions</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {product.dimensions || "Dimensions available upon request."}
              </p>
            </div>
          </div>

          {/* Materials & Care */}
          <div className="flex items-start gap-4 rounded-lg border-2 border-border bg-white px-5 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(28_35%_32%/0.1)] text-[hsl(28_35%_32%)]">
              <ShieldCheck size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">Materials & Care</h3>
              <ul className="mt-1 space-y-1">
                {(product.materials?.length ? product.materials : ["Details available upon request."]).map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[hsl(28_35%_32%)]" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="py-12 lg:py-20">
        <div className="container">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground lg:text-3xl">
            You may also like
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ShopProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 3D Preview modal */}
      <Dialog open={show3dModal} onOpenChange={setShow3dModal}>
        <DialogContent className="max-w-md rounded-2xl border-border/40 bg-card shadow-card-hover">
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <Box size={56} strokeWidth={1.5} className="text-accent/50" />
            <h3 className="font-display text-xl font-semibold text-foreground">3D Preview Coming Soon</h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              We're building an immersive 3D viewer so you can inspect every angle of this piece before you buy.
            </p>
            <Button variant="outline" onClick={() => setShow3dModal(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />
    </>
  );
};

export default ProductDetail;
