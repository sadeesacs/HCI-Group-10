import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, HelpCircle, MapPin, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchOrder, type Order } from "@/lib/api";
import { formatPrice } from "@/lib/format";

const OrderSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const initialOrder = (location.state as { order?: Order } | null)?.order ?? null;
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Order ID is missing");
      setLoading(false);
      return;
    }

    if (order) {
      sessionStorage.setItem(`order-${order.orderNumber}`, JSON.stringify(order));
      return;
    }

    const cached = sessionStorage.getItem(`order-${id}`);
    if (cached) {
      try {
        setOrder(JSON.parse(cached));
        setLoading(false);
        return;
      } catch {
        // ignore cache errors
      }
    }

    let active = true;
    setLoading(true);
    setError(null);

    fetchOrder(id)
      .then((res) => {
        if (!active) return;
        setOrder(res.order);
        sessionStorage.setItem(`order-${res.order.orderNumber}`, JSON.stringify(res.order));
      })
      .catch((err) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Failed to load order";
        setError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, order]);

  const subtotal = order?.subtotal ?? 0;
  const deliveryFee = order?.deliveryFee ?? 0;
  const total = order?.total ?? subtotal + deliveryFee;

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="border border-border shadow-lg">
          <CardContent className="flex flex-col gap-6 p-8 text-center sm:p-10">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warm-walnut/10">
                <CheckCircle2 className="h-8 w-8 text-warm-walnut" />
              </div>
            </div>

            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                Order confirmed
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {order ? "Thank you for choosing Casa Ceylon." : "Hold tight while we fetch your order."}
              </p>
            </div>

            <div className="w-full rounded-lg bg-warm-cream/70 px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Order ID</p>
              <span className="font-mono text-sm font-semibold tracking-wide text-foreground">
                {id || "—"}
              </span>
            </div>

            <Card className="w-full border-0 bg-warm-cream/40 shadow-none text-left">
              <CardContent className="space-y-3 p-4 text-sm">
                {loading && <p className="text-muted-foreground">Preparing your summary…</p>}
                {!loading && error && <p className="text-destructive">{error}</p>}
                {!loading && !error && order && (
                  <>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Payment</span>
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Wallet className="h-3.5 w-3.5" />
                        {order.paymentMethod === "cash-on-delivery" ? "Cash on Delivery" : "Online (mock)"}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3 rounded-md border border-border bg-background/40 p-3">
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <MapPin className="mt-0.5 h-4 w-4 text-warm-walnut" />
                        <div>
                          <p className="text-foreground text-sm font-semibold">Shipping Address</p>
                          <p>{order.shippingAddress.line1}</p>
                          {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                          </p>
                          {order.shippingAddress.notes && <p className="mt-1">{order.shippingAddress.notes}</p>}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {order.items.map((item) => (
                      <div key={`${item.productId}-${item.selectedColor ?? "-"}`} className="flex justify-between text-sm">
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
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-foreground pt-1">
                      <span>Total</span>
                      <span className="text-warm-walnut">{formatPrice(total)}</span>
                    </div>
                  </>
                )}
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
