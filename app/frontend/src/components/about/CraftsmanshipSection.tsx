import { motion } from "framer-motion";
import craftsmanshipImg from "@/assets/about-craftsmanship.jpg";

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const steps = [
  { label: "Material Selection", desc: "Hand-picked teak, oak, and walnut sourced from sustainable Sri Lankan suppliers." },
  { label: "Artisan Workshop", desc: "Skilled carpenters shape each piece using techniques refined over generations." },
  { label: "Finishing & Detail", desc: "Natural stains, hand-rubbed oils, and precision hardware bring every design to life." },
  { label: "Showroom to Home", desc: "Personal consultation, white-glove delivery, and styling guidance included." },
];

const CraftsmanshipSection = () => (
  <section className="py-20 lg:py-28">
    <div className="container">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <motion.div {...fade} className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-xl shadow-card">
            <img
              src={craftsmanshipImg}
              alt="Artisan craftsmanship — hand-finishing teak furniture"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="order-1 space-y-6 lg:order-2"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-warm-walnut">
            The Process
          </span>
          <h2 className="font-display text-3xl font-semibold leading-snug text-foreground lg:text-4xl">
            From material to living&nbsp;space
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Behind every piece is a network of carpenters, upholsterers, and metalworkers whose skills have been refined over generations. We believe furniture should tell a story of the hands that shaped it.
          </p>

          <div className="mt-4 space-y-4">
            {steps.map((s, i) => (
              <div key={s.label} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-walnut text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{s.label}</h4>
                  <p className="mt-0.5 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CraftsmanshipSection;
