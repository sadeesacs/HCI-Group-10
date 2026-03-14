import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/api";
import ShopHeroBanner from "@/components/shop/ShopHeroBanner";
import ShopCategoryCards from "@/components/shop/ShopCategoryCards";
import ShopFilterBar from "@/components/shop/ShopFilterBar";
import ShopProductCard from "@/components/shop/ShopProductCard";
import type { Product } from "@/types/product";

type SortOption = "popular" | "new" | "price-asc" | "price-desc";
const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (active) setProducts(data);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setMinPrice("");
    setMaxPrice("");
  };

  const hasFilters = !!(search || selectedCategory || minPrice || maxPrice);

  const filtered = useMemo(() => {
    let items = [...products];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      items = items.filter((p) => p.category === selectedCategory);
    }

    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    items = items.filter((p) => p.price >= min && p.price <= max);

    switch (sort) {
      case "popular":
        items.sort((a, b) => b.popularity - a.popularity);
        break;
      case "new":
        items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
    }

    return items;
  }, [products, search, selectedCategory, minPrice, maxPrice, sort]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="-mt-20">
      {/* Hero Banner — flush under navbar */}
      <ShopHeroBanner />

      {/* Category Cards */}
      <ShopCategoryCards
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        categories={categories}
      />

      {/* Main Shop Area — white background */}
      <section className="bg-white pt-8 lg:pt-10 pb-[30px] font-display">
        <div className="container">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              {selectedCategory ?? "Our Collection"}
            </h2>
          </div>

          {/* Top Filter Bar */}
          <div className="mb-[80px]">
            <ShopFilterBar
              search={search}
              onSearchChange={setSearch}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onClearFilters={clearFilters}
              hasFilters={hasFilters}
              resultCount={filtered.length}
              sort={sort}
              onSortChange={setSort}
              categories={categories}
            />
          </div>

          {/* Product Grid — full width */}
          {loading ? (
            <div className="text-center text-muted-foreground">Loading products…</div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-md rounded-xl border-2 border-[hsl(30_15%_82%)] bg-white p-12 text-center shadow-sm"
            >
              <PackageOpen
                size={48}
                strokeWidth={1.5}
                className="mx-auto text-muted-foreground/50"
              />
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                {error ? "Could not load products" : "No items match your filters"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? "Please try again later or refresh the page."
                  : "Try adjusting your search or filter criteria."}
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                  >
                    <ShopProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                    className="border-[hsl(30_15%_82%)] bg-white hover:bg-[hsl(30_20%_97%)]"
                  >
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
