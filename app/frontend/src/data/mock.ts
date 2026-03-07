import chair1 from "@/assets/products/chair-1.jpg";
import table1 from "@/assets/products/table-1.jpg";
import bookshelf1 from "@/assets/products/bookshelf-1.jpg";
import lamp1 from "@/assets/products/lamp-1.jpg";
import bedside1 from "@/assets/products/bedside-1.jpg";
import armchair1 from "@/assets/products/armchair-1.jpg";
import console1 from "@/assets/products/console-1.jpg";
import pendant1 from "@/assets/products/pendant-1.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  tag?: string;
  description: string;
  longDescription?: string;
  dimensions?: string;
  materials?: string[];
  colors: string[];
  images: string[];
  isNew?: boolean;
  popularity: number;
}

export const productExtras: Record<string, { longDescription: string; dimensions: string; materials: string[] }> = {
  "1": {
    longDescription: "The Kandy Lounge Chair is a statement piece that marries mid-century form with Sri Lankan craftsmanship. Its gently curved backrest cradles your body, while the solid teak frame provides lasting structural integrity. The dense foam cushioning is wrapped in a durable yet soft woven fabric, available in several earth-toned finishes. Whether placed beside a reading lamp or anchoring a living room conversation area, this chair invites you to sit longer, read more, and savour quiet evenings at home.",
    dimensions: "W 72 cm × D 78 cm × H 85 cm. Seat height: 42 cm. Custom sizes available on request.",
    materials: ["Solid teak frame with natural oil finish", "High-density foam cushioning", "Woven cotton-linen blend upholstery", "Wipe clean with a damp cloth", "Avoid direct sunlight to prevent fabric fading", "Re-oil wooden legs once a year for best results"],
  },
  "2": {
    longDescription: "The Colombo Dining Table is built for gatherings. Its solid oak surface showcases a gentle grain that deepens with age, while the splayed legs give it a light, modern profile. Six adults sit comfortably with elbow room to spare. Designed for daily use, the tabletop is sealed with a food-safe matte lacquer that resists stains and heat marks without sacrificing the wood's natural warmth.",
    dimensions: "L 180 cm × W 90 cm × H 75 cm. Seats 6. Custom sizes available on request.",
    materials: ["Solid European oak", "Food-safe matte lacquer finish", "Wipe spills promptly with a soft cloth", "Use coasters for hot dishes", "Re-apply lacquer every 2 years for longevity"],
  },
  "3": {
    longDescription: "The Galle Bookshelf blends open and closed storage in a single refined silhouette. The warm cherry wood frame supports adjustable shelves, while the lower cabinets conceal everyday clutter. Built-in LED puck lights highlight your favourite objects. Use it in a study, living room, or hallway to bring both function and personality to any wall.",
    dimensions: "W 120 cm × D 35 cm × H 200 cm. Shelf depth: 30 cm. Custom sizes available on request.",
    materials: ["Solid cherry wood frame", "Veneered MDF shelves", "Brushed brass hardware", "Dust regularly with a microfibre cloth", "Avoid abrasive cleaners"],
  },
  "4": {
    longDescription: "The Sigiriya Floor Lamp casts a warm, diffused glow that transforms any corner into a reading nook. The brushed brass stem pairs with a natural linen drum shade, producing light that's bright enough to read by yet soft enough for a relaxed evening atmosphere. A foot-operated dimmer lets you adjust the mood instantly.",
    dimensions: "Base Ø 28 cm × H 160 cm. Shade Ø 40 cm. Cable length: 200 cm.",
    materials: ["Brushed brass stem and base", "Natural linen drum shade", "Foot-operated dimmer switch", "Wipe brass with a dry cloth", "Spot-clean shade with mild detergent"],
  },
  "5": {
    longDescription: "The Trinco Bedside Table is compact yet characterful. A single dovetail drawer slides smoothly on wooden runners, offering discreet storage for nighttime essentials. The angled legs and rounded edges give it a friendly, organic look that pairs with virtually any bed frame, from minimalist platforms to upholstered styles.",
    dimensions: "W 45 cm × D 38 cm × H 52 cm. Drawer interior: 36 × 28 × 8 cm. Custom sizes available on request.",
    materials: ["Solid walnut or oak", "Dovetail drawer joinery", "Natural wax finish", "Dust with a dry cloth", "Apply furniture wax every 6 months"],
  },
  "6": {
    longDescription: "The Nuwara Armchair is designed for everyday comfort without compromising on looks. Its linen-blend seat and back cushions are generously padded, while the exposed wooden arms add a warm, handcrafted touch. The low-profile silhouette fits snugly in smaller rooms, making it an ideal reading chair or accent piece.",
    dimensions: "W 70 cm × D 75 cm × H 80 cm. Seat height: 40 cm. Custom sizes available on request.",
    materials: ["Solid rubberwood frame", "Linen-cotton blend removable covers", "High-resilience foam fill", "Machine-wash covers on gentle cycle", "Keep away from direct heat sources"],
  },
  "7": {
    longDescription: "The Ella Console Table is slim enough for narrow hallways yet stylish enough to stand alone as a focal point. The brass-tipped legs lend a refined sparkle, while the single shallow drawer keeps keys and small items organised. Place a ceramic vase on top and let the table do the rest.",
    dimensions: "W 120 cm × D 35 cm × H 78 cm. Drawer interior: 100 × 25 × 6 cm. Custom sizes available on request.",
    materials: ["Solid oak top and legs", "Brass leg caps and drawer pull", "Clear satin lacquer", "Wipe with a soft damp cloth", "Polish brass fittings with a dry cloth"],
  },
  "8": {
    longDescription: "The Mirissa Pendant Light is a versatile overhead fixture that suits dining tables, kitchen islands, and entryways alike. The frosted glass globe softens the light to a warm, even glow, while the brushed brass canopy and adjustable cord let you hang it at the perfect height.",
    dimensions: "Globe Ø 25 cm. Canopy Ø 12 cm. Cord length adjustable up to 150 cm.",
    materials: ["Frosted borosilicate glass globe", "Brushed brass canopy and hardware", "Compatible with E27 bulbs up to 60 W", "Clean glass with glass cleaner", "Do not exceed recommended wattage"],
  },
  "9": {
    longDescription: "The Dambulla Sofa is a generous three-seater built for family life. Deep, pocket-sprung cushions sit atop a kiln-dried hardwood frame, ensuring years of comfortable use. The wide arms double as armrests and impromptu trays, and the removable covers make seasonal refreshes effortless.",
    dimensions: "W 220 cm × D 95 cm × H 82 cm. Seat depth: 58 cm. Custom sizes available on request.",
    materials: ["Kiln-dried hardwood frame", "Pocket-sprung seat cushions", "Removable linen-blend covers", "Vacuum upholstery weekly", "Professional cleaning recommended annually"],
  },
  "10": {
    longDescription: "The Polonnaruwa Coffee Table is a low-profile centrepiece with a woven rattan shelf that adds texture and warmth. The oval oak top feels organic and inviting, perfect for holding a tray of tea or a stack of art books.",
    dimensions: "L 110 cm × W 60 cm × H 40 cm. Custom sizes available on request.",
    materials: ["Solid oak top", "Natural rattan lower shelf", "Matte lacquer finish", "Dust regularly", "Keep rattan dry"],
  },
  "11": {
    longDescription: "The Bentota Desk Lamp brings focused task lighting to your workspace with an adjustable brass arm and weighted base. Its clean geometry fits modern and traditional desks alike.",
    dimensions: "Base Ø 18 cm × H 48 cm (adjustable). Cable length: 180 cm.",
    materials: ["Brushed brass arm and base", "Frosted glass diffuser", "Inline switch", "Wipe with a dry cloth"],
  },
  "12": {
    longDescription: "The Unawatuna Sideboard offers expansive storage behind two sliding doors. Interior adjustable shelves accommodate everything from dinnerware to vinyl records. The clean oak facade brings Scandinavian simplicity to Sri Lankan living.",
    dimensions: "W 160 cm × D 42 cm × H 80 cm. Interior shelf height: adjustable. Custom sizes available on request.",
    materials: ["Solid oak frame and doors", "Veneered MDF interior", "Brushed steel sliding hardware", "Wipe with a damp cloth", "Avoid placing near radiators"],
  },
};

