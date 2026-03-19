import { motion } from "framer-motion";
const step1Image = "/assets/steps/step-1-room-layout.jpg";
const step2Image = "/assets/steps/step-2-place-furniture.jpg";
const step3Image = "/assets/steps/step-3-preview-3d.jpg";

const steps = [
  {
    image: step1Image,
    label: "Step 1:",
    title: "Choose Your Room",
    description:
      "Start with your room layout designing.",
  },
  {
    image: step2Image,
    label: "Step 2:",
    title: "Place Your Furniture",
    description:
      "Add Casa Ceylon furniture, move pieces around, and test different styles.",
  },
  {
    image: step3Image,
    label: "Step 3:",
    title: "Preview in 3D",
    description:
      "See how everything looks together and make confident design decisions before you buy.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 lg:py-20 bg-warm-cream/40">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 lg:mb-12"
        >
          <h2 className="font-serif text-3xl font-normal leading-snug text-foreground lg:text-[2.75rem]">
            How It Works
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground max-w-md mx-auto font-medium">
            Design your space in three simple steps
          </p>
        </motion.div>

        {/* Steps row */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Image */}
              <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Arrow removed to prevent overflow */}

              {/* Text below image */}
              <h3 className="mt-5 font-serif text-lg font-normal leading-snug text-foreground lg:text-xl">
                <span className="font-semibold">{step.label}</span>{" "}
                {step.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.7] text-muted-foreground max-w-[280px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
