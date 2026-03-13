import modernLinenSofa1 from "@/assets/products/sofas/modern-linen-sofa-1.jpg";
import modernLinenSofa2 from "@/assets/products/sofas/modern-linen-sofa-2.jpg";
import modernLinenSofa3 from "@/assets/products/sofas/modern-linen-sofa-3.jpg";
import curvedVelvetSofa1 from "@/assets/products/sofas/curved-velvet-sofa-1.jpg";
import curvedVelvetSofa2 from "@/assets/products/sofas/curved-velvet-sofa-2.jpg";
import curvedVelvetSofa3 from "@/assets/products/sofas/curved-velvet-sofa-3.jpg";
import chesterfieldSofa1 from "@/assets/products/sofas/chesterfield-sofa-1.jpg";
import chesterfieldSofa2 from "@/assets/products/sofas/chesterfield-sofa-2.jpg";
import chesterfieldSofa3 from "@/assets/products/sofas/chesterfield-sofa-3.jpg";
import modularSectional1 from "@/assets/products/sofas/modular-sectional-1.jpg";
import modularSectional2 from "@/assets/products/sofas/modular-sectional-2.jpg";
import modularSectional3 from "@/assets/products/sofas/modular-sectional-3.jpg";
import midCenturyTeakSofa1 from "@/assets/products/sofas/mid-century-teak-sofa-1.jpg";
import midCenturyTeakSofa2 from "@/assets/products/sofas/mid-century-teak-sofa-2.jpg";
import midCenturyTeakSofa3 from "@/assets/products/sofas/mid-century-teak-sofa-3.jpg";
import boucleCloudSofa1 from "@/assets/products/sofas/boucle-cloud-sofa-1.jpg";
import boucleCloudSofa2 from "@/assets/products/sofas/boucle-cloud-sofa-2.jpg";
import boucleCloudSofa3 from "@/assets/products/sofas/boucle-cloud-sofa-3.jpg";
import minimalistDaybed1 from "@/assets/products/sofas/minimalist-daybed-1.jpg";
import minimalistDaybed2 from "@/assets/products/sofas/minimalist-daybed-2.jpg";
import minimalistDaybed3 from "@/assets/products/sofas/minimalist-daybed-3.jpg";
import compactLoveseat1 from "@/assets/products/sofas/compact-loveseat-1.jpg";
import compactLoveseat2 from "@/assets/products/sofas/compact-loveseat-2.jpg";
import compactLoveseat3 from "@/assets/products/sofas/compact-loveseat-3.jpg";
import tuftedRollArm1 from "@/assets/products/sofas/tufted-roll-arm-1.jpg";
import tuftedRollArm2 from "@/assets/products/sofas/tufted-roll-arm-2.jpg";
import tuftedRollArm3 from "@/assets/products/sofas/tufted-roll-arm-3.jpg";
import lowProfilePlatform1 from "@/assets/products/sofas/low-profile-platform-1.jpg";
import lowProfilePlatform2 from "@/assets/products/sofas/low-profile-platform-2.jpg";
import lowProfilePlatform3 from "@/assets/products/sofas/low-profile-platform-3.jpg";
import scandinavian2Seater1 from "@/assets/products/sofas/scandinavian-2-seater-1.jpg";
import scandinavian2Seater2 from "@/assets/products/sofas/scandinavian-2-seater-2.jpg";
import scandinavian2Seater3 from "@/assets/products/sofas/scandinavian-2-seater-3.jpg";
import deepSeatComfort1 from "@/assets/products/sofas/deep-seat-comfort-1.jpg";
import deepSeatComfort2 from "@/assets/products/sofas/deep-seat-comfort-2.jpg";
import deepSeatComfort3 from "@/assets/products/sofas/deep-seat-comfort-3.jpg";

import type { Product } from "./mock";

