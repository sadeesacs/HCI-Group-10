import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
const heroImg = "/assets/about-hero.jpg";

const AboutHero = () => (
  <section className="relative h-[85vh] min-h-[540px] overflow-hidden">
    <img
      src={heroImg}
      alt="Casa Ceylon showroom interior"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-warm-walnut-dark/80 via-warm-walnut-dark/50 to-transparent" />
    <div className="relative z-10 flex h-full items-center justify-center">
      <div className="container flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl space-y-6 text-center"
        >
          <span className="inline-block text-xs font-medium uppercase tracking-[0.25em] text-warm-cream/80">
            Est. 2019 · Colombo, Sri Lanka
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            About Casa Ceylon
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-primary-foreground/80 lg:text-lg">
            Craftsmanship, comfort, and curated design for warm modern living.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              asChild
              className="rounded-sm bg-warm-walnut px-6 text-primary-foreground hover:bg-warm-walnut/90"
            >
              <a href="#showroom">
                <MapPin className="mr-1.5 h-4 w-4" /> Visit Showroom
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-sm border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <a href="#contact">
                Contact Us <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutHero;
