import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/mock";

const FAQTeaser = () => {
  return (
    <section className="bg-warm-cream py-16 lg:py-24">
      <div className="container">
        <h2 className="text-center font-display text-3xl font-semibold text-foreground lg:text-4xl">
          Frequently asked
        </h2>

        <div className="mx-auto mt-10 max-w-2xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="overflow-hidden rounded-xl border-none bg-card px-6 shadow-card"
              >
                <AccordionTrigger className="py-4 text-left font-display text-base font-semibold text-foreground hover:no-underline sm:text-lg">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/faq">Read all FAQs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQTeaser;
