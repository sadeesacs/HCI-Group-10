import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import livingImg from "@/assets/rooms/living.jpg";
import diningImg from "@/assets/rooms/dining.jpg";
import bedroomImg from "@/assets/rooms/bedroom.jpg";
import smallImg from "@/assets/rooms/small-spaces.jpg";
import outdoorImg from "@/assets/rooms/outdoor.jpg";

const collections = [
  { title: "Minimal Living Essentials", img: livingImg, link: "/shop?category=Living" },
  { title: "Warm Dining Moments", img: diningImg, link: "/shop?category=Dining" },
  { title: "Bedroom Calm & Comfort", img: bedroomImg, link: "/shop?category=Bedroom" },
  { title: "Smart Small-Space Styling", img: smallImg, link: "/shop?category=Small+Spaces" },
  { title: "Outdoor Relaxation Setup", img: outdoorImg, link: "/shop?category=Outdoor" },
];

const CuratedCollections = () => (
  <section className="py-16 lg:py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <h2 className="font-display text-3xl font-semibold text-foreground lg:text-4xl">
          Curated Collections
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Themed bundles to make furnishing effortless.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {collections.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <Link
              to={c.link}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border-2 border-border"
            >
              <img
                src={c.img}
                alt={c.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-walnut-dark/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-sm font-semibold leading-snug text-primary-foreground lg:text-base">
                  {c.title}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-warm-cream/70 transition-colors group-hover:text-warm-cream">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CuratedCollections;
