import type { DesignSlot } from "@/types/designer";
import { getDefaultRoomConfig } from "@/lib/room-geometry";
import type { RoomConfig } from "@/types/designer";

function makeRectConfig(w: number, l: number, wallColor: string, floorColor: string): RoomConfig {
  const base = getDefaultRoomConfig("rectangle");
  (base.dimensions as { shape: "rectangle"; dims: { width: number; length: number } }).dims = { width: w, length: l };
  base.wallColor = wallColor;
  base.floorColor = floorColor;
  return base;
}

function makeStudioConfig(w: number, l: number, wallColor: string, floorColor: string): RoomConfig {
  const base = getDefaultRoomConfig("studio");
  (base.dimensions as { shape: "studio"; dims: { width: number; length: number; inset: number } }).dims = { width: w, length: l, inset: 0.12 };
  base.wallColor = wallColor;
  base.floorColor = floorColor;
  return base;
}

export const INITIAL_DESIGN_SLOTS: DesignSlot[] = [
  {
    slotIndex: 0,
    design: {
      id: "df-1",
      slotIndex: 0,
      name: "Modern Living Setup",
      roomConfig: makeRectConfig(4.5, 6, "hsl(0, 0%, 95%)", "hsl(35, 30%, 87%)"),
      items: [
        { id: "p1", name: "Nordic Sofa", x: 40, y: 60, width: 120, height: 50, rotation: 0, color: "hsl(35, 28%, 82%)", label: "Sofa" },
        { id: "p2", name: "Side Table", x: 180, y: 80, width: 35, height: 35, rotation: 0, color: "hsl(28, 30%, 72%)", label: "Table" },
        { id: "p3", name: "Accent Chair", x: 60, y: 180, width: 50, height: 50, rotation: 15, color: "hsl(32, 25%, 78%)", label: "Chair" },
        { id: "p4", name: "Bookshelf", x: 240, y: 30, width: 30, height: 90, rotation: 0, color: "hsl(25, 22%, 68%)", label: "Shelf" },
      ],
      createdAt: "2025-11-20T10:30:00Z",
      updatedAt: "2026-01-15T14:22:00Z",
    },
  },
  {
    slotIndex: 1,
    design: {
      id: "df-2",
      slotIndex: 1,
      name: "Compact Bedroom Plan",
      roomConfig: makeRectConfig(3.5, 4, "hsl(0, 0%, 95%)", "hsl(30, 25%, 80%)"),
      items: [
        { id: "p10", name: "Horizon Bed", x: 60, y: 40, width: 100, height: 80, rotation: 0, color: "hsl(28, 22%, 75%)", label: "Bed" },
        { id: "p11", name: "Bedside Table", x: 170, y: 40, width: 30, height: 30, rotation: 0, color: "hsl(25, 20%, 70%)", label: "Table" },
      ],
      createdAt: "2025-12-05T09:15:00Z",
      updatedAt: "2026-02-10T16:40:00Z",
    },
  },
  {
    slotIndex: 2,
    design: {
      id: "df-3",
      slotIndex: 2,
      name: "Dining Space A",
      roomConfig: makeRectConfig(5, 5, "hsl(0, 0%, 93%)", "hsl(35, 28%, 85%)"),
      items: [
        { id: "p20", name: "Ashwood Dining Table", x: 80, y: 80, width: 90, height: 60, rotation: 0, color: "hsl(30, 25%, 70%)", label: "Table" },
        { id: "p21", name: "Dining Chair", x: 60, y: 160, width: 35, height: 35, rotation: 0, color: "hsl(28, 20%, 75%)", label: "Chair" },
        { id: "p22", name: "Dining Chair", x: 120, y: 160, width: 35, height: 35, rotation: 0, color: "hsl(28, 20%, 75%)", label: "Chair" },
        { id: "p23", name: "Sideboard", x: 200, y: 30, width: 40, height: 80, rotation: 0, color: "hsl(25, 18%, 65%)", label: "Storage" },
      ],
      createdAt: "2026-01-08T11:00:00Z",
      updatedAt: "2026-03-01T13:55:00Z",
    },
  },
  {
    slotIndex: 3,
    design: {
      id: "df-4",
      slotIndex: 3,
      name: "Open Studio Layout",
      roomConfig: makeStudioConfig(6, 7, "hsl(0, 0%, 96%)", "hsl(32, 32%, 88%)"),
      items: [
        { id: "p30", name: "Linen Lounge Sofa", x: 50, y: 100, width: 140, height: 55, rotation: 0, color: "hsl(35, 30%, 84%)", label: "Sofa" },
        { id: "p31", name: "Console Table", x: 50, y: 30, width: 80, height: 25, rotation: 0, color: "hsl(25, 22%, 68%)", label: "Console" },
        { id: "p32", name: "Floor Lamp", x: 200, y: 90, width: 25, height: 25, rotation: 0, color: "hsl(40, 35%, 78%)", label: "Lamp" },
      ],
      createdAt: "2026-02-14T08:45:00Z",
      updatedAt: "2026-03-05T10:20:00Z",
    },
  },
  { slotIndex: 4, design: null },
  { slotIndex: 5, design: null },
  { slotIndex: 6, design: null },
  { slotIndex: 7, design: null },
  { slotIndex: 8, design: null },
  { slotIndex: 9, design: null },
];
