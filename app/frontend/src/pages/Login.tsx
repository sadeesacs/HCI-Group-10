import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loginUser } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser({ email, password });
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUser", JSON.stringify(result.user));
      window.dispatchEvent(new Event("auth-changed"));
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to log in";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-warm-cream via-background to-warm-beige px-4 pt-[4.5rem]">
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
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Log in to save designs and continue where you left off.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  maxLength={255}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  maxLength={128}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 bg-[hsl(28_35%_32%)] text-white hover:bg-[hsl(28_35%_26%)] h-11 text-sm font-semibold tracking-wide"
            >
              <LogIn className="h-4 w-4" /> {loading ? "Signing in..." : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[hsl(28_35%_32%)] underline underline-offset-4 transition-colors hover:text-[hsl(28_35%_22%)]"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Login;
