import modernOakTable1 from "@/assets/products/dining/modern-oak-table-1.jpg";
import modernOakTable2 from "@/assets/products/dining/modern-oak-table-2.jpg";
import modernOakTable3 from "@/assets/products/dining/modern-oak-table-3.jpg";
import farmhouseTable1 from "@/assets/products/dining/farmhouse-table-1.jpg";
import farmhouseTable2 from "@/assets/products/dining/farmhouse-table-2.jpg";
import farmhouseTable3 from "@/assets/products/dining/farmhouse-table-3.jpg";
import roundWalnutTable1 from "@/assets/products/dining/round-walnut-table-1.jpg";
import roundWalnutTable2 from "@/assets/products/dining/round-walnut-table-2.jpg";
import roundWalnutTable3 from "@/assets/products/dining/round-walnut-table-3.jpg";
import extendableTeakTable1 from "@/assets/products/dining/extendable-teak-table-1.jpg";
import extendableTeakTable2 from "@/assets/products/dining/extendable-teak-table-2.jpg";
import extendableTeakTable3 from "@/assets/products/dining/extendable-teak-table-3.jpg";
import marbleTable1 from "@/assets/products/dining/marble-table-1.jpg";
import marbleTable2 from "@/assets/products/dining/marble-table-2.jpg";
import marbleTable3 from "@/assets/products/dining/marble-table-3.jpg";
import liveEdgeTable1 from "@/assets/products/dining/live-edge-table-1.jpg";
import liveEdgeTable2 from "@/assets/products/dining/live-edge-table-2.jpg";
import liveEdgeTable3 from "@/assets/products/dining/live-edge-table-3.jpg";
import upholsteredChair1 from "@/assets/products/dining/upholstered-chair-1.jpg";
import upholsteredChair2 from "@/assets/products/dining/upholstered-chair-2.jpg";
import upholsteredChair3 from "@/assets/products/dining/upholstered-chair-3.jpg";
import spindleChair1 from "@/assets/products/dining/spindle-chair-1.jpg";
import spindleChair2 from "@/assets/products/dining/spindle-chair-2.jpg";
import spindleChair3 from "@/assets/products/dining/spindle-chair-3.jpg";
import leatherChair1 from "@/assets/products/dining/leather-chair-1.jpg";
import leatherChair2 from "@/assets/products/dining/leather-chair-2.jpg";
import leatherChair3 from "@/assets/products/dining/leather-chair-3.jpg";
import rattanChair1 from "@/assets/products/dining/rattan-chair-1.jpg";
import rattanChair2 from "@/assets/products/dining/rattan-chair-2.jpg";
import rattanChair3 from "@/assets/products/dining/rattan-chair-3.jpg";
import bench1 from "@/assets/products/dining/bench-1.jpg";
import bench2 from "@/assets/products/dining/bench-2.jpg";
import bench3 from "@/assets/products/dining/bench-3.jpg";
import velvetArmchair1 from "@/assets/products/dining/velvet-armchair-1.jpg";
import velvetArmchair2 from "@/assets/products/dining/velvet-armchair-2.jpg";
import velvetArmchair3 from "@/assets/products/dining/velvet-armchair-3.jpg";
import modernChair1 from "@/assets/products/dining/modern-chair-1.jpg";
import modernChair2 from "@/assets/products/dining/modern-chair-2.jpg";
import modernChair3 from "@/assets/products/dining/modern-chair-3.jpg";

import type { Product } from "./mock";

