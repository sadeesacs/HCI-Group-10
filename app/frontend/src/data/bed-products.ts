import oakPlatformBed1 from "@/assets/products/beds/oak-platform-bed-1.jpg";
import oakPlatformBed2 from "@/assets/products/beds/oak-platform-bed-2.jpg";
import oakPlatformBed3 from "@/assets/products/beds/oak-platform-bed-3.jpg";
import upholsteredPanelBed1 from "@/assets/products/beds/upholstered-panel-bed-1.jpg";
import upholsteredPanelBed2 from "@/assets/products/beds/upholstered-panel-bed-2.jpg";
import upholsteredPanelBed3 from "@/assets/products/beds/upholstered-panel-bed-3.jpg";
import walnutFourPoster1 from "@/assets/products/beds/walnut-four-poster-1.jpg";
import walnutFourPoster2 from "@/assets/products/beds/walnut-four-poster-2.jpg";
import walnutFourPoster3 from "@/assets/products/beds/walnut-four-poster-3.jpg";
import storageLiftBed1 from "@/assets/products/beds/storage-lift-bed-1.jpg";
import storageLiftBed2 from "@/assets/products/beds/storage-lift-bed-2.jpg";
import storageLiftBed3 from "@/assets/products/beds/storage-lift-bed-3.jpg";
import japaneseFloorBed1 from "@/assets/products/beds/japanese-floor-bed-1.jpg";
import japaneseFloorBed2 from "@/assets/products/beds/japanese-floor-bed-2.jpg";
import japaneseFloorBed3 from "@/assets/products/beds/japanese-floor-bed-3.jpg";
import velvetChannelBed1 from "@/assets/products/beds/velvet-channel-bed-1.jpg";
import velvetChannelBed2 from "@/assets/products/beds/velvet-channel-bed-2.jpg";
import velvetChannelBed3 from "@/assets/products/beds/velvet-channel-bed-3.jpg";
import reclaimedWoodBed1 from "@/assets/products/beds/reclaimed-wood-bed-1.jpg";
import reclaimedWoodBed2 from "@/assets/products/beds/reclaimed-wood-bed-2.jpg";
import reclaimedWoodBed3 from "@/assets/products/beds/reclaimed-wood-bed-3.jpg";
import metalCanopyBed1 from "@/assets/products/beds/metal-canopy-bed-1.jpg";
import metalCanopyBed2 from "@/assets/products/beds/metal-canopy-bed-2.jpg";
import metalCanopyBed3 from "@/assets/products/beds/metal-canopy-bed-3.jpg";
import scandiSpindleBed1 from "@/assets/products/beds/scandi-spindle-bed-1.jpg";
import scandiSpindleBed2 from "@/assets/products/beds/scandi-spindle-bed-2.jpg";
import scandiSpindleBed3 from "@/assets/products/beds/scandi-spindle-bed-3.jpg";
import floatingLedBed1 from "@/assets/products/beds/floating-led-bed-1.jpg";
import floatingLedBed2 from "@/assets/products/beds/floating-led-bed-2.jpg";
import floatingLedBed3 from "@/assets/products/beds/floating-led-bed-3.jpg";
import rattanCaneBed1 from "@/assets/products/beds/rattan-cane-bed-1.jpg";
import rattanCaneBed2 from "@/assets/products/beds/rattan-cane-bed-2.jpg";
import rattanCaneBed3 from "@/assets/products/beds/rattan-cane-bed-3.jpg";
import leatherStrapBed1 from "@/assets/products/beds/leather-strap-bed-1.jpg";
import leatherStrapBed2 from "@/assets/products/beds/leather-strap-bed-2.jpg";
import leatherStrapBed3 from "@/assets/products/beds/leather-strap-bed-3.jpg";

import type { Product } from "./mock";

