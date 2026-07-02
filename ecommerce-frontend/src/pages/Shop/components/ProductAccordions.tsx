import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ProductAccordions = () => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
        Details
      </h3>
      <Accordion type="single" collapsible defaultValue="materials" className="space-y-4">
        <AccordionItem value="materials" className="bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/50 px-4">
          <AccordionTrigger className="font-label-md text-label-md text-on-surface hover:no-underline">
            Materials & Care
          </AccordionTrigger>
          <AccordionContent className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            <ul className="list-disc pl-5 space-y-2 pb-2">
              <li>80% Merino Wool, 20% Polyamide</li>
              <li>Lining: 100% Cupro</li>
              <li>Dry clean only</li>
              <li>Do not bleach</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="shipping" className="bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/50 px-4">
          <AccordionTrigger className="font-label-md text-label-md text-on-surface hover:no-underline">
            Shipping & Returns
          </AccordionTrigger>
          <AccordionContent className="font-body-md text-body-md text-on-surface-variant leading-relaxed pb-2">
            Free standard shipping on orders over ₹999. Returns accepted within 30 days of delivery with original tags attached.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="warranty" className="bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/50 px-4">
          <AccordionTrigger className="font-label-md text-label-md text-on-surface hover:no-underline">
            Warranty
          </AccordionTrigger>
          <AccordionContent className="font-body-md text-body-md text-on-surface-variant leading-relaxed pb-2">
            All Kraya outerwear is covered by a 1-year limited warranty against manufacturing defects.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
