import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { allProducts, formatPrice } from "@/data/mock";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedColor?: string;
  quantity: number;
}

const initialCart: CartItem[] = [
  {
    productId: "1",
    name: allProducts[0].name,
    price: allProducts[0].price,
    image: allProducts[0].images[0],
    selectedColor: allProducts[0].colors[0],
    quantity: 1,
  },
  {
    productId: "5",
    name: allProducts[4].name,
    price: allProducts[4].price,
    image: allProducts[4].images[0],
    selectedColor: allProducts[4].colors[0],
    quantity: 2,
  },
  {
    productId: "4",
    name: allProducts[3].name,
    price: allProducts[3].price,
    image: allProducts[3].images[0],
    quantity: 1,
  },
];

const DELIVERY_FEE = 1500;

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>(initialCart);

  const updateQty = (id: string, delta: number) =>
    setItems((prev) =>
      prev.map((i) =>
        i.productId === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.productId !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + (items.length ? DELIVERY_FEE : 0);

  return (
    <>
      <div className="container pt-8 pb-4 lg:pt-10">
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowRight size={14} className="rotate-180" />
          Continue shopping
        </Link>
        <h1 className="font-display text-3xl font-semibold tracking-wide text-foreground lg:text-4xl">Your Cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>
      <section className="container pt-4 pb-10 lg:pt-6 lg:pb-14">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-md text-center"
          >
            <Card className="border-0 bg-warm-cream/60 shadow-sm">
              <CardContent className="flex flex-col items-center gap-4 py-14">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Your cart is empty.
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add some pieces you love and come back here.
                </p>
                <Button asChild className="mt-2">
                  <Link to="/shop">Browse shop</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* ── Items ── */}
            <div className="space-y-0">
              <AnimatePresence initial={false}>
                {items.map((item, idx) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25 }}
                  >
                    {idx > 0 && <Separator className="my-0" />}
                    <div className="flex gap-4 py-5 sm:gap-6">
                      {/* thumb */}
                      <Link
                        to={`/product/${item.productId}`}
                        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-warm-cream sm:h-28 sm:w-28"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      {/* info */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <Link
                            to={`/product/${item.productId}`}
                            className="font-display text-sm font-semibold text-foreground hover:underline sm:text-base"
                          >
                            {item.name}
                          </Link>
                          {item.selectedColor && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Colour: {item.selectedColor}
                            </p>
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-4">
                          {/* qty stepper */}
                          <div className="flex items-center rounded-md border border-border">
                            <button
                              onClick={() => updateQty(item.productId, -1)}
                              className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="flex h-8 w-8 items-center justify-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.productId, 1)}
                              className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => remove(item.productId)}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* price */}
                      <p className="flex-shrink-0 text-sm font-semibold text-foreground sm:text-base">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Summary ── */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Card className="border-0 shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Order Summary
                  </h3>
                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-medium">{formatPrice(DELIVERY_FEE)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <Button asChild className="w-full bg-warm-walnut hover:bg-warm-walnut-dark text-white" size="lg">
                    <Link to="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full bg-warm-walnut hover:bg-warm-walnut-dark text-white border-0" size="sm">
                    <Link to="/shop">Continue shopping</Link>
                  </Button>

                  <p className="text-center text-[11px] text-muted-foreground/60">
                    Secure Checkout
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Cart;
