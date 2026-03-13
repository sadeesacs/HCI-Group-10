import oakSideboard1 from "@/assets/products/storage/oak-sideboard-1.jpg";
import oakSideboard2 from "@/assets/products/storage/oak-sideboard-2.jpg";
import oakSideboard3 from "@/assets/products/storage/oak-sideboard-3.jpg";
import walnutBookshelf1 from "@/assets/products/storage/walnut-bookshelf-1.jpg";
import walnutBookshelf2 from "@/assets/products/storage/walnut-bookshelf-2.jpg";
import walnutBookshelf3 from "@/assets/products/storage/walnut-bookshelf-3.jpg";
import tvConsole1 from "@/assets/products/storage/tv-console-1.jpg";
import tvConsole2 from "@/assets/products/storage/tv-console-2.jpg";
import tvConsole3 from "@/assets/products/storage/tv-console-3.jpg";
import displayCabinet1 from "@/assets/products/storage/display-cabinet-1.jpg";
import displayCabinet2 from "@/assets/products/storage/display-cabinet-2.jpg";
import displayCabinet3 from "@/assets/products/storage/display-cabinet-3.jpg";
import oakWardrobe1 from "@/assets/products/storage/oak-wardrobe-1.jpg";
import oakWardrobe2 from "@/assets/products/storage/oak-wardrobe-2.jpg";
import oakWardrobe3 from "@/assets/products/storage/oak-wardrobe-3.jpg";
import shoeCabinet1 from "@/assets/products/storage/shoe-cabinet-1.jpg";
import shoeCabinet2 from "@/assets/products/storage/shoe-cabinet-2.jpg";
import shoeCabinet3 from "@/assets/products/storage/shoe-cabinet-3.jpg";
import chestDrawers1 from "@/assets/products/storage/chest-drawers-1.jpg";
import chestDrawers2 from "@/assets/products/storage/chest-drawers-2.jpg";
import chestDrawers3 from "@/assets/products/storage/chest-drawers-3.jpg";
import floatingShelves1 from "@/assets/products/storage/floating-shelves-1.jpg";
import floatingShelves2 from "@/assets/products/storage/floating-shelves-2.jpg";
import floatingShelves3 from "@/assets/products/storage/floating-shelves-3.jpg";
import rattanBuffet1 from "@/assets/products/storage/rattan-buffet-1.jpg";
import rattanBuffet2 from "@/assets/products/storage/rattan-buffet-2.jpg";
import rattanBuffet3 from "@/assets/products/storage/rattan-buffet-3.jpg";
import cubeStorage1 from "@/assets/products/storage/cube-storage-1.jpg";
import cubeStorage2 from "@/assets/products/storage/cube-storage-2.jpg";
import cubeStorage3 from "@/assets/products/storage/cube-storage-3.jpg";
import industrialShelf1 from "@/assets/products/storage/industrial-shelf-1.jpg";
import industrialShelf2 from "@/assets/products/storage/industrial-shelf-2.jpg";
import industrialShelf3 from "@/assets/products/storage/industrial-shelf-3.jpg";
import teakCredenza1 from "@/assets/products/storage/teak-credenza-1.jpg";
import teakCredenza2 from "@/assets/products/storage/teak-credenza-2.jpg";
import teakCredenza3 from "@/assets/products/storage/teak-credenza-3.jpg";

import type { Product } from "./mock";

