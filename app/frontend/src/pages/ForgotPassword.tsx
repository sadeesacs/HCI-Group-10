import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Verification code sent (demo)");
    navigate("/verify-otp");
  };

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-warm-cream via-background to-warm-beige px-4 pt-[4.5rem]">
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
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we'll send you a verification code.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-md sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-foreground">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  maxLength={255}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 bg-[hsl(28_35%_32%)] text-white hover:bg-[hsl(28_35%_26%)] h-11 text-sm font-semibold tracking-wide"
            >
              <Send className="h-4 w-4" /> Send OTP
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-[hsl(28_35%_32%)] underline underline-offset-4 transition-colors hover:text-[hsl(28_35%_22%)]"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default ForgotPassword;
