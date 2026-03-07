import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-living-room.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Warm living room with wooden furniture and natural sunlight"
          className="h-full w-full object-cover"
        />
        {/* Layered overlays for text & navbar readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(30_18%_8%/0.35)] via-[hsl(30_15%_10%/0.15)] to-[hsl(30_12%_12%/0.05)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[hsl(30_18%_8%/0.18)] to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 text-[12px] font-medium uppercase tracking-[0.22em] text-white/50"
          >
            Crafted in Sri Lanka
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-[2.5rem] font-bold leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem]"
          >
            Furniture for{" "}
            <span className="italic font-normal">warm</span>,{" "}
            modern living.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65 sm:text-base"
          >
            Timeless pieces crafted from natural materials, designed to make every room feel like home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="bg-[hsl(28_35%_32%)] hover:bg-[hsl(28_35%_26%)] text-white text-[13px] font-medium uppercase tracking-wider px-7 h-11 rounded-sm"
            >
              <Link to="/shop">
                Shop Furniture <ArrowRight className="ml-2" size={15} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/8 text-white hover:bg-white/15 hover:text-white text-[13px] font-medium uppercase tracking-wider px-7 h-11 rounded-sm backdrop-blur-sm"
            >
              <Link to="/designer">Try in Your Room</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