export const allProducts: Product[] = [
  {
    id: "1", name: "Kandy Lounge Chair", price: 42500, category: "Seating", tag: "Best Seller",
    description: "A sculptural lounge chair with warm beige upholstery and solid teak legs. Designed for long, comfortable evenings.",
    colors: ["Beige", "Charcoal", "Olive"],
    images: [chair1, chair1],
    popularity: 95,
  },
  {
    id: "2", name: "Colombo Dining Table", price: 89000, category: "Tables",
    description: "A generous oak dining table with clean mid-century lines. Seats six comfortably with room to spare.",
    colors: ["Natural Oak", "Walnut"],
    images: [table1, table1],
    popularity: 90,
  },
  {
    id: "3", name: "Galle Bookshelf", price: 37500, category: "Storage", tag: "New",
    description: "Open shelving and closed storage in warm cherry wood. Ideal for books, ceramics, and curated displays.",
    colors: ["Cherry", "Natural Oak"],
    images: [bookshelf1, bookshelf1],
    isNew: true,
    popularity: 78,
  },
  {
    id: "4", name: "Sigiriya Floor Lamp", price: 18900, category: "Lighting",
    description: "A brass floor lamp with a linen drum shade. Casts a warm, ambient glow perfect for reading corners.",
    colors: ["Brass", "Matte Black"],
    images: [lamp1, lamp1],
    popularity: 82,
  },
  {
    id: "5", name: "Trinco Bedside Table", price: 22000, category: "Tables", tag: "Best Seller",
    description: "Compact walnut bedside table with a single drawer and angled legs. Pairs beautifully with any bed frame.",
    colors: ["Walnut", "Natural Oak"],
    images: [bedside1, bedside1],
    popularity: 88,
  },
  {
    id: "6", name: "Nuwara Armchair", price: 35500, category: "Seating",
    description: "A cozy linen armchair with exposed wooden arms. Effortless comfort with an understated silhouette.",
    colors: ["Cream", "Sage", "Charcoal"],
    images: [armchair1, armchair1],
    popularity: 85,
  },
  {
    id: "7", name: "Ella Console Table", price: 46000, category: "Tables", tag: "New",
    description: "A slim oak console table with brass-tipped legs. Perfect for entryways, hallways, or behind the sofa.",
    colors: ["Natural Oak", "Walnut"],
    images: [console1, console1],
    isNew: true,
    popularity: 72,
  },
  {
    id: "8", name: "Mirissa Pendant Light", price: 15500, category: "Lighting",
    description: "A frosted glass globe pendant with brushed brass fittings. Ideal for dining areas and kitchen islands.",
    colors: ["Brass", "Chrome"],
    images: [pendant1, pendant1],
    popularity: 80,
  },
  {
    id: "9", name: "Dambulla Sofa", price: 125000, category: "Seating",
    description: "A generous three-seater sofa with deep cushions and solid wood frame. Built for everyday luxury.",
    colors: ["Cream", "Charcoal", "Sand"],
    images: [armchair1, chair1],
    popularity: 92,
  },
  {
    id: "10", name: "Polonnaruwa Coffee Table", price: 34000, category: "Tables",
    description: "A low-profile oval coffee table in warm oak with a woven rattan shelf below.",
    colors: ["Natural Oak", "Walnut"],
    images: [table1, console1],
    popularity: 75,
  },
  {
    id: "11", name: "Bentota Desk Lamp", price: 12500, category: "Lighting", tag: "New",
    description: "Adjustable brass desk lamp with a weighted base. Clean lines for a focused workspace.",
    colors: ["Brass", "Matte Black"],
    images: [lamp1, pendant1],
    isNew: true,
    popularity: 68,
  },
  {
    id: "12", name: "Unawatuna Sideboard", price: 78000, category: "Storage",
    description: "A wide oak sideboard with sliding doors and interior shelving. Statement storage for dining or living rooms.",
    colors: ["Natural Oak", "Walnut"],
    images: [bookshelf1, console1],
    popularity: 83,
  },
];

