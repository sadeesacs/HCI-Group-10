import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import { fetchProducts } from "@/lib/api";

interface OrderItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

const DELIVERY_FEE = 1500;

const OrderSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id || "—";
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const products = await fetchProducts({ sort: "popular" });
        if (!active) return;
        const seeded: OrderItem[] = products.slice(0, 3).map((p, idx) => ({
          productId: p.id,
          quantity: idx === 1 ? 2 : 1,
          name: p.name,
          price: p.price,
        }));
        setItems(seeded);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load order items");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border border-border shadow-lg">
          <CardContent className="flex flex-col items-center gap-5 p-8 text-center sm:p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warm-walnut/10">
              <CheckCircle2 className="h-8 w-8 text-warm-walnut" />
            </div>

            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                Order confirmed
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Thank you for choosing Casa Ceylon. We'll contact you soon with delivery details.
              </p>
            </div>

            <div className="w-full rounded-lg bg-warm-cream/70 px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Order ID</p>
              <span className="font-mono text-sm font-semibold tracking-wide text-foreground">
                {orderId}
              </span>
            </div>

            <Card className="w-full border-0 bg-warm-cream/40 shadow-none">
              <CardContent className="space-y-2 p-4 text-sm">
                {loading && <p className="text-muted-foreground">Preparing your summary…</p>}
                {!loading && error && (
                  <p className="text-destructive">{error}</p>
                )}
                {!loading && !error &&
                  items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <span className="text-foreground">
                        {item.name} <span className="text-muted-foreground">×{item.quantity}</span>
                      </span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                <Separator className="my-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Delivery</span>
                  <span>{formatPrice(DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground pt-1">
                  <span>Total</span>
                  <span className="text-warm-walnut">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1 bg-warm-walnut hover:bg-warm-walnut-dark text-white">
                <Link to="/shop">Continue shopping</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 border-warm-walnut text-warm-walnut hover:bg-warm-walnut/10">
                <Link to="/">Back to home</Link>
              </Button>
            </div>

            <Link
              to="/about#contact"
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <HelpCircle className="h-3 w-3" /> Need help? Contact us
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default OrderSuccess;
