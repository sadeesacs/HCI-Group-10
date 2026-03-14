import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { submitContact } from "@/lib/api";

const contactDetails = [
  { icon: Phone, label: "Phone", value: "+94 11 234 5678" },
  { icon: Mail, label: "Email", value: "hello@casaceylon.lk" },
  { icon: MapPin, label: "Address", value: "42 Galle Road, Colombo 03, Sri Lanka" },
  { icon: Clock, label: "Hours", value: "Mon–Sat 10 AM–7 PM · Sun 11 AM–5 PM" },
];

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const AboutContact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const NAME_PATTERN = /^[A-Za-z ]+$/;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_PATTERN = /^\d{10}$/;

  const sanitizePhone = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  const setFieldError = (key: string, message?: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[key] = message;
      else delete next[key];
      return next;
    });
  };

  const validateField = (key: keyof typeof form, value: string) => {
    const trimmed = value.trim();
    switch (key) {
      case "name":
        if (!trimmed) return "Required";
        if (!NAME_PATTERN.test(trimmed)) return "Letters and spaces only";
        return "";
      case "email":
        if (!trimmed) return "Required";
        if (!EMAIL_PATTERN.test(trimmed)) return "Valid email required";
        return "";
      case "phone":
        if (!trimmed) return "Required";
        if (!PHONE_PATTERN.test(trimmed)) return "Must be exactly 10 digits";
        return "";
      case "subject":
        if (!trimmed) return "Please select a subject";
        return "";
      case "message":
        if (!trimmed) return "Required";
        if (trimmed.length < 10) return "Add a bit more detail";
        return "";
      default:
        return "";
    }
  };

  const handleFieldChange = (key: keyof typeof form, value: string) => {
    const nextValue = key === "phone" ? sanitizePhone(value) : value;
    setForm((prev) => ({ ...prev, [key]: nextValue }));
    const msg = validateField(key, nextValue);
    setFieldError(key, msg || undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    (Object.keys(form) as Array<keyof typeof form>).forEach((key) => {
      const msg = validateField(key, form[key]);
      if (msg) errs[key] = msg;
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    submitContact({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    })
      .then(() => {
        toast.success("Thanks! We received your message.");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        setErrors({});
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to submit";
        toast.error(message);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <section id="contact" className="py-4 lg:py-6">
      <div className="container max-w-5xl">
        <motion.div {...fade} className="mb-12 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-warm-walnut">
            Get In Touch
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground lg:text-4xl">
            Contact Us
          </h2>
          <p className="mt-2 text-muted-foreground">
            We're here to help with orders, customisation, and delivery.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form — 3 cols */}
          <motion.div {...fade} className="lg:col-span-3">
            <Card className="border-border/60 shadow-card">
              <CardContent className="p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">Full name *</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className={errors.name ? "border-destructive" : ""}
                        maxLength={100}
                      />
                      {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">Phone *</Label>
                      <Input
                        value={form.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className={errors.phone ? "border-destructive" : ""}
                        maxLength={10}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="mb-1.5 block text-sm font-medium">Email *</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        className={errors.email ? "border-destructive" : ""}
                        maxLength={255}
                      />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm font-medium">Subject *</Label>
                    <Select
                      value={form.subject}
                      onValueChange={(v) => handleFieldChange("subject", v)}
                    >
                      <SelectTrigger className={errors.subject ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Order</SelectItem>
                        <SelectItem value="customisation">Customisation</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm font-medium">Message *</Label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => handleFieldChange("message", e.target.value)}
                      className={`resize-none ${errors.message ? "border-destructive" : ""}`}
                      rows={4}
                      maxLength={1000}
                    />
                    {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full gap-1.5 rounded-sm bg-warm-walnut text-primary-foreground hover:bg-warm-walnut/90"
                  >
                    <Send className="h-4 w-4" /> {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info — 2 cols */}
          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-2">
            <Card className="h-full border-border/60 bg-warm-cream/40 shadow-card">
              <CardContent className="flex h-full flex-col justify-start gap-6 p-6 lg:p-8">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Showroom Details
                </h3>
                {contactDetails.map((c) => (
                  <div key={c.label} className="flex gap-3">
                    <c.icon className="mt-0.5 h-4 w-4 shrink-0 text-warm-walnut" />
                    <div>
                      <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {c.label}
                      </span>
                      <span className="text-sm text-foreground">{c.value}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutContact;
