import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { registerUser } from "@/lib/api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (form.password.length < 6) errs.password = "At least 6 characters";
    if (form.confirm !== form.password) errs.confirm = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setSubmitError(null);
    try {
      const result = await registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUser", JSON.stringify(result.user));
      window.dispatchEvent(new Event("auth-changed"));
      toast.success("Account created successfully");
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create account";
      setSubmitError(message);
      if (message.toLowerCase().includes("already")) {
        setErrors((prev) => ({ ...prev, email: "Email already registered" }));
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-warm-cream via-background to-warm-beige px-4 pt-32 pb-16">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[hsl(var(--warm-tan)/0.12)] blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[hsl(var(--warm-cream))] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Brand */}

        <div className="rounded-2xl border border-border/50 bg-card/80 p-8 shadow-[var(--card-shadow)] backdrop-blur-sm sm:p-10">
          <div className="mb-7 text-center">
            <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Faster checkout, saved preferences, and access to your design journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Full name" error={errors.name} icon={<User className="h-4 w-4" />}>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                maxLength={100}
              />
            </Field>
            <Field label="Email" error={errors.email} icon={<Mail className="h-4 w-4" />}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                maxLength={255}
              />
            </Field>
            <Field label="Password" error={errors.password} icon={<Lock className="h-4 w-4" />}>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
                className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                maxLength={128}
              />
            </Field>
            <Field label="Confirm password" error={errors.confirm} icon={<Lock className="h-4 w-4" />}>
              <Input
                type="password"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                placeholder="••••••••"
                className={`pl-10 ${errors.confirm ? "border-destructive" : ""}`}
                maxLength={128}
              />
            </Field>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 bg-[hsl(28_35%_32%)] text-white hover:bg-[hsl(28_35%_26%)] h-11 text-sm font-semibold tracking-wide"
            >
              <UserPlus className="h-4 w-4" /> {loading ? "Creating..." : "Create account"}
            </Button>
            {submitError && (
              <p className="text-xs text-destructive text-center" role="alert" aria-live="assertive">
                {submitError}
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[hsl(28_35%_32%)] underline underline-offset-4 transition-colors hover:text-[hsl(28_35%_22%)]"
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

const Field = ({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <Label className="mb-1.5 block text-sm font-medium text-foreground">{label}</Label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      {children}
    </div>
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);

export default Register;
