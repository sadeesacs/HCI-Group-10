import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const livingImg = "/assets/rooms/living.jpg";
const diningImg = "/assets/rooms/dining.jpg";
const bedroomImg = "/assets/rooms/bedroom.jpg";
const officeImg = "/assets/rooms/office.jpg";
const smallImg = "/assets/rooms/small-spaces.jpg";
const outdoorImg = "/assets/rooms/outdoor.jpg";

export interface LookItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  mood: string;
  tags: string[];
  image: string;
}

export const allLooks: LookItem[] = [
  {
    id: "l1",
    title: "Warm Minimal Living",
    caption: "A serene space built on natural textures and soft light.",
    category: "Living",
    mood: "Warm Minimal",
    tags: ["Minimal", "Beige", "Warm"],
    image: livingImg,
  },
  {
    id: "l2",
    title: "Elegant Dinner Setting",
    caption: "Classic oak table anchoring a welcoming dining room.",
    category: "Dining",
    mood: "Hosting Ready",
    tags: ["Oak", "Classic", "Spacious"],
    image: diningImg,
  },
  {
    id: "l3",
    title: "Restful Retreat",
    caption: "Calm walnut tones for a bedroom that invites rest.",
    category: "Bedroom",
    mood: "Calm Retreat",
    tags: ["Cozy", "Walnut", "Compact"],
    image: bedroomImg,
  },
  {
    id: "l4",
    title: "Productive & Stylish Office",
    caption: "Focused workspace with brass accents and clean lines.",
    category: "Office",
    mood: "Work Focus",
    tags: ["Modern", "Brass", "Focused"],
    image: officeImg,
  },
  {
    id: "l5",
    title: "Small Space Solutions",
    caption: "Smart furniture choices that make compact rooms shine.",
    category: "Small Spaces",
    mood: "Urban Compact",
    tags: ["Compact", "Smart", "Bright"],
    image: smallImg,
  },
  {
    id: "l6",
    title: "Outdoor Comfort",
    caption: "Bring the warmth of home to your balcony or patio.",
    category: "Outdoor",
    mood: "Modern Tropical",
    tags: ["Outdoor", "Natural", "Relaxed"],
    image: outdoorImg,
  },
];

interface Props {
  items: LookItem[];
}

const LookCard = ({
  item,
  className = "",
  aspectClass = "aspect-[4/3]",
}: {
  item: LookItem;
  className?: string;
  aspectClass?: string;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className={className}
  >
    <div className="group relative h-full overflow-hidden rounded-2xl border-2 border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      <div className={`relative overflow-hidden ${aspectClass}`}>
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.caption}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="border border-border text-[11px] font-normal"
            >
              {t}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const EditorialGrid = ({ items }: Props) => {
  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">No looks match your filters. Try a different combination.</p>
      </div>
    );
  }

  const featured = items[0];
  const secondary = items.slice(1, 3);
  const rest = items.slice(3);

  return (
    <section className="container py-14 lg:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <h2 className="font-display text-3xl font-semibold text-foreground lg:text-4xl">
          Curated Looks
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Each look is styled to spark ideas for your next home project.
        </p>
      </motion.div>

      {/* Featured + 2 supporting */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LookCard item={featured} aspectClass="aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[480px]" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {secondary.map((item) => (
            <LookCard key={item.id} item={item} aspectClass="aspect-[16/10]" />
          ))}
        </div>
      </div>

      {/* Remaining cards */}
      {rest.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => (
            <LookCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default EditorialGrid;
