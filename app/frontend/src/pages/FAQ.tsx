import { Link } from "react-router-dom";
import { MessageCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface FaqEntry { q: string; a: string; category: string }

const allFaqs: FaqEntry[] = [
  { category: "Ordering", q: "How do I place an order?", a: "Browse our shop, add items to your cart, and proceed to checkout. You can choose delivery or showroom pickup. Once your order is confirmed, we'll send you a confirmation with your Order ID." },
  { category: "Ordering", q: "Can I modify my order after placing it?", a: "Yes — if your order hasn't entered production or dispatch, our team can adjust quantities, colours, or delivery details. Please contact us with your Order ID as soon as possible." },
  { category: "Ordering", q: "Do you offer assembly services?", a: "We offer professional assembly for larger pieces such as bookshelves, sideboards, and dining tables. Assembly can be added at checkout or requested after delivery for a small fee." },
  { category: "Customisation", q: "Do you offer custom sizes?", a: "Most of our furniture lines can be customised in size. Reach out to our design team with your measurements and we'll provide a quote within 48 hours." },
  { category: "Customisation", q: "Can I request a different finish or fabric?", a: "Absolutely. We offer a curated palette of wood stains, fabric swatches, and metal finishes. You can preview combinations using our 'Try in Your Room' tool before ordering." },
  { category: "Customisation", q: "How long do custom orders take?", a: "Custom orders typically take 3–6 weeks depending on the piece and the level of customisation. We'll keep you updated at every stage of production." },
  { category: "Delivery", q: "Where do you deliver?", a: "We deliver island-wide across Sri Lanka. Colombo metro orders enjoy express 2-day delivery on in-stock items. For other regions, standard delivery takes 5–10 business days." },
  { category: "Delivery", q: "How long does delivery take?", a: "Standard delivery is 5–10 business days. Express delivery (Colombo metro) is 2 business days for in-stock items. Custom orders may take longer — we'll confirm timelines when your order is placed." },
  { category: "Delivery", q: "What if I'm not sure my address is accurate?", a: "At checkout you can drop a pin on our map to mark your exact location. If you're unsure, select 'Not sure' and our delivery team will contact you to confirm before dispatch." },
  { category: "Delivery", q: "How does the map pin at checkout help?", a: "The interactive map lets you place a marker on your precise delivery location. This helps our drivers find you quickly, especially in areas where street addresses can be ambiguous." },
  { category: "Payments", q: "What payment methods do you accept?", a: "We accept bank transfers, major credit and debit cards, and cash on delivery for orders within Colombo metro. Additional payment options are being added soon." },
  { category: "Payments", q: "Is payment secure?", a: "Your payment details are handled securely. This is currently a demo storefront — no real transactions are processed. When we go live, all payments will be encrypted end-to-end." },
];

const FAQ = () => {
  return (
    <>
      {/* Hero header */}
      <section className="bg-warm-cream pt-28 pb-10 lg:pt-32 lg:pb-12">
        <div className="container max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl font-semibold tracking-wide text-foreground lg:text-5xl"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-base text-muted-foreground lg:text-lg"
          >
            Quick answers to questions you may have about our furniture and services.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Button asChild variant="outline" size="lg" className="border-warm-walnut text-warm-walnut hover:bg-warm-walnut hover:text-white">
              <Link to="/shop">
                <BookOpen className="mr-1.5 h-4 w-4" /> Browse shop
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-warm-walnut text-white hover:bg-warm-walnut-dark">
              <Link to="/about#contact">
                <MessageCircle className="mr-1.5 h-4 w-4" /> Get in touch
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ list */}
      <section className="container max-w-3xl py-10 lg:py-16">
        <Accordion type="single" collapsible className="w-full">
          {allFaqs.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border-b border-border px-0"
            >
              <AccordionTrigger className="py-5 text-left font-display text-base font-medium text-foreground hover:no-underline sm:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col items-center gap-3 rounded-xl border-2 border-warm-tan/30 bg-warm-cream/50 px-8 py-10 text-center">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Still have questions?
          </h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Our team is happy to assist with anything — from custom orders to delivery queries.
          </p>
          <Button asChild className="mt-2 bg-warm-walnut text-white hover:bg-warm-walnut-dark">
            <Link to="/about#contact">
              <MessageCircle className="mr-1.5 h-4 w-4" /> Contact us
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default FAQ;
