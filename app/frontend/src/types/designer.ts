export interface PlacedFurniture {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  label: string;
  glbPath?: string;
  cushionColor?: string;
}

export type RoomShape = "rectangle" | "square" | "l-shape" | "u-shape" | "t-shape" | "studio";

/* ── Per-shape dimension schemas ── */

export interface RectangleDims {
  width: number;
  length: number;
}

export interface SquareDims {
  width: number;
  length: number;
}

/**
 * L-shape:
 *   ┌──────A──────┐
 *   │              │ B
 *   │   ┌──C──┐   │
 *   │   │      D
 *   │   │
 *  F│   │
 *   └───┘
 *     E
 *
 * A = mainWidth, B = mainLength, C = cutoutWidth, D = cutoutLength
 * E = mainWidth - cutoutWidth, F = mainLength - cutoutLength (derived)
 */
export interface LShapeDims {
  mainWidth: number;
  mainLength: number;
  cutoutWidth: number;
  cutoutLength: number;
  legWidth: number;   // derived = mainWidth - cutoutWidth
  legLength: number;  // derived = mainLength - cutoutLength
}

/**
 * U-shape: a rectangle with a rectangular bite from one side
 *   ┌───────────────┐
 *   │               │
 *   │  ┌─────────┐  │
 *   │  │  notch  │  │
 *   │  │         │  │
 *   └──┘         └──┘
 */
export interface UShapeDims {
  outerWidth: number;
  outerLength: number;
  notchWidth: number;
  notchDepth: number;
  leftWall: number;   // derived = (outerWidth - notchWidth) / 2
  rightWall: number;  // derived
  backDepth: number;  // derived = outerLength - notchDepth
  notchStart: number; // derived = leftWall (horizontal offset of notch)
}

/**
 * T-shape: a rectangle with a stem on one side
 *   ┌───────────────┐
 *   │    top bar     │
 *   └──┐         ┌──┘
 *      │  stem   │
 *      │         │
 *      └─────────┘
 */
export interface TShapeDims {
  barWidth: number;
  barDepth: number;
  stemWidth: number;
  stemLength: number;
  leftOverhang: number;  // derived = (barWidth - stemWidth) / 2
  rightOverhang: number; // derived
  totalLength: number;   // derived = barDepth + stemLength
  totalWidth: number;    // derived = barWidth
}

export interface StudioDims {
  width: number;
  length: number;
  inset: number; // corner chamfer factor 0-0.25
}

export type RoomDimensions =
  | { shape: "rectangle"; dims: RectangleDims }
  | { shape: "square"; dims: SquareDims }
  | { shape: "l-shape"; dims: LShapeDims }
  | { shape: "u-shape"; dims: UShapeDims }
  | { shape: "t-shape"; dims: TShapeDims }
  | { shape: "studio"; dims: StudioDims };

/* ── Placeholder types for future door/window support ── */

export interface DoorPlacement {
  id: string;
  wallIndex: number;
  positionAlongWall: number; // 0–1 fraction
  widthM: number;
}

export interface WindowPlacement {
  id: string;
  wallIndex: number;
  positionAlongWall: number;
  widthM: number;
  heightM: number;
  sillHeightM: number;
}

/* ── Room config ── */

export interface RoomConfig {
  shape: RoomShape;
  dimensions: RoomDimensions;
  wallHeight: number;
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  doors: DoorPlacement[];
  windows: WindowPlacement[];
}

export interface DesignFile {
  id: string;
  slotIndex: number;
  name: string;
  roomConfig: RoomConfig;
  items: PlacedFurniture[];
  createdAt: string;
  updatedAt: string;
}

export interface DesignSlot {
  slotIndex: number;
  design: DesignFile | null;
}