export const sofaProducts: Product[] = [
  {
    id: "s1",
    name: "Modern Linen 3-Seater Sofa",
    price: 145000,
    category: "Sofas",
    tag: "Best Seller",
    description: "A clean-lined 3-seater in light grey linen with tapered wooden legs. Effortlessly modern and endlessly comfortable.",
    colors: ["Light Grey", "Charcoal", "Oatmeal"],
    images: [modernLinenSofa1, modernLinenSofa2, modernLinenSofa3],
    popularity: 94,
  },
  {
    id: "s2",
    name: "Curved Velvet Sofa",
    price: 265000,
    category: "Sofas",
    tag: "New",
    description: "A show-stopping curved sofa in deep emerald velvet. Channel-tufted back with brass legs for a luxurious statement.",
    colors: ["Emerald", "Midnight Blue", "Blush"],
    images: [curvedVelvetSofa1, curvedVelvetSofa2, curvedVelvetSofa3],
    isNew: true,
    popularity: 88,
  },
  {
    id: "s3",
    name: "Leather Chesterfield Sofa",
    price: 295000,
    category: "Sofas",
    description: "A timeless Chesterfield in rich cognac leather with deep button-tufting, rolled arms, and turned wooden feet.",
    colors: ["Cognac", "Dark Brown", "Black"],
    images: [chesterfieldSofa1, chesterfieldSofa2, chesterfieldSofa3],
    popularity: 91,
  },
  {
    id: "s4",
    name: "Modular Sectional Sofa",
    price: 345000,
    category: "Sofas",
    tag: "Best Seller",
    description: "A versatile L-shaped sectional in warm taupe. Rearrange the modules to fit any living room layout.",
    colors: ["Taupe", "Charcoal", "Cream"],
    images: [modularSectional1, modularSectional2, modularSectional3],
    popularity: 96,
  },
  {
    id: "s5",
    name: "Mid-Century Teak Frame Sofa",
    price: 185000,
    category: "Sofas",
    description: "Exposed solid teak frame with cream linen cushions. A retro-inspired design with timeless appeal.",
    colors: ["Cream", "Olive", "Charcoal"],
    images: [midCenturyTeakSofa1, midCenturyTeakSofa2, midCenturyTeakSofa3],
    popularity: 87,
  },
  {
    id: "s6",
    name: "Bouclé Cloud Sofa",
    price: 275000,
    category: "Sofas",
    tag: "New",
    description: "An oversized cloud-like sofa in ivory bouclé fabric. Impossibly plush with a rounded, organic silhouette.",
    colors: ["Ivory", "Sand", "Light Grey"],
    images: [boucleCloudSofa1, boucleCloudSofa2, boucleCloudSofa3],
    isNew: true,
    popularity: 93,
  },
  {
    id: "s7",
    name: "Minimalist Daybed",
    price: 98000,
    category: "Sofas",
    description: "A sleek daybed with oatmeal linen upholstery on a slim black metal frame. Perfect for reading nooks.",
    colors: ["Oatmeal", "Charcoal", "White"],
    images: [minimalistDaybed1, minimalistDaybed2, minimalistDaybed3],
    popularity: 76,
  },
  {
    id: "s8",
    name: "Compact Velvet Loveseat",
    price: 115000,
    category: "Sofas",
    description: "A petite 2-seater in dusty rose velvet with gold-tipped legs. Ideal for small living rooms and apartments.",
    colors: ["Dusty Rose", "Sage", "Navy"],
    images: [compactLoveseat1, compactLoveseat2, compactLoveseat3],
    popularity: 82,
  },
  {
    id: "s9",
    name: "Tufted Roll-Arm Sofa",
    price: 195000,
    category: "Sofas",
    description: "A classic tufted sofa in navy blue with rolled arms, nailhead trim, and turned wooden bun feet.",
    colors: ["Navy", "Forest Green", "Burgundy"],
    images: [tuftedRollArm1, tuftedRollArm2, tuftedRollArm3],
    popularity: 85,
  },
  {
    id: "s10",
    name: "Low-Profile Platform Sofa",
    price: 165000,
    category: "Sofas",
    description: "A Japanese-inspired low sofa with charcoal cushions on a wide oak platform base. Zen minimalism for modern living.",
    colors: ["Charcoal", "Sand", "Slate"],
    images: [lowProfilePlatform1, lowProfilePlatform2, lowProfilePlatform3],
    popularity: 80,
  },
  {
    id: "s11",
    name: "Scandinavian 2-Seater Sofa",
    price: 105000,
    category: "Sofas",
    description: "A Nordic-style compact sofa in sage green with slim oak legs. Light, airy, and apartment-friendly.",
    colors: ["Sage", "Light Grey", "Mustard"],
    images: [scandinavian2Seater1, scandinavian2Seater2, scandinavian2Seater3],
    popularity: 83,
  },
  {
    id: "s12",
    name: "Deep-Seat Comfort Sofa",
    price: 175000,
    category: "Sofas",
    description: "An extra-deep 3-seater in warm sand beige with oversized back cushions. Built for lounging all day long.",
    colors: ["Sand", "Cream", "Charcoal"],
    images: [deepSeatComfort1, deepSeatComfort2, deepSeatComfort3],
    popularity: 89,
  },
];