export const diningProducts: Product[] = [
  {
    id: "d1",
    name: "Modern Oak Dining Table",
    price: 145000,
    category: "Dining",
    tag: "Best Seller",
    description: "A clean-lined rectangular oak dining table with tapered legs. Seats six comfortably with a warm, natural finish that deepens over time.",
    longDescription: "The Modern Oak Dining Table is the centrepiece your dining room has been waiting for. Crafted from solid European oak, its gentle grain tells a story of quality and restraint. The tapered legs give the piece a lightness that belies its generous proportions, while the matte lacquer seal protects against daily wear without hiding the wood's character. Six adults sit comfortably, and the simple silhouette pairs effortlessly with both modern and traditional interiors.",
    dimensions: "L 180 cm × W 90 cm × H 75 cm. Seats 6.",
    materials: ["Solid European oak", "Food-safe matte lacquer", "Tapered solid wood legs"],
    colors: ["Natural Oak", "Light Ash"],
    images: [modernOakTable1, modernOakTable2, modernOakTable3],
    popularity: 96,
  },
  {
    id: "d2",
    name: "Rustic Farmhouse Table",
    price: 198000,
    category: "Dining",
    description: "A large reclaimed wood farmhouse table with a thick trestle base. Built for family gatherings with character in every knot and grain.",
    longDescription: "The Rustic Farmhouse Table is built from reclaimed hardwood, each plank carrying its own history of knots, grain variations and natural patina. The sturdy trestle base anchors the piece with visual weight and structural integrity, supporting even the most animated dinner parties. Sealed with a food-safe wax finish that preserves the wood's raw beauty while offering practical protection against spills.",
    dimensions: "L 220 cm × W 100 cm × H 76 cm. Seats 8.",
    materials: ["Reclaimed hardwood planks", "Cross-trestle base", "Food-safe wax finish"],
    colors: ["Weathered Natural", "Honey"],
    images: [farmhouseTable1, farmhouseTable2, farmhouseTable3],
    popularity: 88,
  },
  {
    id: "d3",
    name: "Round Walnut Dining Table",
    price: 165000,
    category: "Dining",
    tag: "New",
    description: "An intimate round dining table in rich dark walnut with a sculptural pedestal base. Perfect for four guests and cosy conversations.",
    longDescription: "The Round Walnut Dining Table brings warmth and intimacy to any dining space. The dark walnut finish showcases swirling grain patterns that catch the light beautifully, while the solid pedestal base eliminates corner legs for easy seating all around. At 120 cm in diameter, it comfortably seats four guests with room for a generous spread.",
    dimensions: "Ø 120 cm × H 75 cm. Seats 4.",
    materials: ["Solid walnut", "Turned pedestal base", "Satin lacquer finish"],
    colors: ["Dark Walnut", "Natural Walnut"],
    images: [roundWalnutTable1, roundWalnutTable2, roundWalnutTable3],
    isNew: true,
    popularity: 84,
  },
  {
    id: "d4",
    name: "Extendable Teak Dining Table",
    price: 215000,
    category: "Dining",
    tag: "Best Seller",
    description: "A versatile teak dining table with a built-in butterfly leaf extension. Seats six normally, eight when extended.",
    longDescription: "The Extendable Teak Dining Table adapts to your needs with a smooth butterfly leaf mechanism that extends the surface by 50 cm in seconds. Crafted from plantation-grown teak with a warm golden finish, the mid-century inspired splayed legs provide a timeless profile. Whether it's a weeknight dinner for four or a weekend feast for eight, this table handles both with grace.",
    dimensions: "L 160–210 cm × W 90 cm × H 75 cm. Seats 6–8.",
    materials: ["Plantation teak", "Butterfly leaf extension", "Steel slide mechanism", "Natural oil finish"],
    colors: ["Golden Teak", "Aged Teak"],
    images: [extendableTeakTable1, extendableTeakTable2, extendableTeakTable3],
    popularity: 92,
  },
  {
    id: "d5",
    name: "Marble Top Dining Table",
    price: 285000,
    category: "Dining",
    description: "A statement white marble top dining table with a sleek black metal base. Each slab features unique natural veining patterns.",
    longDescription: "The Marble Top Dining Table is where luxury meets modern restraint. Each Carrara-inspired marble slab is unique, with delicate grey veining that flows across the polished surface like a work of art. The powder-coated black metal base provides a striking contrast, keeping the overall look contemporary and grounded. Sealed for stain resistance, this table is as practical as it is beautiful.",
    dimensions: "L 200 cm × W 100 cm × H 75 cm. Seats 6–8.",
    materials: ["Natural marble slab top", "Powder-coated steel base", "Sealed marble surface", "Anti-scratch felt pads"],
    colors: ["White Carrara", "Grey Veined"],
    images: [marbleTable1, marbleTable2, marbleTable3],
    popularity: 86,
  },
  {
    id: "d6",
    name: "Live Edge Dining Table",
    price: 345000,
    category: "Dining",
    tag: "New",
    description: "A one-of-a-kind solid acacia wood slab table with natural live edges and industrial steel legs. No two pieces are alike.",
    longDescription: "The Live Edge Dining Table is nature's masterpiece brought indoors. Each solid acacia slab retains its natural bark edges, creating an organic silhouette that is entirely unique. The rich, multi-tonal grain ranges from honey to chocolate, sealed under a durable epoxy-resin coat. Heavy-gauge black steel legs in a clean U-frame profile provide industrial contrast, creating a piece that commands attention in any dining space.",
    dimensions: "L 200 cm × W 85–100 cm × H 76 cm. Seats 6–8.",
    materials: ["Solid acacia wood slab", "Natural live edge", "Epoxy-resin seal coat", "Heavy-gauge black steel legs"],
    colors: ["Natural Acacia", "Dark Stained"],
    images: [liveEdgeTable1, liveEdgeTable2, liveEdgeTable3],
    isNew: true,
    popularity: 80,
  },
  {
    id: "d7",
    name: "Bouclé Upholstered Dining Chair",
    price: 89000,
    category: "Dining",
    tag: "Best Seller",
    description: "A soft bouclé fabric dining chair with a curved backrest and solid oak legs. Comfort and elegance in equal measure.",
    longDescription: "The Bouclé Upholstered Dining Chair wraps you in textured comfort. The cream bouclé fabric has a soft, nubbly hand-feel that invites lingering at the table, while the curved backrest provides gentle lumbar support. Solid oak legs with a natural finish ground the piece with warmth. The generous seat depth and padded cushion make this chair as comfortable for a three-course dinner as it is for a morning coffee.",
    dimensions: "W 52 cm × D 56 cm × H 82 cm. Seat height: 46 cm.",
    materials: ["Bouclé fabric upholstery", "High-density foam padding", "Solid oak legs", "Non-slip floor protectors"],
    colors: ["Cream", "Sand", "Charcoal"],
    images: [upholsteredChair1, upholsteredChair2, upholsteredChair3],
    popularity: 94,
  },
  {
    id: "d8",
    name: "Windsor Spindle Chair",
    price: 82000,
    category: "Dining",
    description: "A handcrafted ash wood spindle-back chair with modern proportions. A timeless design updated for contemporary dining.",
    longDescription: "The Windsor Spindle Chair honours centuries of chairmaking tradition while bringing the proportions into the present. Each spindle is individually turned from solid ash, then fitted into a sculpted seat that follows the natural contours of the body. The curved bow back provides comfortable support without a cushion, and the splayed legs ensure rock-solid stability on any floor.",
    dimensions: "W 56 cm × D 52 cm × H 92 cm. Seat height: 45 cm.",
    materials: ["Solid ash wood", "Hand-turned spindles", "Sculpted saddle seat", "Clear lacquer finish"],
    colors: ["Natural Ash", "Black", "Walnut Stain"],
    images: [spindleChair1, spindleChair2, spindleChair3],
    popularity: 82,
  },
  {
    id: "d9",
    name: "Leather Dining Chair",
    price: 95000,
    category: "Dining",
    description: "A sleek minimalist dining chair with premium dark brown leather and slim black metal legs. Understated luxury for modern spaces.",
    longDescription: "The Leather Dining Chair strikes a balance between refined material and minimalist form. The full-grain leather seat and backrest develop a rich patina over time, growing more beautiful with use. The slim powder-coated steel frame keeps the visual weight low, making the chair work equally well in intimate breakfast nooks and formal dining rooms. Reinforced stitching ensures lasting durability.",
    dimensions: "W 46 cm × D 54 cm × H 84 cm. Seat height: 46 cm.",
    materials: ["Full-grain leather", "Powder-coated steel frame", "Reinforced saddle stitching", "Non-marking floor glides"],
    colors: ["Dark Brown", "Cognac", "Black"],
    images: [leatherChair1, leatherChair2, leatherChair3],
    popularity: 87,
  },
  {
    id: "d10",
    name: "Rattan Cane Dining Chair",
    price: 80000,
    category: "Dining",
    description: "A coastal-inspired dining chair with a hand-woven rattan cane back and seat on a solid wood frame. Light, airy, and full of texture.",
    longDescription: "The Rattan Cane Dining Chair brings natural, handcrafted warmth to your table. Each seat and backrest is hand-woven from natural rattan cane in a classic hexagonal pattern, creating a breathable and visually textured surface. The solid beechwood frame provides lasting structure, while the lightweight build makes it easy to move and rearrange. Ideal for coastal, bohemian, and Scandinavian interiors alike.",
    dimensions: "W 48 cm × D 52 cm × H 88 cm. Seat height: 45 cm.",
    materials: ["Natural rattan cane weave", "Solid beechwood frame", "Clear protective lacquer", "Rubber foot caps"],
    colors: ["Natural", "Honey Stain"],
    images: [rattanChair1, rattanChair2, rattanChair3],
    popularity: 83,
  },
  {
    id: "d11",
    name: "Solid Oak Dining Bench",
    price: 98000,
    category: "Dining",
    description: "A clean-lined solid oak dining bench that seats three. Pairs perfectly with any dining table for a relaxed, family-friendly setup.",
    longDescription: "The Solid Oak Dining Bench offers a relaxed, communal alternative to individual chairs. Cut from thick European oak planks, the bench features clean waterfall edges and sturdy slab legs that echo the simplicity of the best Scandinavian design. At 160 cm, it comfortably seats three adults and tucks neatly under a standard dining table when not in use. Add a couple of linen cushions for extra comfort.",
    dimensions: "L 160 cm × W 38 cm × H 45 cm. Seats 3.",
    materials: ["Solid European oak", "Slab-style legs", "Chamfered edges", "Matte lacquer finish"],
    colors: ["Natural Oak", "Smoked Oak"],
    images: [bench1, bench2, bench3],
    popularity: 79,
  },
  {
    id: "d12",
    name: "Velvet Dining Armchair",
    price: 115000,
    category: "Dining",
    tag: "New",
    description: "A luxurious channel-tufted velvet dining armchair with gold metal legs. A glamorous statement piece for elevated dining rooms.",
    longDescription: "The Velvet Dining Armchair brings opulent comfort to the dining table. Deep forest green velvet is channel-tufted across the curved shell back, creating a sculptural silhouette that catches light beautifully. The generous seat width and padded armrests encourage long, leisurely meals. Gold-finish metal legs add a final flourish of glamour. This chair transforms any dining room into a destination.",
    dimensions: "W 62 cm × D 58 cm × H 80 cm. Seat height: 47 cm.",
    materials: ["Premium velvet upholstery", "Channel-tufted shell back", "Gold-finish metal legs", "High-resilience foam fill"],
    colors: ["Forest Green", "Navy Blue", "Blush Pink"],
    images: [velvetArmchair1, velvetArmchair2, velvetArmchair3],
    isNew: true,
    popularity: 85,
  },
];

export const diningProductExtras: Record<string, { longDescription: string; dimensions: string; materials: string[] }> = {};
diningProducts.forEach((p) => {
  if (p.longDescription && p.dimensions && p.materials) {
    diningProductExtras[p.id] = {
      longDescription: p.longDescription,
      dimensions: p.dimensions,
      materials: p.materials,
    };
  }
});
