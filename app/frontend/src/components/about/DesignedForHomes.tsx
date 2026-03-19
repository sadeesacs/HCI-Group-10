import { motion } from "framer-motion";
import { Building2, Home, TreePine } from "lucide-react";

const lifestyles = [
  {
    icon: Building2,
    title: "Compact City Apartments",
    desc: "Space-smart designs that maximise every square foot without sacrificing style or comfort.",
  },
  {
    icon: Home,
    title: "Family Homes",
    desc: "Durable, beautiful pieces built for the rhythm of daily life — spills, play, and all.",
  },
  {
    icon: TreePine,
    title: "Calm Retreat Spaces",
    desc: "Understated furniture for upcountry villas and coastal homes that invite slow, restful living.",
  },
];

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const DesignedForHomes = () => (
  <section className="py-20 lg:py-28">
    <div className="container max-w-5xl">
      <motion.div {...fade} transition={{ duration: 0.5 }} className="mb-14 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-warm-walnut">
          For Every Lifestyle
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-foreground lg:text-4xl">
          Designed for Real Homes
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Whether you live in a Colombo studio or a hill-country estate, our furniture is proportioned and styled for the way Sri Lankans actually live.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-3">
        {lifestyles.map((l, i) => (
          <motion.div
            key={l.title}
            {...fade}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-xl border border-border/60 bg-warm-cream/40 p-8 text-center transition-shadow hover:shadow-card"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warm-walnut/10">
              <l.icon className="h-6 w-6 text-warm-walnut" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">{l.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DesignedForHomes;
