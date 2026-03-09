import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Move, Box } from "lucide-react";
import { motion } from "framer-motion";
import tryInRoomImage from "@/assets/try-in-room-feature.png";

const features = [
  { icon: Eye, title: "Visualize before you buy" },
  { icon: Move, title: "Test placement and styles" },
  { icon: Box, title: "Explore your room in 3D" },
];

const TryInRoomSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        {/* Premium container */}
        <div className="relative rounded-2xl bg-background border-2 border-warm-tan/40 shadow-[0_8px_40px_-12px_hsl(30_20%_40%/0.1)] overflow-hidden">
          {/* Subtle decorative background shape */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-warm-cream/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-warm-tan/10 blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] p-8 sm:p-12 lg:p-16 xl:p-20">
            {/* Left — Text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
                <span className="w-6 h-px bg-warm-tan" />
                Try It in Your Room
              </span>

              {/* Heading */}
              <h2 className="font-display text-4xl font-normal leading-[1.12] text-foreground lg:text-[3.25rem] xl:text-[3.5rem]">
                Design Your Space
                <br />
                <span className="italic">Before You Buy</span>
              </h2>

              {/* Paragraph */}
              <p className="mt-6 max-w-md text-[15px] leading-[1.75] text-muted-foreground">
                Visualize Casa Ceylon furniture inside your own room, explore
                layouts, and make confident design choices with our immersive
                room preview experience.
              </p>

              {/* Feature highlights */}
              <div className="mt-10 flex flex-col gap-4">
                {features.map(({ icon: Icon, title }) => (
                  <div key={title} className="flex items-center gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.06] border border-foreground/[0.04]">
                      <Icon size={16} strokeWidth={1.5} className="text-foreground/60" />
                    </span>
                    <span className="text-[13px] font-medium tracking-wide text-foreground/75">
                      {title}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                asChild
                size="lg"
                className="mt-12 w-fit bg-[hsl(28_35%_32%)] hover:bg-[hsl(28_35%_26%)] text-white text-[12.5px] font-medium uppercase tracking-[0.15em] px-10 h-12 rounded-lg shadow-[0_4px_16px_-4px_hsl(28_35%_32%/0.35)] hover:shadow-[0_6px_20px_-4px_hsl(28_35%_32%/0.45)] transition-all duration-300"
              >
                <Link to="/designer">Try It in Your Room</Link>
              </Button>
            </motion.div>

            {/* Right — Visual */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              {/* Soft glow behind image */}
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-warm-tan/15 via-warm-cream/20 to-transparent blur-2xl pointer-events-none" />

              <div className="relative overflow-hidden rounded-xl shadow-[0_16px_48px_-12px_hsl(30_20%_20%/0.18)] ring-1 ring-foreground/[0.05]">
                <img
                  src={tryInRoomImage}
                  alt="Casa Ceylon's interactive room designer — visualize furniture in your space"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-3 left-6 flex items-center gap-2.5 rounded-xl bg-background/95 backdrop-blur-sm px-5 py-3 shadow-lg ring-1 ring-foreground/[0.06]">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground">
                  <Box size={13} className="text-background" />
                </span>
                <span className="text-[11.5px] font-semibold tracking-wide text-foreground">
                  3D Room Preview
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryInRoomSection;