export const storageProducts: Product[] = [
  {
    id: "storage-1",
    name: "Modern Oak Sideboard",
    price: 115000,
    category: "Storage",
    tag: "Best Seller",
    description: "A clean-lined oak sideboard with sliding doors and adjustable interior shelves. Statement storage for dining or living rooms.",
    colors: ["Natural Oak", "Walnut"],
    images: [oakSideboard1, oakSideboard2, oakSideboard3],
    popularity: 92,
  },
  {
    id: "storage-2",
    name: "Walnut Library Bookshelf",
    price: 185000,
    category: "Storage",
    description: "A grand walnut bookshelf with open display shelves and lower cabinets. Built to hold a lifetime of books and treasures.",
    colors: ["Walnut", "Cherry"],
    images: [walnutBookshelf1, walnutBookshelf2, walnutBookshelf3],
    popularity: 88,
  },
  {
    id: "storage-3",
    name: "Slatted TV Media Console",
    price: 98000,
    category: "Storage",
    tag: "Best Seller",
    description: "A wide TV console with slatted doors and open compartments for media equipment. Conceals clutter while keeping devices ventilated.",
    colors: ["Dark Walnut", "Natural Oak"],
    images: [tvConsole1, tvConsole2, tvConsole3],
    popularity: 90,
  },
  {
    id: "storage-4",
    name: "Glass-Front Display Cabinet",
    price: 145000,
    category: "Storage",
    tag: "New",
    description: "A glass-front cabinet with black metal frame and oak shelves. Perfect for showcasing ceramics, glassware, and curated collections.",
    colors: ["Black/Oak", "Black/Walnut"],
    images: [displayCabinet1, displayCabinet2, displayCabinet3],
    isNew: true,
    popularity: 85,
  },
  {
    id: "storage-5",
    name: "Classic Oak Wardrobe",
    price: 225000,
    category: "Storage",
    description: "A two-door solid oak wardrobe with internal shelves, hanging rail, and drawers. Timeless bedroom storage with a warm grain.",
    colors: ["Natural Oak", "White Oak"],
    images: [oakWardrobe1, oakWardrobe2, oakWardrobe3],
    popularity: 86,
  },
  {
    id: "storage-6",
    name: "Entryway Shoe Cabinet",
    price: 82000,
    category: "Storage",
    description: "A slim shoe cabinet with tilt-out compartments and a flat top for keys. Keeps your hallway tidy without sacrificing style.",
    colors: ["Natural Oak", "Walnut"],
    images: [shoeCabinet1, shoeCabinet2, shoeCabinet3],
    popularity: 78,
  },
  {
    id: "storage-7",
    name: "Wide Chest of Drawers",
    price: 135000,
    category: "Storage",
    tag: "New",
    description: "A six-drawer dresser in white oak with brass handles. Generous bedroom storage with a serene, Scandinavian profile.",
    colors: ["White Oak", "Natural Oak"],
    images: [chestDrawers1, chestDrawers2, chestDrawers3],
    isNew: true,
    popularity: 84,
  },
  {
    id: "storage-8",
    name: "Floating Wall Shelf Set",
    price: 45000,
    category: "Storage",
    description: "A set of five staggered walnut floating shelves with hidden brackets. Turn any empty wall into a curated display.",
    colors: ["Dark Walnut", "Natural Oak"],
    images: [floatingShelves1, floatingShelves2, floatingShelves3],
    popularity: 80,
  },
  {
    id: "storage-9",
    name: "Rattan Door Buffet",
    price: 125000,
    category: "Storage",
    tag: "Best Seller",
    description: "A tropical-inspired buffet with handwoven rattan door panels on a solid wood frame. Warm texture meets ample storage.",
    colors: ["Natural", "Honey"],
    images: [rattanBuffet1, rattanBuffet2, rattanBuffet3],
    popularity: 91,
  },
  {
    id: "storage-10",
    name: "Modular Cube Organiser",
    price: 68000,
    category: "Storage",
    description: "A nine-cube modular storage unit in natural wood. Versatile enough for kids' rooms, offices, and living spaces.",
    colors: ["Natural Birch", "White", "Walnut"],
    images: [cubeStorage1, cubeStorage2, cubeStorage3],
    popularity: 76,
  },
  {
    id: "storage-11",
    name: "Industrial Open Shelving",
    price: 95000,
    category: "Storage",
    description: "A five-tier open shelf with reclaimed wood planks and black iron frame. Raw industrial character for lofts and studios.",
    colors: ["Reclaimed Wood/Black", "Oak/Black"],
    images: [industrialShelf1, industrialShelf2, industrialShelf3],
    popularity: 82,
  },
  {
    id: "storage-12",
    name: "Mid-Century Teak Credenza",
    price: 165000,
    category: "Storage",
    tag: "New",
    description: "A vintage-inspired teak credenza with tapered legs, drawers, and cabinet doors. The ultimate mid-century statement piece.",
    colors: ["Teak", "Walnut"],
    images: [teakCredenza1, teakCredenza2, teakCredenza3],
    isNew: true,
    popularity: 89,
  },
];

