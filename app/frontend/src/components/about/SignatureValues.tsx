import { motion } from "framer-motion";
import { Award, Paintbrush, Ruler, Heart } from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Crafted Quality",
    desc: "Every piece is built from responsibly sourced hardwoods and premium upholstery, finished by skilled artisans who take pride in every joint and detail.",
  },
  {
    icon: Paintbrush,
    title: "Warm, Timeless Materials",
    desc: "Our curated palette of natural stains and soft fabrics ensures your furniture ages gracefully alongside your home — developing character, not wear.",
  },
  {
    icon: Ruler,
    title: "Designed for Real Homes",
    desc: "From compact bedside tables to statement sofas, each design is proportioned for real Sri Lankan spaces, balancing beauty with everyday function.",
  },
  {
    icon: Heart,
    title: "Comfort in Every Detail",
    desc: "Ergonomic cushioning, smooth drawer glides, perfectly weighted doors — comfort lives in the details you don't notice until they're missing.",
  },
];

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const SignatureValues = () => (
  <section className="bg-warm-cream/50 py-20 lg:py-28">
    <div className="container max-w-5xl">
      <motion.div {...fade} transition={{ duration: 0.5 }} className="mb-14 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-warm-walnut">
          Our Values
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-foreground lg:text-4xl">
          What Defines Casa Ceylon
        </h2>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-2">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            {...fade}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex gap-5 rounded-xl border border-border/60 bg-background p-6 shadow-sm transition-shadow hover:shadow-card"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-warm-walnut/10">
              <v.icon className="h-5 w-5 text-warm-walnut" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SignatureValues;
