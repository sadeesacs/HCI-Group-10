import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    toast.success("OTP verified (demo)");
    navigate("/reset-password");
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
          to="/forgot-password"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Verify your email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We've sent a verification code to your email. Enter it below.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-md sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputsRef.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-12 w-12 rounded-xl border border-input bg-background text-center text-lg font-semibold text-foreground shadow-sm transition-all focus:border-[hsl(28_35%_32%)] focus:outline-none focus:ring-2 focus:ring-[hsl(28_35%_32%/0.25)] sm:h-14 sm:w-14"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full gap-2 bg-[hsl(28_35%_32%)] text-white hover:bg-[hsl(28_35%_26%)] h-11 text-sm font-semibold tracking-wide"
            >
              <ShieldCheck className="h-4 w-4" /> Verify OTP
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={() => toast.success("Code resent (demo)")}
              className="font-semibold text-[hsl(28_35%_32%)] underline underline-offset-4 transition-colors hover:text-[hsl(28_35%_22%)]"
            >
              Resend
            </button>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default VerifyOtp;
