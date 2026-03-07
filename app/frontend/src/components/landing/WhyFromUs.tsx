import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import chair1 from "@/assets/products/chair-1.jpg";
import armchair1 from "@/assets/products/armchair-1.jpg";

const WhyFromUs = () => {
  const fade = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container">
        <motion.div {...fade} className="text-center">
          <Badge 
            variant="outline" 
            className="mb-8 rounded-full border-border px-6 py-2 text-sm font-medium uppercase tracking-wider text-muted-foreground"
          >
            Why From Us?
          </Badge>

          <h2 className="font-display mx-auto max-w-5xl text-4xl font-normal leading-tight text-foreground sm:text-5xl lg:text-6xl">
            We are crafting amazing{" "}
            <img 
              src={chair1} 
              alt="furniture" 
              className="inline-block h-14 w-14 object-cover rounded-lg align-middle sm:h-16 sm:w-16 lg:h-20 lg:w-20" 
            />{" "}
            products that{" "}
            <img 
              src={armchair1} 
              alt="furniture" 
              className="inline-block h-14 w-14 object-cover rounded-lg align-middle sm:h-16 sm:w-16 lg:h-20 lg:w-20" 
            />{" "}
            delight, constantly uplift the home, office{" "}
            <img 
              src={chair1} 
              alt="furniture" 
              className="inline-block h-14 w-14 object-cover rounded-lg align-middle sm:h-16 sm:w-16 lg:h-20 lg:w-20" 
            />{" "}
            environment
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyFromUs;