export const storageProductExtras: Record<string, { longDescription: string; dimensions: string; materials: string[] }> = {
  "storage-1": {
    longDescription: "The Modern Oak Sideboard is a versatile centrepiece for dining rooms and living areas alike. Two smooth-gliding sliding doors conceal adjustable interior shelves, letting you customise the space for dinnerware, linens, or media equipment. The solid oak top provides a generous surface for styling with ceramics, lamps, or art. Clean lines and a low-profile silhouette give it a contemporary feel that pairs with virtually any interior style.",
    dimensions: "W 160 cm × D 42 cm × H 78 cm. Interior shelf height: adjustable.",
    materials: ["Solid European oak frame and top", "Oak veneer sliding doors", "Brushed steel sliding hardware", "Adjustable interior shelves", "Wipe with a damp cloth", "Avoid placing near radiators"],
  },
  "storage-2": {
    longDescription: "The Walnut Library Bookshelf is designed for serious collectors. Standing over two metres tall, it features eight open compartments for books and display objects, plus four lower cabinets for concealed storage. The crown moulding and stepped base add a classical flourish, while the deep walnut tone brings gravitas to any study or living room. Adjustable shelves accommodate oversized art books alongside standard titles.",
    dimensions: "W 180 cm × D 38 cm × H 210 cm. Shelf depth: 32 cm.",
    materials: ["Solid walnut frame", "Walnut veneer back panel", "Adjustable shelf pins", "Soft-close cabinet doors", "Dust regularly with microfibre cloth", "Apply furniture wax every 6 months"],
  },
  "storage-3": {
    longDescription: "The Slatted TV Media Console keeps your entertainment setup organised and ventilated. Three open compartments house media players, game consoles, and sound bars, while two slatted-door cabinets conceal everything else. A rear cable management channel keeps cords tidy. The wide format accommodates TVs up to 65 inches and the low stance creates a grounded, contemporary look.",
    dimensions: "W 180 cm × D 45 cm × H 55 cm. Accommodates TVs up to 65\".",
    materials: ["Solid hardwood frame", "Slatted MDF doors with wood veneer", "Rear cable management groove", "Soft-close door hinges", "Wipe with a soft cloth", "Keep ventilation slots clear"],
  },
  "storage-4": {
    longDescription: "The Glass-Front Display Cabinet transforms your favourite objects into a curated exhibition. The slender black metal frame holds four adjustable oak shelves behind tempered glass doors, protecting contents from dust while keeping them visible. Built-in LED puck lights illuminate each tier. Use it in the dining room for fine china, in the living room for art objects, or in the hallway for a striking first impression.",
    dimensions: "W 100 cm × D 40 cm × H 190 cm. Shelf height: adjustable.",
    materials: ["Powder-coated steel frame", "Tempered glass doors and side panels", "Solid oak shelves", "Built-in LED lighting", "Clean glass with glass cleaner", "Wipe frame with dry cloth"],
  },
  "storage-5": {
    longDescription: "The Classic Oak Wardrobe provides generous bedroom storage in a timeless silhouette. Two panelled doors open to reveal a full-width hanging rail, three adjustable shelves, and two lower drawers. The crown moulding top and plinth base give it a refined, traditional look. Solid brass knobs and soft-close hinges complete the quality feel. Available in natural or white-washed oak.",
    dimensions: "W 120 cm × D 60 cm × H 200 cm. Hanging height: 110 cm.",
    materials: ["Solid European oak", "Dovetail drawer joinery", "Soft-close hinges and drawer slides", "Brushed brass knobs", "Adjustable internal shelves", "Wipe with damp cloth, apply wax annually"],
  },
  "storage-6": {
    longDescription: "The Entryway Shoe Cabinet is designed to maximise storage in minimal floor space. Three tilt-out compartments each hold two to three pairs of shoes, while the flat top provides a drop zone for keys, wallets, and mail. The slim 25 cm depth fits comfortably in narrow hallways without blocking traffic. A clean oak facade keeps footwear hidden and your entrance looking polished.",
    dimensions: "W 80 cm × D 25 cm × H 110 cm. Each compartment: 76 × 22 × 20 cm.",
    materials: ["Solid oak frame and top", "MDF compartment panels with oak veneer", "Tilt-out metal hinges", "Anti-tip wall bracket included", "Wipe with a damp cloth", "Ventilate compartments regularly"],
  },
  "storage-7": {
    longDescription: "The Wide Chest of Drawers offers ample bedroom storage without visual bulk. Six drawers arranged in three rows of two run on full-extension ball-bearing slides, giving you complete access to contents. Tapered legs lift the piece off the floor, creating an airy, mid-century profile. Brushed brass bar handles add a warm metallic accent against the pale white oak finish.",
    dimensions: "W 140 cm × D 48 cm × H 85 cm. Drawer interior depth: 38 cm.",
    materials: ["Solid white oak frame", "Oak veneer drawer fronts", "Full-extension ball-bearing slides", "Brushed brass handles", "Soft-close drawer mechanism", "Dust with microfibre cloth"],
  },
  "storage-8": {
    longDescription: "The Floating Wall Shelf Set transforms any blank wall into a display gallery. Five shelves of varying lengths create a dynamic, staggered composition. Hidden steel brackets give the illusion that each shelf floats freely. The deep walnut finish adds warmth, while the 4 cm thickness provides a substantial, high-quality feel. Use them for books, plants, framed photos, or small sculptures.",
    dimensions: "Shelf lengths: 120, 100, 80, 60, 40 cm. Depth: 22 cm. Thickness: 4 cm.",
    materials: ["Solid walnut with satin lacquer", "Hidden steel mounting brackets", "Wall anchors included", "Supports up to 15 kg per shelf", "Dust with a dry cloth", "Re-apply lacquer as needed"],
  },
  "storage-9": {
    longDescription: "The Rattan Door Buffet brings a laid-back tropical warmth to your dining or living room. Three doors feature hand-woven rattan cane panels that allow air to circulate while concealing contents. The solid wood frame is finished in a warm honey tone, and the interior includes adjustable shelves and a cutlery drawer. The curved rattan feet add a distinctive finishing touch.",
    dimensions: "W 150 cm × D 40 cm × H 82 cm. Interior shelf height: adjustable.",
    materials: ["Solid mango wood frame", "Hand-woven natural rattan panels", "Adjustable interior shelves", "Brass door knobs", "Dust rattan with a soft brush", "Keep away from direct moisture"],
  },
  "storage-10": {
    longDescription: "The Modular Cube Organiser is a flexible storage solution that adapts to your needs. Nine open cubes can be used with or without fabric bins, baskets, or door inserts. Stack multiple units for a custom wall of storage, or use a single unit as a room divider. The solid birch plywood construction is sturdy enough for books and heavy objects, while the natural finish suits any decor.",
    dimensions: "W 110 cm × D 35 cm × H 110 cm. Each cube: 33 × 33 × 33 cm.",
    materials: ["Solid birch plywood", "Clear matte lacquer finish", "Anti-tip wall bracket included", "Compatible with standard cube bins", "Wipe with a damp cloth", "Do not exceed 10 kg per cube"],
  },
  "storage-11": {
    longDescription: "The Industrial Open Shelving unit brings raw, honest character to any space. Five thick reclaimed wood planks sit on a bolted black iron frame, creating an open display that doubles as a room divider. The wood's natural variations — knots, grain swirls, and tonal shifts — ensure every unit is unique. Use it in a living room for books, in a kitchen for pantry items, or in an office for supplies.",
    dimensions: "W 120 cm × D 40 cm × H 180 cm. Shelf spacing: 35 cm.",
    materials: ["Reclaimed hardwood planks", "Powder-coated iron frame", "Bolt-on assembly", "Floor levelling feet included", "Wipe wood with a damp cloth", "Oil wood annually to maintain finish"],
  },
  "storage-12": {
    longDescription: "The Mid-Century Teak Credenza is a lovingly designed tribute to 1960s Danish furniture. The warm teak veneer showcases a distinctive straight grain, while angled tapered legs elevate the piece off the floor for a light, floating appearance. Two cabinet sections with carved teak handles flank a central bank of three drawers. Interior shelving accommodates vinyl records, board games, or tableware with ease.",
    dimensions: "W 180 cm × D 45 cm × H 75 cm. Leg height: 15 cm.",
    materials: ["Solid teak frame and legs", "Teak veneer door and drawer fronts", "Carved teak handles", "Soft-close drawer slides", "Wipe with a soft damp cloth", "Apply teak oil every 6 months"],
  },
};
