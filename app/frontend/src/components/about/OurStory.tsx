import { motion } from "framer-motion";
import livingImg from "@/assets/rooms/living.jpg";

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const OurStory = () => (
  <section className="py-20 lg:py-28">
    <div className="container">
      {/* Section label + heading */}
      <motion.div {...fade} className="mb-12 max-w-2xl space-y-4">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-warm-walnut">
          Our Story
        </span>
        <h2 className="font-display text-3xl font-semibold leading-snug text-foreground lg:text-4xl">
          Furniture shaped by warmth, simplicity, and Sri&nbsp;Lankan craftsmanship
        </h2>
      </motion.div>

      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left — image */}
        <motion.div {...fade} className="overflow-hidden rounded-xl shadow-card">
          <img
            src={livingImg}
            alt="Casa Ceylon styled living room"
            className="aspect-[4/3] w-full object-cover"
          />
        </motion.div>

        {/* Right — narrative */}
        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.15 }} className="space-y-5">
          <p className="text-base leading-relaxed text-muted-foreground">
            Casa Ceylon was born from a simple belief: your home should feel as considered as a boutique hotel, yet as comfortable as a favourite armchair. We partner with local craftspeople across Sri Lanka to design furniture that balances clean, contemporary lines with the warmth of natural materials — teak, oak, walnut, linen, and brass.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Every collection is curated rather than mass-produced. We focus on pieces that last, that patina beautifully, and that fit the proportions of real homes — from compact Colombo apartments to spacious upcountry retreats.
          </p>
          <blockquote className="mt-4 border-l-2 border-warm-walnut pl-5 italic text-foreground/80">
            "We design for the way life actually happens — unhurried mornings, shared dinners, quiet evenings."
          </blockquote>
        </motion.div>
      </div>
    </div>
  </section>
);

export default OurStory;
