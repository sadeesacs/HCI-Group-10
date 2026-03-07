import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { inspirationRooms } from "@/data/mock";

import livingImg from "@/assets/rooms/living.jpg";
import diningImg from "@/assets/rooms/dining.jpg";
import bedroomImg from "@/assets/rooms/bedroom.jpg";
import officeImg from "@/assets/rooms/office.jpg";
import smallImg from "@/assets/rooms/small-spaces.jpg";
import outdoorImg from "@/assets/rooms/outdoor.jpg";

const roomImages: Record<string, string> = {
  "1": livingImg,
  "2": diningImg,
  "3": bedroomImg,
  "4": officeImg,
  "5": smallImg,
  "6": outdoorImg,
};

const InspirationTeaser = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground lg:text-4xl">
            Room inspiration
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Curated looks to spark your next home project.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inspirationRooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                to="/inspiration"
                className="group relative block aspect-[4/3] overflow-hidden rounded-xl"
              >
                <img
                  src={roomImages[room.id]}
                  alt={room.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="font-display text-xl font-semibold text-primary-foreground">
                    {room.label}
                  </h3>
                  <p className="mt-0.5 text-xs text-primary-foreground/80">{room.subtitle}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/inspiration">Explore Inspiration</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InspirationTeaser;
