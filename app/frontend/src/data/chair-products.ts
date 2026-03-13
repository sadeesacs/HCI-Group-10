import midCenturyArmchair1 from "@/assets/products/chairs/mid-century-armchair-1.jpg";
import midCenturyArmchair2 from "@/assets/products/chairs/mid-century-armchair-2.jpg";
import midCenturyArmchair3 from "@/assets/products/chairs/mid-century-armchair-3.jpg";
import velvetWingback1 from "@/assets/products/chairs/velvet-wingback-1.jpg";
import velvetWingback2 from "@/assets/products/chairs/velvet-wingback-2.jpg";
import velvetWingback3 from "@/assets/products/chairs/velvet-wingback-3.jpg";
import rattanPeacock1 from "@/assets/products/chairs/rattan-peacock-1.jpg";
import rattanPeacock2 from "@/assets/products/chairs/rattan-peacock-2.jpg";
import rattanPeacock3 from "@/assets/products/chairs/rattan-peacock-3.jpg";
import scandiOakChair1 from "@/assets/products/chairs/scandi-oak-chair-1.jpg";
import scandiOakChair2 from "@/assets/products/chairs/scandi-oak-chair-2.jpg";
import scandiOakChair3 from "@/assets/products/chairs/scandi-oak-chair-3.jpg";
import leatherButterfly1 from "@/assets/products/chairs/leather-butterfly-1.jpg";
import leatherButterfly2 from "@/assets/products/chairs/leather-butterfly-2.jpg";
import leatherButterfly3 from "@/assets/products/chairs/leather-butterfly-3.jpg";
import boucleSwivel1 from "@/assets/products/chairs/boucle-swivel-1.jpg";
import boucleSwivel2 from "@/assets/products/chairs/boucle-swivel-2.jpg";
import boucleSwivel3 from "@/assets/products/chairs/boucle-swivel-3.jpg";
import windsorChair1 from "@/assets/products/chairs/windsor-chair-1.jpg";
import windsorChair2 from "@/assets/products/chairs/windsor-chair-2.jpg";
import windsorChair3 from "@/assets/products/chairs/windsor-chair-3.jpg";
import loungeOttoman1 from "@/assets/products/chairs/lounge-ottoman-1.jpg";
import loungeOttoman2 from "@/assets/products/chairs/lounge-ottoman-2.jpg";
import loungeOttoman3 from "@/assets/products/chairs/lounge-ottoman-3.jpg";
import ropeOutdoor1 from "@/assets/products/chairs/rope-outdoor-1.jpg";
import ropeOutdoor2 from "@/assets/products/chairs/rope-outdoor-2.jpg";
import ropeOutdoor3 from "@/assets/products/chairs/rope-outdoor-3.jpg";
import ergonomicDesk1 from "@/assets/products/chairs/ergonomic-desk-1.jpg";
import ergonomicDesk2 from "@/assets/products/chairs/ergonomic-desk-2.jpg";
import ergonomicDesk3 from "@/assets/products/chairs/ergonomic-desk-3.jpg";
import tuftedAccent1 from "@/assets/products/chairs/tufted-accent-1.jpg";
import tuftedAccent2 from "@/assets/products/chairs/tufted-accent-2.jpg";
import tuftedAccent3 from "@/assets/products/chairs/tufted-accent-3.jpg";
import caneBackChair1 from "@/assets/products/chairs/cane-back-chair-1.jpg";
import caneBackChair2 from "@/assets/products/chairs/cane-back-chair-2.jpg";
import caneBackChair3 from "@/assets/products/chairs/cane-back-chair-3.jpg";

import type { Product } from "./mock";

