import { motion } from "framer-motion";
import { MapPin, Clock, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import showroomImg from "@/assets/about-showroom.jpg";

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const ShowroomSection = () => (
  <section id="showroom" className="bg-warm-walnut-dark py-20 lg:py-28">
    <div className="container">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <motion.div {...fade}>
          <div className="overflow-hidden rounded-xl">
            <img
              src={showroomImg}
              alt="Casa Ceylon Colombo showroom"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </motion.div>

        {/* Details */}
        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-6">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
            Experience In Person
          </span>
          <h2 className="font-display text-3xl font-semibold text-primary-foreground lg:text-4xl">
            Visit Our Colombo Showroom
          </h2>
          <p className="text-base leading-relaxed text-primary-foreground/70">
            Experience every texture, finish, and silhouette in person. Our in-house design team can walk you through wood samples, fabric swatches, and layout possibilities — or join a virtual consultation from anywhere on the island.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { icon: MapPin, text: "42 Galle Road, Colombo 03, Sri Lanka" },
              { icon: Clock, text: "Mon–Sat 10 AM–7 PM · Sun 11 AM–5 PM" },
              { icon: Phone, text: "+94 11 234 5678" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0 text-warm-tan" />
                <span className="text-sm text-primary-foreground/80">{item.text}</span>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="mt-2 rounded-sm border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            Get Directions <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ShowroomSection;
