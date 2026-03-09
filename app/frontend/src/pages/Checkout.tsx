import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  MapPin,
  Navigation,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { allProducts, formatPrice } from "@/data/mock";

/* ── mock cart ── */
const cartItems = [
  { productId: "1", quantity: 1, selectedColor: allProducts[0].colors[0] },
  { productId: "5", quantity: 2, selectedColor: allProducts[4].colors[0] },
  { productId: "4", quantity: 1 },
].map((ci) => {
  const p = allProducts.find((x) => x.id === ci.productId)!;
  return { ...ci, name: p.name, price: p.price, image: p.images[0] };
});

const DELIVERY_FEE = 1500;
const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

const Checkout = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");

  const [contact, setContact] = useState({ name: "", email: "", phone1: "", phone2: "" });
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", postal: "", notes: "" });
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [confidence, setConfidence] = useState("accurate");
  const [pickupNote, setPickupNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (method === "delivery") {
      if (!address.line1.trim()) e.line1 = "Required";
      if (!address.city.trim()) e.city = "Required";
      if (!address.postal.trim()) e.postal = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = () => {
    if (!validate()) return;
    const id = Math.random().toString(36).slice(2, 10);
    navigate(`/order-success/${id}`);
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

                  {/* Map */}
                  <div className="mt-6">
                    <Label className="mb-2 block text-sm font-medium">
                      Pin your location on the map
                    </Label>
                    <LeafletMap pin={pin} setPin={setPin} />
                  </div>

                  {/* Confidence */}
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
            {/* Items */}
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {item.name}{" "}
                          <span className="text-muted-foreground font-normal">×{item.quantity}</span>
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-sm font-medium text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Totals + Place Order */}
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
                >
                  Place Order
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
  children: React.ReactNode;
}) => (
  <div className={`${full ? "sm:col-span-2" : ""} ${className ?? ""}`}>
    <Label className="mb-1.5 block text-sm font-medium">{label}</Label>
    {children}
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);

/* ── Static Map Placeholder ── */
function LeafletMap({
  pin,
  setPin,
}: {
  pin: { lat: number; lng: number } | null;
  setPin: (p: { lat: number; lng: number }) => void;
}) {
  const geolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setPin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const lat = 7.1 - y * 0.4;
    const lng = 79.7 + x * 0.4;
    setPin({ lat, lng });
  };

  return (
    <div className="space-y-2">
      <div
        onClick={handleMapClick}
        className="relative flex h-[280px] cursor-crosshair items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary/50 shadow-sm"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MapPin className="h-8 w-8" />
          <span className="text-sm font-medium">Click to drop a pin on the map</span>
          <span className="text-xs">Colombo area</span>
        </div>
        {pin && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-warm-walnut fill-warm-walnut/20" />
              <span className="mt-1 rounded bg-background/90 px-2 py-0.5 text-xs font-medium shadow-sm">
                {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        {pin ? (
          <p className="text-xs text-muted-foreground">
            <MapPin className="mr-1 inline h-3 w-3" />
            {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Click the map to drop a pin.</p>
        )}
        <Button type="button" variant="outline" size="sm" onClick={geolocate} className="gap-1 text-xs">
          <Navigation className="h-3 w-3" /> Use my location
        </Button>
      </div>
    </div>
  );
}

export default Checkout;
