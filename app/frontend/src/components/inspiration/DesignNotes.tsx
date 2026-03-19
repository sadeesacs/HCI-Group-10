import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const tips = [
  "Use lighter wood tones to open up compact rooms and create an airy feel.",
  "Low-profile furniture helps small spaces feel more balanced and grounded.",
  "Warm neutrals create a calm, welcoming home — layer textures for depth.",
  "A single statement piece can anchor an entire room's personality.",
];

const DesignNotes = () => (
  <section className="bg-warm-cream py-16 lg:py-20">
    <div className="container max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 text-center"
      >
        <h2 className="font-display text-2xl font-semibold text-foreground lg:text-3xl">
          Design Notes
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Small ideas that make a big difference.
        </p>
      </motion.div>

      <div className="space-y-4">
        {tips.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
          >
            <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-warm-walnut" />
            <p className="text-sm leading-relaxed text-foreground">{tip}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DesignNotes;