export const bestSellers = allProducts.filter(
  (p) => p.tag === "Best Seller" || p.popularity >= 80
);

export const productCategories = [...new Set(allProducts.map((p) => p.category))];

export const productColors = [...new Set(allProducts.flatMap((p) => p.colors))];

export const inspirationRooms = [
  { id: "1", label: "Living Room", subtitle: "Warm & inviting spaces" },
  { id: "2", label: "Dining", subtitle: "Gather around the table" },
  { id: "3", label: "Bedroom", subtitle: "Restful retreats" },
  { id: "4", label: "Office", subtitle: "Productive & stylish" },
  { id: "5", label: "Small Spaces", subtitle: "Make every corner count" },
  { id: "6", label: "Outdoor", subtitle: "Bring comfort outside" },
];

export const faqs = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery across Sri Lanka takes 5–10 business days. For Colombo metro, we offer express 2-day delivery on in-stock items. Custom orders may take 3–6 weeks depending on the piece.",
  },
  {
    q: "Do you offer custom sizes or dimensions?",
    a: "Yes. Most of our furniture lines can be customized in size, finish, and upholstery. Reach out to our design team with your requirements and we'll provide a quote within 48 hours.",
  },
  {
    q: "What warranty do your products carry?",
    a: "All Casa Ceylon furniture comes with a 2-year structural warranty covering manufacturing defects. Upholstery and finishes are covered for 1 year. Extended warranties are available at checkout.",
  },
  {
    q: "Can I choose different finishes or colors?",
    a: "Absolutely. We offer a curated palette of wood stains, fabric swatches, and metal finishes. You can preview combinations using our 'Try in Your Room' tool before ordering.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "We accept returns within 14 days of delivery for unused items in original packaging. Custom-made pieces are final sale. Exchanges for manufacturing issues are handled at no additional cost.",
  },
];

export function formatPrice(price: number): string {
  return `LKR ${price.toLocaleString()}`;
}