export const bedProducts: Product[] = [
  {
    id: "b1",
    name: "Modern Oak Platform Bed",
    price: 145000,
    category: "Beds",
    tag: "Best Seller",
    description: "A clean-lined platform bed in solid European oak with a low-profile headboard. Minimalist elegance for modern bedrooms.",
    colors: ["Natural Oak", "Walnut", "White Oak"],
    images: [oakPlatformBed1, oakPlatformBed2, oakPlatformBed3],
    popularity: 94,
  },
  {
    id: "b2",
    name: "Upholstered Panel Bed",
    price: 185000,
    category: "Beds",
    description: "A tall wingback bed frame fully upholstered in charcoal grey linen. Plush padded headboard for reading in bed.",
    colors: ["Charcoal", "Oatmeal", "Navy"],
    images: [upholsteredPanelBed1, upholsteredPanelBed2, upholsteredPanelBed3],
    popularity: 90,
  },
  {
    id: "b3",
    name: "Walnut Four-Poster Bed",
    price: 295000,
    category: "Beds",
    tag: "New",
    description: "A contemporary four-poster in solid walnut with slim square posts. Architectural presence without visual heaviness.",
    colors: ["Walnut", "Dark Oak"],
    images: [walnutFourPoster1, walnutFourPoster2, walnutFourPoster3],
    isNew: true,
    popularity: 86,
  },
  {
    id: "b4",
    name: "Hydraulic Storage Bed",
    price: 215000,
    category: "Beds",
    tag: "Best Seller",
    description: "A light oak bed with gas-lift storage beneath the mattress platform. Hidden space for linens, luggage, and more.",
    colors: ["Light Oak", "Walnut", "White"],
    images: [storageLiftBed1, storageLiftBed2, storageLiftBed3],
    popularity: 92,
  },
  {
    id: "b5",
    name: "Japanese Low Floor Bed",
    price: 125000,
    category: "Beds",
    description: "A ground-hugging platform bed in dark stained wood with a slatted headboard. Zen-inspired simplicity.",
    colors: ["Dark Stain", "Natural", "Ebony"],
    images: [japaneseFloorBed1, japaneseFloorBed2, japaneseFloorBed3],
    popularity: 84,
  },
  {
    id: "b6",
    name: "Velvet Channel-Tufted Bed",
    price: 235000,
    category: "Beds",
    tag: "New",
    description: "A glamorous bed frame with vertical channel-tufted headboard in dusty blush velvet. Statement luxury for the bedroom.",
    colors: ["Blush", "Emerald", "Navy"],
    images: [velvetChannelBed1, velvetChannelBed2, velvetChannelBed3],
    isNew: true,
    popularity: 88,
  },
  {
    id: "b7",
    name: "Reclaimed Wood Bed Frame",
    price: 175000,
    category: "Beds",
    description: "A rustic bed crafted from reclaimed timber with natural weathered character. Each piece is uniquely marked by time.",
    colors: ["Natural Reclaimed", "Weathered Grey"],
    images: [reclaimedWoodBed1, reclaimedWoodBed2, reclaimedWoodBed3],
    popularity: 82,
  },
  {
    id: "b8",
    name: "Black Metal Canopy Bed",
    price: 165000,
    category: "Beds",
    description: "A sleek canopy bed in matte black powder-coated steel. Industrial geometry that frames your sleep space.",
    colors: ["Matte Black", "Brass", "White"],
    images: [metalCanopyBed1, metalCanopyBed2, metalCanopyBed3],
    popularity: 80,
  },
  {
    id: "b9",
    name: "Scandinavian Spindle Bed",
    price: 135000,
    category: "Beds",
    description: "A Nordic-inspired birch bed with a graceful arched spindle headboard and rounded edges. Light, warm, and timeless.",
    colors: ["Natural Birch", "White", "Light Oak"],
    images: [scandiSpindleBed1, scandiSpindleBed2, scandiSpindleBed3],
    popularity: 87,
  },
  {
    id: "b10",
    name: "Floating LED Bed Frame",
    price: 285000,
    category: "Beds",
    tag: "New",
    description: "A dark walnut floating bed with integrated warm LED ambient lighting beneath. Modern luxury that glows.",
    colors: ["Dark Walnut", "Black Oak"],
    images: [floatingLedBed1, floatingLedBed2, floatingLedBed3],
    isNew: true,
    popularity: 91,
  },
  {
    id: "b11",
    name: "Rattan Cane Headboard Bed",
    price: 155000,
    category: "Beds",
    description: "A bohemian-inspired bed with an arched rattan cane headboard in natural honey. Warm, textured, and inviting.",
    colors: ["Natural Honey", "White Wash"],
    images: [rattanCaneBed1, rattanCaneBed2, rattanCaneBed3],
    popularity: 85,
  },
  {
    id: "b12",
    name: "Woven Leather Headboard Bed",
    price: 245000,
    category: "Beds",
    description: "A solid teak frame with hand-woven tan leather headboard straps. Artisan craft meets contemporary design.",
    colors: ["Tan Leather / Teak", "Black Leather / Walnut"],
    images: [leatherStrapBed1, leatherStrapBed2, leatherStrapBed3],
    popularity: 89,
  },
];

