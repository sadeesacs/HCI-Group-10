import { motion } from "framer-motion";
import { Quote, Star, User } from "lucide-react";

const testimonials = [
  {
    quote:
      "We were able to visualize everything before buying, and it made choosing the right pieces so much easier.",
    name: "Nadeesha",
    location: "Colombo",
    rating: 5,
  },
  {
    quote:
      "The furniture looks even better in person. The whole experience felt premium from browsing to delivery.",
    name: "Tharindu",
    location: "Kandy",
    rating: 5,
    featured: true,
  },
  {
    quote:
      "I loved being able to test how the furniture would look in my room before making a decision.",
    name: "Imesha",
    location: "Galle",
    rating: 5,
  },
  {
    quote:
      "The quality exceeded my expectations. Every detail is beautifully crafted and built to last.",
    name: "Roshan",
    location: "Negombo",
    rating: 5,
    featured: true,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
            <span className="w-6 h-px bg-warm-tan" />
            Customer Stories
            <span className="w-6 h-px bg-warm-tan" />
          </span>
          <h2 className="font-serif text-3xl font-normal leading-snug text-foreground lg:text-[2.75rem]">
            Loved by Homes Across Sri Lanka
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-muted-foreground max-w-lg mx-auto">
            From living rooms to dining spaces, our customers choose Casa Ceylon
            for timeless furniture and a more confident way to design their
            homes.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-xl border p-6 transition-shadow duration-300 ${
                t.featured
                  ? "bg-warm-cream/50 border-warm-tan/30 shadow-md"
                  : "bg-background border-border shadow-sm hover:shadow-md"
              }`}
            >
              {/* Quote icon */}
              <Quote
                size={22}
                strokeWidth={1}
                className="fill-warm-tan/20 text-warm-tan mb-4 -scale-x-100"
              />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star
                    key={s}
                    size={12}
                    className="fill-warm-tan text-warm-tan"
                  />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="flex-1 text-[13px] leading-[1.75] text-foreground/80 italic font-serif">
                "{t.quote}"
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-cream border border-warm-beige text-warm-tan">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold tracking-wide text-foreground">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