export const chairProducts: Product[] = [
  {
    id: "chair-1",
    name: "Mid-Century Teak Armchair",
    price: 48500,
    category: "Seating",
    tag: "Best Seller",
    description: "A sculptural armchair with a solid teak frame and button-tufted cushions. Timeless mid-century design for any living space.",
    colors: ["Beige", "Charcoal", "Olive"],
    images: [midCenturyArmchair1, midCenturyArmchair2, midCenturyArmchair3],
    popularity: 92,
  },
  {
    id: "chair-2",
    name: "Velvet Wingback Chair",
    price: 67000,
    category: "Seating",
    description: "A stately wingback chair in deep emerald velvet with nailhead trim. A bold accent piece for libraries and living rooms.",
    colors: ["Emerald", "Navy", "Burgundy"],
    images: [velvetWingback1, velvetWingback2, velvetWingback3],
    popularity: 88,
  },
  {
    id: "chair-3",
    name: "Rattan Peacock Chair",
    price: 55000,
    category: "Seating",
    tag: "New",
    description: "A handwoven rattan peacock chair with a dramatic fan back. Brings bohemian warmth to sunrooms and corners.",
    colors: ["Natural", "Black"],
    images: [rattanPeacock1, rattanPeacock2, rattanPeacock3],
    isNew: true,
    popularity: 85,
  },
  {
    id: "chair-4",
    name: "Scandinavian Oak Dining Chair",
    price: 28500,
    category: "Seating",
    description: "A minimalist oak dining chair with a curved backrest and tapered legs. Light, stackable, and endlessly versatile.",
    colors: ["Natural Oak", "Walnut", "White"],
    images: [scandiOakChair1, scandiOakChair2, scandiOakChair3],
    popularity: 90,
  },
  {
    id: "chair-5",
    name: "Leather Butterfly Chair",
    price: 72000,
    category: "Seating",
    description: "An iconic butterfly chair with cognac leather sling on a powder-coated iron frame. Industrial elegance for lofts and studios.",
    colors: ["Cognac", "Black", "Tan"],
    images: [leatherButterfly1, leatherButterfly2, leatherButterfly3],
    popularity: 82,
  },
  {
    id: "chair-6",
    name: "Bouclé Swivel Chair",
    price: 89000,
    category: "Seating",
    tag: "New",
    description: "A luxurious barrel swivel chair in cream bouclé fabric on a brushed brass pedestal. Elegant comfort that turns heads.",
    colors: ["Cream", "Oatmeal", "Sage"],
    images: [boucleSwivel1, boucleSwivel2, boucleSwivel3],
    isNew: true,
    popularity: 86,
  },
  {
    id: "chair-7",
    name: "Classic Windsor Chair",
    price: 34000,
    category: "Seating",
    description: "A traditional Windsor dining chair with turned spindles and scooped seat. Hand-finished in matte black for a modern farmhouse look.",
    colors: ["Matte Black", "Natural", "White"],
    images: [windsorChair1, windsorChair2, windsorChair3],
    popularity: 78,
  },
  {
    id: "chair-8",
    name: "Lounge Chair with Ottoman",
    price: 115000,
    category: "Seating",
    tag: "Best Seller",
    description: "A generous lounge chair and matching ottoman in tufted fabric with walnut legs. The ultimate reading companion.",
    colors: ["Charcoal", "Slate Blue", "Camel"],
    images: [loungeOttoman1, loungeOttoman2, loungeOttoman3],
    popularity: 94,
  },
  {
    id: "chair-9",
    name: "Rope Weave Outdoor Chair",
    price: 58000,
    category: "Seating",
    description: "A weather-resistant outdoor lounge chair with hand-woven rope on a solid teak frame. Built for sun-soaked terraces.",
    colors: ["Natural Rope", "Grey Rope"],
    images: [ropeOutdoor1, ropeOutdoor2, ropeOutdoor3],
    popularity: 80,
  },
  {
    id: "chair-10",
    name: "Ergonomic Mesh Desk Chair",
    price: 95000,
    category: "Seating",
    description: "A high-back ergonomic desk chair with breathable mesh, adjustable lumbar support, and chrome base. All-day comfort for your office.",
    colors: ["Black", "Grey"],
    images: [ergonomicDesk1, ergonomicDesk2, ergonomicDesk3],
    popularity: 87,
  },
  {
    id: "chair-11",
    name: "Tufted Velvet Accent Chair",
    price: 52000,
    category: "Seating",
    description: "A petite tufted accent chair in dusty rose velvet with polished gold legs. A charming statement for bedrooms and dressing areas.",
    colors: ["Dusty Rose", "Ivory", "Teal"],
    images: [tuftedAccent1, tuftedAccent2, tuftedAccent3],
    popularity: 83,
  },
  {
    id: "chair-12",
    name: "Cane Back Dining Chair",
    price: 38500,
    category: "Seating",
    tag: "New",
    description: "A refined dining chair with natural cane back panel, black wooden frame, and linen seat cushion. Pairs texture with elegance.",
    colors: ["Black/Natural", "Walnut/Natural"],
    images: [caneBackChair1, caneBackChair2, caneBackChair3],
    isNew: true,
    popularity: 81,
  },
];