export const sofaProductExtras: Record<string, { longDescription: string; dimensions: string; materials: string[] }> = {
  s1: {
    longDescription: "The Modern Linen 3-Seater Sofa is built for everyday living without sacrificing style. Its clean, squared-off silhouette feels contemporary yet approachable, while the tapered solid wood legs add a touch of warmth. The seat cushions are filled with high-resilience foam wrapped in a feather-down top layer, creating a supportive yet sink-in feel. The removable slipcovers make maintenance effortless — simply unzip and machine wash. Whether anchoring a living room or filling a family den, this sofa delivers comfort that lasts.",
    dimensions: "W 220 cm × D 92 cm × H 84 cm. Seat height: 44 cm. Seat depth: 56 cm.",
    materials: ["Kiln-dried hardwood frame", "High-resilience foam + feather-down wrap cushions", "Removable linen-blend slipcovers", "Solid oak tapered legs", "Machine-wash covers on gentle cycle", "Rotate cushions monthly for even wear"],
  },
  s2: {
    longDescription: "The Curved Velvet Sofa is a sculptural statement piece that transforms any room into a salon-worthy space. The sweeping, crescent-shaped silhouette is upholstered in plush velvet with elegant channel tufting along the backrest. Brushed brass legs provide a refined contrast against the deep emerald fabric. The generous seat depth invites hours of lounging, while the curved form naturally encourages conversation. This is furniture as art — designed to be admired as much as it is enjoyed.",
    dimensions: "W 260 cm × D 100 cm × H 78 cm. Seat height: 42 cm. Curved depth varies.",
    materials: ["Engineered hardwood frame with steel reinforcement", "High-density foam cushioning", "Premium velvet upholstery (100% polyester)", "Brushed brass legs", "Spot clean with velvet-safe cleaner", "Avoid direct sunlight to prevent colour fading"],
  },
  s3: {
    longDescription: "The Leather Chesterfield Sofa is a heritage piece reimagined for modern homes. Hand-tufted in rich full-grain leather, every diamond-pattern button is individually placed by skilled craftsmen. The deep, rolled arms and generous seat cushions create a sofa that feels as luxurious as it looks. The leather will develop a beautiful patina over time, growing more characterful with each passing year. Paired with turned walnut feet and antique brass nail heads, this is investment furniture built to become a family heirloom.",
    dimensions: "W 210 cm × D 95 cm × H 80 cm. Seat height: 46 cm. Seat depth: 54 cm.",
    materials: ["Full-grain aniline leather", "Hand-tufted button detailing", "Kiln-dried beech frame", "Turned walnut feet", "Antique brass nailhead trim", "Condition leather every 6 months", "Blot spills immediately with a dry cloth"],
  },
  s4: {
    longDescription: "The Modular Sectional Sofa is designed for flexibility. Its five individual modules can be configured as an L-shape, U-shape, or even separated into individual seats. Heavy-duty interlocking brackets keep the pieces firmly connected while allowing easy rearrangement. The deep, pillow-back cushions are filled with a foam-and-fibre blend that holds its shape through years of family life. Available in a versatile warm taupe that pairs with virtually any interior palette.",
    dimensions: "L-shape: W 320 cm × D 230 cm × H 82 cm. Individual module: W 90 cm. Seat height: 43 cm.",
    materials: ["Engineered hardwood frame", "Steel interlocking module brackets", "Foam-and-fibre blend cushions", "Durable woven polyester upholstery", "Removable back cushion covers", "Vacuum upholstery weekly", "Professional deep-clean annually"],
  },
  s5: {
    longDescription: "The Mid-Century Teak Frame Sofa pays homage to 1960s Scandinavian design with its beautifully exposed solid teak frame. The sculpted armrests and splayed legs showcase the natural grain of the wood, while the loose cream linen cushions provide a relaxed, inviting seat. The frame is joined using traditional mortise-and-tenon joinery for structural integrity that will outlast trends. This sofa is as much a showcase of woodworking craft as it is a comfortable place to sit.",
    dimensions: "W 195 cm × D 82 cm × H 78 cm. Seat height: 40 cm. Seat depth: 52 cm.",
    materials: ["Solid teak frame with natural oil finish", "Mortise-and-tenon joinery", "High-resilience foam seat cushions", "Removable linen cushion covers", "Re-oil teak frame annually", "Machine-wash covers on delicate cycle"],
  },
  s6: {
    longDescription: "The Bouclé Cloud Sofa lives up to its name — sinking into it feels like being cradled by a cloud. The oversized, organic silhouette features rounded edges and voluminous cushions upholstered in a textured ivory bouclé fabric. There are no hard edges or sharp lines; everything is soft, rounded, and inviting. The low profile keeps the visual weight grounded while the generous proportions make it a true gathering spot. This is the sofa you'll fight over for movie night.",
    dimensions: "W 250 cm × D 110 cm × H 72 cm. Seat height: 38 cm. Seat depth: 65 cm.",
    materials: ["Steel-reinforced hardwood frame", "Multi-layer foam and down-alternative fill", "Bouclé fabric (cotton-poly blend)", "Hidden plastic feet", "Vacuum bouclé gently with upholstery attachment", "Professional cleaning recommended"],
  },
  s7: {
    longDescription: "The Minimalist Daybed strips away everything unnecessary, leaving a pure, functional form. The slim matte black steel frame supports a thick, single-piece cushion in oatmeal linen, creating a versatile piece that works as a sofa by day and an extra sleeping surface when needed. A bolster pillow provides back support when seated. Tuck it into a bay window, a studio corner, or a guest room for a piece that adapts to your life.",
    dimensions: "W 190 cm × D 80 cm × H 60 cm. Seat height: 38 cm. Mattress thickness: 15 cm.",
    materials: ["Powder-coated steel frame in matte black", "High-density foam mattress cushion", "Removable linen cover with hidden zip", "Includes bolster pillow", "Machine-wash cover", "Wipe frame with a damp cloth"],
  },
  s8: {
    longDescription: "The Compact Velvet Loveseat is proof that small spaces deserve beautiful furniture. This petite 2-seater features a gently curved back and slim profile that fits through narrow doorways and into tight living rooms. The dusty rose velvet upholstery adds warmth and personality, while the gold-tipped tapered legs bring a touch of mid-century glamour. The seat cushion is a single bench style for a cleaner look, filled with firm foam for supportive comfort.",
    dimensions: "W 140 cm × D 78 cm × H 80 cm. Seat height: 44 cm. Seat depth: 50 cm.",
    materials: ["Solid wood frame", "High-density foam bench cushion", "Velvet upholstery (100% polyester)", "Gold-tipped tapered metal legs", "Spot clean with mild detergent", "Brush velvet with a soft bristle brush to maintain nap"],
  },
  s9: {
    longDescription: "The Tufted Roll-Arm Sofa brings classic English elegance to contemporary homes. The deep diamond-tufted back creates a rich textural pattern, while the generously padded rolled arms invite you to lean in and get comfortable. Individual brass nailheads are hand-placed along the arms and base, catching light and adding refined detail. The turned wooden bun feet ground the piece with traditional charm. Available in rich, saturated colours that command attention.",
    dimensions: "W 215 cm × D 90 cm × H 86 cm. Seat height: 45 cm. Seat depth: 55 cm.",
    materials: ["Kiln-dried hardwood frame", "Hand-tufted diamond-pattern back", "Individual brass nailhead trim", "Turned wooden bun feet in walnut finish", "Pocket-sprung seat cushions", "Vacuum regularly", "Professional upholstery cleaning as needed"],
  },
  s10: {
    longDescription: "The Low-Profile Platform Sofa draws inspiration from Japanese floor-level living. A wide solid oak platform base extends beyond the cushions on all sides, creating a shelf-like ledge perfect for setting down a cup of tea or a book. The charcoal grey cushions sit directly on the platform, keeping the overall height low and the visual profile calm. This is a sofa for those who appreciate architectural furniture — where form and function merge into something quietly striking.",
    dimensions: "W 230 cm × D 100 cm × H 62 cm. Platform extends 15 cm beyond cushions. Seat height: 35 cm.",
    materials: ["Solid European oak platform base", "High-density foam seat and back cushions", "Woven linen-cotton blend upholstery", "Natural oil finish on oak", "Wipe platform with a soft damp cloth", "Rotate cushions regularly"],
  },
  s11: {
    longDescription: "The Scandinavian 2-Seater Sofa embodies Nordic design principles: simplicity, functionality, and warmth. The compact frame features slim, tapered oak legs and a gently angled backrest for ergonomic comfort. Upholstered in a calming sage green, it brings a fresh, natural feel to any room. The two-cushion seat design offers defined seating zones while keeping the overall footprint apartment-friendly. Perfect for small living rooms, reading corners, or as an accent sofa in larger spaces.",
    dimensions: "W 155 cm × D 80 cm × H 82 cm. Seat height: 43 cm. Seat depth: 50 cm.",
    materials: ["Solid birch frame", "Tapered solid oak legs", "Medium-firm foam cushions", "Woven cotton-polyester blend upholstery", "Removable cushion covers", "Machine-wash covers on gentle cycle", "Tighten legs periodically"],
  },
  s12: {
    longDescription: "The Deep-Seat Comfort Sofa is designed for people who treat their sofa as a lifestyle. With an extra-deep seat of 65 cm, you can sit cross-legged, curl up with a blanket, or stretch out for a nap. The oversized back cushions are filled with a luxurious down-alternative fibre that moulds to your body. The warm sand beige fabric is treated with a stain-resistant finish, making it family- and pet-friendly. Wide track arms provide additional surface area for resting a plate or a remote.",
    dimensions: "W 240 cm × D 105 cm × H 85 cm. Seat height: 42 cm. Seat depth: 65 cm.",
    materials: ["Kiln-dried hardwood frame", "Down-alternative fibre back cushions", "High-resilience foam seat cushions", "Stain-resistant woven fabric", "Solid wood block feet", "Fluff back cushions daily", "Spot clean with mild soap and water"],
  },
};
