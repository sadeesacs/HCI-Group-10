import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  CreditCard,
  MapPin,
  Navigation,
  ShieldCheck,
  Store,
  Truck,
  Wallet,
} from "lucide-react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { createCheckout, fetchProduct } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

type PaymentMethod = "cash-on-delivery" | "online-mock";

interface CheckoutItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
  name: string;
  price: number;
  image?: string;
}

const DELIVERY_FEE = 1500;
const SHOWROOM_LOCATION = { lat: 6.9271, lng: 79.8612 };
const MAP_DEFAULT: LatLngExpression = [SHOWROOM_LOCATION.lat, SHOWROOM_LOCATION.lng];

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Checkout = () => {
  const navigate = useNavigate();
  const cart = useCart();
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash-on-delivery");
  const [contact, setContact] = useState({ name: "", email: "", phone1: "", phone2: "" });
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", postal: "", notes: "" });
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [confidence, setConfidence] = useState("accurate");
  const [pickupNote, setPickupNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    const readUser = () => {
      try {
        const raw = localStorage.getItem("authUser");
        if (!raw) {
          setUser(null);
          return;
        }
        const parsed = JSON.parse(raw);
        setUser(parsed);
      } catch {
        setUser(null);
      }
    };
    readUser();
    const handler = () => readUser();
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  useEffect(() => {
    if (user) {
      setContact((prev) => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (cart.entries.length === 0) {
          setItems([]);
          return;
        }

        const uniqueIds = Array.from(new Set(cart.entries.map((e) => e.productId)));
        const products = await Promise.all(uniqueIds.map((id) => fetchProduct(id)));
        if (!active) return;

        const map = new Map(products.map((p) => [p.id, p]));
        const enriched = cart.entries
          .map((entry) => {
            const product = map.get(entry.productId);
            if (!product) return null;
            return {
              productId: entry.productId,
              quantity: entry.quantity,
              selectedColor: entry.selectedColor,
              name: product.name,
              price: product.price,
              image: product.images[0],
            } as CheckoutItem;
          })
          .filter(Boolean) as CheckoutItem[];

        setItems(enriched);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load cart items");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [cart.entries]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryTotal = method === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryTotal;

  const fieldCn = (name: string) =>
    errors[name] ? "border-destructive focus-visible:ring-destructive" : "";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!contact.name.trim()) e.name = "Required";
    if (!contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
      e.email = "Valid email required";
    if (!contact.phone1.trim()) e.phone1 = "Required";
    if (items.length === 0) e.items = "Your cart is empty";

    if (method === "delivery") {
      if (!address.line1.trim()) e.line1 = "Required";
      if (!address.city.trim()) e.city = "Required";
      if (!address.postal.trim()) e.postal = "Required";
      if (!pin) e.pin = "Pin your delivery location";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildShipping = () => {
    const baseNotes = address.notes.trim();
    const confidenceNote = confidence === "not-sure" ? "Pin accuracy: unsure" : "";
    const noteParts = [baseNotes, confidenceNote].filter(Boolean);

    if (method === "pickup") {
      if (pickupNote.trim()) noteParts.push(`Pickup note: ${pickupNote.trim()}`);
      return {
        line1: "Pickup - Casa Ceylon Showroom",
        line2: "42 Galle Road",
        city: "Colombo 03",
        postalCode: "00003",
        notes: noteParts.join(" | ") || undefined,
        location: SHOWROOM_LOCATION,
      };
    }

    return {
      line1: address.line1.trim(),
      line2: address.line2.trim() || undefined,
      city: address.city.trim(),
      postalCode: address.postal.trim(),
      notes: noteParts.join(" | ") || undefined,
      location: pin!,
    };
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        customer: {
          name: contact.name.trim(),
          email: contact.email.trim(),
          phone: contact.phone1.trim(),
        },
        shippingAddress: buildShipping(),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
        })),
        paymentMethod,
        userId: user?.id,
      };

      const { order } = await createCheckout(payload);
      cart.clear();
      sessionStorage.setItem(`order-${order.orderNumber}`, JSON.stringify(order));
      navigate(`/order-success/${order.orderNumber}`, { state: { order } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="container pt-8 pb-4 lg:pt-10">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronRight size={14} className="rotate-180" />
          Back to cart
        </Link>
        <h1 className="font-display text-3xl font-semibold tracking-wide text-foreground lg:text-4xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Complete your order details</p>
      </div>

      <section className="container pt-4 pb-10 lg:pt-6 lg:pb-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ── LEFT COLUMN ── */}
          <div className="space-y-6">
            {/* Order Type Card */}
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-5">
                  Order Type
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {(["delivery", "pickup"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`flex items-center justify-center gap-2.5 rounded-lg border-2 px-4 py-3.5 text-sm font-medium capitalize transition-all ${
                        method === m
                          ? "border-warm-walnut bg-warm-cream text-warm-walnut"
                          : "border-border bg-background text-muted-foreground hover:border-muted-foreground/30"
                      }`}
                    >
                      {m === "delivery" ? <Truck className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                      {m === "delivery" ? "Delivery" : "Pickup"}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Details Card */}
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-5">
                  Customer Details
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name *" error={errors.name}>
                    <Input
                      placeholder="Your full name"
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      className={fieldCn("name")}
                      maxLength={100}
                    />
                  </Field>
                  <Field label="Phone *" error={errors.phone1}>
                    <Input
                      placeholder="+94XXXXXXXXX"
                      value={contact.phone1}
                      onChange={(e) => setContact({ ...contact, phone1: e.target.value })}
                      className={fieldCn("phone1")}
                      maxLength={20}
                    />
                  </Field>
                  <Field label="Email *" error={errors.email}>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      className={fieldCn("email")}
                      maxLength={255}
                    />
                  </Field>
                  <Field label="Phone 2 (optional)">
                    <Input
                      placeholder="+94XXXXXXXXX"
                      value={contact.phone2}
                      onChange={(e) => setContact({ ...contact, phone2: e.target.value })}
                      maxLength={20}
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-5">
                  Payment Method
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {["cash-on-delivery", "online-mock"].map((methodKey) => {
                    const selected = paymentMethod === methodKey;
                    const isCash = methodKey === "cash-on-delivery";
                    return (
                      <button
                        key={methodKey}
                        onClick={() => setPaymentMethod(methodKey as PaymentMethod)}
                        className={`flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                          selected
                            ? "border-warm-walnut bg-warm-cream"
                            : "border-border bg-background hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="mt-0.5">
                          {isCash ? <Wallet className="h-5 w-5 text-warm-walnut" /> : <CreditCard className="h-5 w-5 text-warm-walnut" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {isCash ? "Cash on Delivery" : "Online"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isCash
                              ? "Pay with cash or card when your order arrives."
                              : "Simulated online payment for testing."}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address / Pickup Details Card */}
            {method === "delivery" ? (
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-5">
                    Delivery Address
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Address line 1 *" error={errors.line1} full>
                      <Input
                        value={address.line1}
                        onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                        className={fieldCn("line1")}
                        maxLength={200}
                      />
                    </Field>
                    <Field label="Address line 2" full>
                      <Input
                        value={address.line2}
                        onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                        maxLength={200}
                      />
                    </Field>
                    <Field label="City *" error={errors.city}>
                      <Input
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className={fieldCn("city")}
                        maxLength={100}
                      />
                    </Field>
                    <Field label="Postal code *" error={errors.postal}>
                      <Input
                        value={address.postal}
                        onChange={(e) => setAddress({ ...address, postal: e.target.value })}
                        className={fieldCn("postal")}
                        maxLength={10}
                      />
                    </Field>
                    <Field label="Delivery notes (optional)" full>
                      <Textarea
                        value={address.notes}
                        onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                        placeholder="Gate code, landmark, special instructions…"
                        className="resize-none"
                        maxLength={500}
                      />
                    </Field>
                  </div>

                  <div className="mt-6 space-y-2">
                    <Label className="block text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-warm-walnut" /> Pin your location on the map
                    </Label>
                    <LeafletMap pin={pin} setPin={setPin} error={errors.pin} />
                    {errors.pin && <p className="text-xs text-destructive">{errors.pin}</p>}
                  </div>

                  <div className="mt-5">
                    <Label className="mb-2 block text-sm font-medium">
                      How accurate is this pin?
                    </Label>
                    <RadioGroup value={confidence} onValueChange={setConfidence} className="flex gap-4">
                      {["accurate", "not-sure"].map((v) => (
                        <div key={v} className="flex items-center gap-2">
                          <RadioGroupItem value={v} id={`conf-${v}`} />
                          <Label htmlFor={`conf-${v}`} className="capitalize">
                            {v === "not-sure" ? "Not sure" : "Accurate"}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-5">
                    Pickup Details
                  </h2>
                  <div className="rounded-lg border border-border bg-warm-cream/40 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <Store className="h-5 w-5 text-warm-walnut" />
                      <span className="font-display text-base font-semibold">
                        Casa Ceylon Showroom
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      42 Galle Road, Colombo 03, Sri Lanka
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mon – Sat: 10 AM – 7 PM &nbsp;|&nbsp; Sun: 11 AM – 5 PM
                    </p>
                  </div>
                  <Field label="Pickup note (optional)" full className="mt-4">
                    <Textarea
                      value={pickupNote}
                      onChange={(e) => setPickupNote(e.target.value)}
                      placeholder="e.g. I'll send a driver on my behalf…"
                      className="resize-none"
                      maxLength={500}
                    />
                  </Field>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── RIGHT COLUMN: Order Summary ── */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  {loading && <p className="text-sm text-muted-foreground">Loading items…</p>}
                  {!loading && error && <p className="text-sm text-destructive">{error}</p>}
                  {!loading && !error &&
                    items.map((item) => (
                      <div key={`${item.productId}-${item.selectedColor ?? "-"}`} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {item.name}{" "}
                            <span className="text-muted-foreground font-normal">×{item.quantity}</span>
                          </p>
                          {item.selectedColor && (
                            <p className="text-[11px] text-muted-foreground">Color: {item.selectedColor}</p>
                          )}
                        </div>
                        <span className="flex-shrink-0 text-sm font-medium text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  {!loading && !error && items.length === 0 && (
                    <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="text-foreground">
                    {method === "delivery" ? formatPrice(DELIVERY_FEE) : "Free (pickup)"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <span className="font-display text-xl font-bold text-warm-walnut">
                    {formatPrice(total)}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full mt-2 bg-warm-walnut hover:bg-warm-walnut-dark text-white"
                  onClick={placeOrder}
                  disabled={submitting || loading}
                >
                  {submitting ? "Placing order…" : "Place Order"}
                </Button>

                <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground/60">
                  <ShieldCheck className="h-3 w-3" /> Secure Checkout
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

/* ───────── Sub-components ───────── */

const Field = ({
  label,
  error,
  full,
  className,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <div className={`${full ? "sm:col-span-2" : ""} ${className ?? ""}`}>
    <Label className="mb-1.5 block text-sm font-medium">{label}</Label>
    {children}
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);

const MapClickHandler = ({ onSelect }: { onSelect: (pos: { lat: number; lng: number }) => void }) => {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const LeafletMap = ({
  pin,
  setPin,
  error,
}: {
  pin: { lat: number; lng: number } | null;
  setPin: (pos: { lat: number; lng: number }) => void;
  error?: string;
}) => {
  const center: LatLngExpression = pin ? [pin.lat, pin.lng] : MAP_DEFAULT;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <MapContainer center={center} zoom={13} className="h-64 w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onSelect={setPin} />
        {pin && <Marker position={[pin.lat, pin.lng]} icon={markerIcon} />} 
      </MapContainer>
      <div className={`flex items-center gap-2 px-3 py-2 text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}>
        <Navigation className="h-3.5 w-3.5" />
        <span>{pin ? `Pinned at ${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}` : "Tap on the map to drop a pin"}</span>
      </div>
    </div>
  );
};

export default Checkout;