export const bedProductExtras: Record<string, { longDescription: string; dimensions: string; materials: string[] }> = {
  b1: {
    longDescription: "The Modern Oak Platform Bed strips the bed frame down to its essential elements — a solid slab of European oak, a clean rectangular headboard, and precision-cut slat supports. The result is a bed that feels both substantial and light, grounding the room with warm wood tones while maintaining an open, airy feel. The platform sits at a comfortable height and includes a full-span slat base that eliminates the need for a box spring. Every joint is reinforced with steel brackets for a creak-free sleep.",
    dimensions: "Queen: W 165 cm × L 210 cm × H 85 cm (headboard). King: W 185 cm × L 215 cm. Platform height: 30 cm.",
    materials: ["Solid European oak frame", "Steel-reinforced corner brackets", "Birch plywood slat base (no box spring needed)", "Natural oil finish", "Dust with a soft cloth", "Re-oil annually for best results"],
  },
  b2: {
    longDescription: "The Upholstered Panel Bed wraps you in comfort from the moment you sit up to read. The tall wingback headboard is densely padded with high-resilience foam and upholstered in a durable charcoal grey linen blend. The fully wrapped side rails and footboard create a seamless, cohesive look. Solid wooden legs are recessed for a floating appearance. This bed works equally well in contemporary and transitional bedrooms.",
    dimensions: "Queen: W 168 cm × L 218 cm × H 135 cm (headboard). King: W 198 cm × L 218 cm. Platform height: 35 cm.",
    materials: ["Kiln-dried hardwood frame", "High-resilience foam padding", "Linen-blend upholstery", "Recessed solid wood legs", "Spot clean with mild detergent", "Vacuum headboard monthly"],
  },
  b3: {
    longDescription: "The Walnut Four-Poster Bed reimagines a classic form with modern restraint. Slim square posts rise cleanly from each corner, connected by simple horizontal rails at the top. The effect is architectural — the bed defines a room within a room, creating an intimate canopy zone without fabric or fuss. The rich walnut grain is finished with a hand-rubbed natural oil that deepens over time.",
    dimensions: "Queen: W 170 cm × L 215 cm × H 210 cm (posts). King: W 200 cm × L 220 cm. Platform height: 32 cm.",
    materials: ["Solid American walnut", "Hand-rubbed natural oil finish", "Mortise-and-tenon joinery", "Birch slat base included", "Wipe with a damp cloth", "Apply furniture oil every 6 months"],
  },
  b4: {
    longDescription: "The Hydraulic Storage Bed solves the eternal bedroom storage problem. A gas-assisted lift mechanism raises the entire mattress platform with minimal effort, revealing a vast under-bed storage compartment. The light oak exterior keeps things looking clean and Scandinavian, while the interior is lined with a smooth fabric to protect stored items. The integrated headboard features a slim shelf for a phone or reading glasses.",
    dimensions: "Queen: W 165 cm × L 212 cm × H 95 cm. Storage depth: 25 cm. King available. Platform height: 38 cm.",
    materials: ["Engineered oak veneer on MDF core", "Gas-assisted hydraulic lift pistons", "Fabric-lined storage interior", "Birch slat mattress platform", "Wipe exterior with a damp cloth", "Lubricate hinges annually"],
  },
  b5: {
    longDescription: "The Japanese Low Floor Bed brings the serenity of tatami-room living to any home. The wide platform base extends beyond the mattress on three sides, creating natural shelf space for a cup of tea or a stack of books. The slatted headboard in dark stained wood provides gentle back support while maintaining visual transparency. The low profile encourages a calm, grounded atmosphere.",
    dimensions: "Queen: W 200 cm × L 220 cm × H 55 cm (headboard). King: W 220 cm. Platform extends 20 cm. Mattress sits 15 cm from floor.",
    materials: ["Solid rubberwood platform", "Dark walnut stain finish", "Slatted headboard", "Built-in slat support", "Wipe with a soft damp cloth", "Keep base dry to prevent warping"],
  },
  b6: {
    longDescription: "The Velvet Channel-Tufted Bed is pure bedroom drama. The tall headboard features deep vertical channels stitched into sumptuous velvet, creating a play of light and shadow that changes throughout the day. Wingback panels on either side enclose the sleeping space for a cocoon-like effect. The fully upholstered base sits on discreet wooden legs. This bed demands to be the centrepiece of the room — and delivers.",
    dimensions: "Queen: W 172 cm × L 215 cm × H 140 cm (headboard). King: W 202 cm. Platform height: 35 cm.",
    materials: ["Engineered hardwood frame", "High-density foam padding", "Premium velvet upholstery (100% polyester)", "Solid wood legs in walnut finish", "Brush velvet with a soft bristle brush", "Spot clean only — avoid water"],
  },
  b7: {
    longDescription: "The Reclaimed Wood Bed Frame celebrates the beauty of imperfection. Each plank of the thick headboard carries unique marks — knot holes, saw marks, and natural colour variation — that tell the story of the wood's previous life. The chunky proportions give the bed a reassuring solidity, while the natural wax finish lets the wood breathe and age gracefully. No two beds are exactly alike.",
    dimensions: "Queen: W 168 cm × L 215 cm × H 110 cm (headboard). King: W 198 cm. Platform height: 32 cm.",
    materials: ["Reclaimed solid timber (mixed species)", "Natural beeswax finish", "Steel reinforcement plates", "Solid wood slat base", "Wipe with a dry cloth only", "Apply beeswax every 12 months"],
  },
  b8: {
    longDescription: "The Black Metal Canopy Bed brings architectural structure to the bedroom with its clean geometric lines. The square steel tube frame creates an open canopy overhead, inviting you to drape fabric, string lights, or leave it bare for a modern industrial look. Powder-coated in matte black for a durable, scratch-resistant finish. The open design keeps the room feeling spacious even with the canopy overhead.",
    dimensions: "Queen: W 165 cm × L 212 cm × H 200 cm (canopy). King: W 195 cm. Platform height: 30 cm.",
    materials: ["Heavy-gauge square steel tubing", "Matte black powder-coat finish", "Metal slat base (no box spring needed)", "Adjustable levelling feet", "Wipe with a damp cloth", "Touch up scratches with matte black paint"],
  },
  b9: {
    longDescription: "The Scandinavian Spindle Bed channels the gentle warmth of Nordic craft traditions. The arched headboard features evenly spaced turned spindles that create a delicate, rhythmic pattern. Solid birch construction keeps the frame lightweight yet sturdy, and the rounded edges eliminate sharp corners — a thoughtful detail for families with children. The natural wood finish brightens any room.",
    dimensions: "Queen: W 162 cm × L 210 cm × H 115 cm (headboard). King: W 192 cm. Platform height: 28 cm.",
    materials: ["Solid birch wood frame", "Turned birch spindles", "Natural lacquer finish", "Pine slat base included", "Dust regularly with a dry cloth", "Tighten bolts every 6 months"],
  },
  b10: {
    longDescription: "The Floating LED Bed Frame creates a dramatic illusion — the entire bed appears to hover above the floor, with a warm amber LED strip glowing softly beneath. The recessed legs are invisible from most angles, amplifying the floating effect. The dark walnut veneer adds richness and depth, while the integrated headboard keeps the design seamless. A bedside USB port is built into the headboard for convenient charging.",
    dimensions: "Queen: W 175 cm × L 215 cm × H 90 cm (headboard). King: W 205 cm. Visual clearance: 10 cm. LED strip: warm white 3000K.",
    materials: ["Dark walnut veneer on engineered wood", "Integrated LED strip (warm white, dimmable)", "Recessed steel legs", "Built-in USB-A charging port", "Birch slat base", "Wipe with a soft cloth", "LED rated 50,000+ hours"],
  },
  b11: {
    longDescription: "The Rattan Cane Headboard Bed brings tropical warmth and bohemian character to any bedroom. The arched headboard features hand-woven natural rattan cane set within a solid wood frame, creating a beautiful interplay of transparency and texture. The honey-toned cane catches light beautifully, casting gentle shadow patterns. Paired with linen bedding and indoor plants, this bed transforms a room into a relaxed retreat.",
    dimensions: "Queen: W 165 cm × L 210 cm × H 130 cm (headboard arch). King: W 195 cm. Platform height: 30 cm.",
    materials: ["Solid mango wood frame", "Hand-woven natural rattan cane panel", "Clear lacquer finish", "Pine slat base", "Dust rattan with a soft brush", "Keep away from excessive moisture"],
  },
  b12: {
    longDescription: "The Woven Leather Headboard Bed is a masterclass in material pairing. Wide strips of vegetable-tanned leather are hand-woven through a solid teak frame, creating a headboard with rich texture and warmth. The leather will develop a beautiful patina over time, darkening and softening with use. The teak frame is finished with a natural oil that enhances the grain and provides moisture protection. This is furniture that improves with age.",
    dimensions: "Queen: W 170 cm × L 215 cm × H 120 cm (headboard). King: W 200 cm. Platform height: 32 cm.",
    materials: ["Solid teak frame", "Vegetable-tanned leather straps", "Natural teak oil finish", "Birch slat base", "Condition leather with leather balm every 6 months", "Re-oil teak frame annually"],
  },
};