export const chairProductExtras: Record<string, { longDescription: string; dimensions: string; materials: string[] }> = {
  "chair-1": {
    longDescription: "The Mid-Century Teak Armchair is a faithful homage to the golden age of Scandinavian-inspired design. Its angled teak frame cradles a pair of generously padded cushions wrapped in a durable cotton-linen blend. The open-slatted back allows air to circulate, keeping you comfortable even in warm climates. Whether anchoring a conversation area or serving as a reading chair beside a floor lamp, this piece brings warmth, character, and lasting comfort to any room.",
    dimensions: "W 72 cm × D 80 cm × H 82 cm. Seat height: 42 cm.",
    materials: ["Solid plantation teak frame", "High-density foam cushions", "Cotton-linen blend upholstery", "Natural oil finish", "Spot-clean cushions", "Re-oil frame annually"],
  },
  "chair-2": {
    longDescription: "The Velvet Wingback Chair commands attention with its tall, sculpted back and deep emerald upholstery. Individual brass nailheads trace the chair's curves, adding a layer of refinement. The high-density foam seat and serpentine spring suspension provide firm yet comfortable support for hours of reading. Solid hardwood legs are finished in espresso to complement the rich velvet tone.",
    dimensions: "W 78 cm × D 82 cm × H 110 cm. Seat height: 48 cm.",
    materials: ["Kiln-dried hardwood frame", "Cotton velvet upholstery", "Serpentine spring suspension", "Brass nailhead trim", "Espresso-finished legs", "Professional cleaning recommended"],
  },
  "chair-3": {
    longDescription: "The Rattan Peacock Chair is a handcrafted statement piece that brings tropical flair to any interior. Artisans weave natural rattan into the iconic fan-shaped back over a sturdy rattan frame. The wide, scooped seat accommodates a cushion for added comfort. Lightweight enough to move between rooms yet striking enough to anchor a corner, this chair is a conversation starter wherever it lands.",
    dimensions: "W 90 cm × D 75 cm × H 140 cm. Seat height: 40 cm.",
    materials: ["Hand-woven natural rattan", "Rattan pole frame", "Optional cotton seat cushion", "Keep away from direct moisture", "Dust with a soft brush", "Apply rattan oil every 6 months"],
  },
  "chair-4": {
    longDescription: "The Scandinavian Oak Dining Chair embodies the principle that good design should be simple, functional, and beautiful. The gently curved backrest follows the natural contour of the spine, while the solid oak seat is scooped for comfort without the need for a cushion. Four tapered legs splay outward for stability. At just 4 kg, the chair is light enough to move easily and can be stacked two high for storage.",
    dimensions: "W 48 cm × D 52 cm × H 80 cm. Seat height: 45 cm.",
    materials: ["Solid European oak", "Clear matte lacquer finish", "Mortise-and-tenon joinery", "Wipe with a damp cloth", "Apply wood oil once a year"],
  },
  "chair-5": {
    longDescription: "The Leather Butterfly Chair is a design icon reimagined for contemporary living. A single piece of full-grain vegetable-tanned leather is hand-stitched and suspended from a collapsible powder-coated iron frame. The leather develops a rich patina over time, making each chair uniquely yours. The low, relaxed seating position is ideal for informal lounging in living rooms, studios, and covered outdoor spaces.",
    dimensions: "W 75 cm × D 72 cm × H 90 cm. Seat height: 38 cm.",
    materials: ["Full-grain vegetable-tanned leather", "Powder-coated iron frame", "Hand-stitched saddle seams", "Condition leather every 3 months", "Wipe frame with a dry cloth"],
  },
  "chair-6": {
    longDescription: "The Bouclé Swivel Chair is the epitome of modern luxury. Its rounded barrel silhouette is upholstered in a premium Italian bouclé fabric that's as soft to the touch as it is durable. A 360-degree swivel mechanism sits atop a brushed brass pedestal base, allowing effortless turns between conversations or views. The generous seat depth and gently angled back invite long, comfortable sits.",
    dimensions: "W 80 cm × D 78 cm × H 76 cm. Seat height: 44 cm.",
    materials: ["Italian bouclé fabric upholstery", "High-resilience foam and fibre fill", "360° swivel mechanism", "Brushed brass pedestal base", "Professional spot cleaning recommended", "Avoid direct sunlight"],
  },
  "chair-7": {
    longDescription: "The Classic Windsor Chair is a time-honoured design updated with a clean matte black finish. Each spindle is individually turned on a lathe and hand-fitted into the steam-bent hoop back. The saddle-scooped seat distributes weight comfortably without the need for a cushion. Splayed legs and an H-stretcher provide rock-solid stability. This chair works equally well around a farmhouse table or as an accent piece in a hallway.",
    dimensions: "W 46 cm × D 50 cm × H 92 cm. Seat height: 44 cm.",
    materials: ["Solid beech and ash wood", "Matte lacquer finish", "Turned spindle construction", "Steam-bent hoop back", "Wipe with a damp cloth", "Touch up finish as needed"],
  },
  "chair-8": {
    longDescription: "The Lounge Chair with Ottoman is designed for deep relaxation. The generously proportioned chair features a high back with button tufting and wide, padded armrests. The matching ottoman extends the seating into a full recline position. Both pieces share the same solid walnut base with angled legs. Premium woven fabric covers high-resilience foam for a supportive yet plush feel that holds its shape year after year.",
    dimensions: "Chair: W 82 cm × D 88 cm × H 100 cm. Ottoman: W 62 cm × D 48 cm × H 42 cm.",
    materials: ["Solid walnut base and legs", "High-resilience foam cushioning", "Button-tufted woven fabric", "Reinforced steel internal frame", "Vacuum regularly", "Professional cleaning annually"],
  },
  "chair-9": {
    longDescription: "The Rope Weave Outdoor Chair brings resort-level comfort to your terrace or garden. Each chair is handwoven using UV-stabilised synthetic rope over a Grade-A teak frame that withstands the elements. The wide seat and sloped back support a relaxed lounging posture. Removable quick-dry cushions add softness and can be stored during monsoon season. The teak frame ages gracefully to a silver-grey patina if left untreated.",
    dimensions: "W 72 cm × D 82 cm × H 78 cm. Seat height: 36 cm.",
    materials: ["Grade-A plantation teak frame", "UV-stabilised polypropylene rope", "Quick-dry foam seat cushion", "Stainless steel hardware", "Hose down to clean", "Apply teak oil to maintain golden colour"],
  },
  "chair-10": {
    longDescription: "The Ergonomic Mesh Desk Chair is engineered for professionals who spend long hours at their desks. The breathable mesh back panel conforms to your spine while a height-adjustable lumbar support ensures proper posture. The seat features a waterfall edge that reduces pressure behind the knees. Fully adjustable armrests, seat depth, and tilt tension allow you to fine-tune the chair to your body. A polished aluminium base with smooth-rolling casters completes the package.",
    dimensions: "W 68 cm × D 66 cm × H 110–120 cm (adjustable). Seat height: 42–52 cm.",
    materials: ["Breathable mesh backrest", "High-density moulded foam seat", "Polished aluminium base", "Nylon smooth-rolling casters", "Adjustable lumbar support", "Wipe mesh with damp cloth"],
  },
  "chair-11": {
    longDescription: "The Tufted Velvet Accent Chair is a petite yet impactful piece that brightens bedrooms, dressing rooms, and compact living spaces. The curved barrel back is adorned with button tufting, while the removable seat cushion sits on a sinuous spring deck for resilient comfort. Slender gold-finished metal legs lift the chair visually, creating an airy profile that suits small footprints.",
    dimensions: "W 65 cm × D 62 cm × H 78 cm. Seat height: 44 cm.",
    materials: ["Polyester velvet upholstery", "Sinuous spring seat deck", "Gold-finished metal legs", "Removable seat cushion", "Spot-clean with mild detergent", "Brush velvet with a soft cloth"],
  },
  "chair-12": {
    longDescription: "The Cane Back Dining Chair blends colonial craftsmanship with contemporary minimalism. A natural cane panel is hand-woven into the curved backrest of a solid hardwood frame finished in matte black. The padded linen seat cushion is fixed for a clean silhouette but features a removable cover for easy washing. The result is a chair that adds warmth, texture, and a hint of nostalgia to modern dining rooms.",
    dimensions: "W 50 cm × D 54 cm × H 86 cm. Seat height: 46 cm.",
    materials: ["Solid birch frame in matte black", "Hand-woven natural cane back", "Removable linen seat cover", "High-density foam seat pad", "Machine-wash cover on gentle cycle", "Dust cane with a soft brush"],
  },
};
