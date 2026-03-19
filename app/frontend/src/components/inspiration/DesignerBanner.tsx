import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
const bannerImg = "/assets/inspiration-designer-banner.jpg";

const DesignerBanner = () => (
  <section className="relative overflow-hidden py-0">
    <div className="relative h-[420px] lg:h-[480px]">
      <img
        src={bannerImg}
        alt="Room designer preview"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-warm-walnut-dark/80 via-warm-walnut-dark/60 to-transparent" />

      <div className="relative z-10 flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container max-w-xl space-y-5 py-12 text-center"
        >
          <h2 className="font-display text-3xl font-semibold text-primary-foreground lg:text-4xl">
            Try the look in your own room
          </h2>
          <p className="text-base leading-relaxed text-warm-cream/80">
            Use any inspiration as a starting point — then preview furniture layouts in your
            own space with our interactive Room Designer.
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-sm border-2 border-warm-cream/60 bg-transparent px-8 text-primary-foreground hover:bg-warm-cream/10"
          >
            <Link to="/designer">
              <Compass className="mr-1.5 h-4 w-4" /> Open Room Designer
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);

export default DesignerBanner;
