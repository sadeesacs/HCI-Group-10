import { motion } from "framer-motion";
import { Search, Box, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Choose furniture",
    description: "Browse our curated collection of handcrafted pieces designed for modern Sri Lankan homes.",
  },
  {
    icon: Box,
    title: "Try it in your room",
    description: "Use our room designer to preview layouts and see how each piece fits your space.",
  },
  {
    icon: ShieldCheck,
    title: "Checkout with confidence",
    description: "Order online with free delivery, easy returns, and a 2-year structural warranty.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-warm-cream py-16 lg:py-24">
      <div className="container">
        <h2 className="text-center font-display text-3xl font-semibold text-foreground lg:text-4xl">
          How it works
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                <step.icon size={28} strokeWidth={1.5} className="text-accent" />
              </div>
              <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Step {i + 1}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
