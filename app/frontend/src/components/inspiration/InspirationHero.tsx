import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Compass } from "lucide-react";
const heroImg = "/assets/inspiration-hero.jpg";

const InspirationHero = () => (
  <section className="relative h-[85vh] min-h-[540px] overflow-hidden">
    <img
      src={heroImg}
      alt="Warm modern living room inspiration"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-warm-walnut-dark/60 via-warm-walnut-dark/40 to-warm-walnut-dark/70" />

    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="font-display max-w-3xl text-4xl font-semibold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl"
      >
        Find inspiration for the way you live
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-warm-cream/80 sm:text-lg"
      >
        Explore curated room ideas, moods, and styled spaces — designed to help you imagine your perfect home.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        <Button
          size="lg"
          className="bg-warm-walnut px-8 text-white hover:bg-warm-walnut-dark rounded-sm h-11"
          onClick={() =>
            document.getElementById("browse-looks")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <ArrowDown className="mr-1.5 h-4 w-4" /> Browse Looks
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 rounded-sm h-11 px-8"
        >
          <Link to="/designer">
            <Compass className="mr-1.5 h-4 w-4" /> Try In Your Room
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default InspirationHero;
