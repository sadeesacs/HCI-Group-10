import { motion } from "framer-motion";

const PhilosophyQuote = () => (
  <section className="bg-warm-cream/50 py-16 lg:py-24">
    <div className="container max-w-3xl text-center">
      <motion.blockquote
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <span className="font-display text-5xl leading-none text-warm-walnut/30">"</span>
        <p className="font-display text-2xl font-medium italic leading-relaxed text-foreground lg:text-3xl">
          We believe furniture should feel calm, useful, and lasting — pieces that belong naturally in everyday life.
        </p>
        <p className="pt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          — The Casa Ceylon Team
        </p>
      </motion.blockquote>
    </div>
  </section>
);

export default PhilosophyQuote;
