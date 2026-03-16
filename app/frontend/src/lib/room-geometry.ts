import type {
  RoomShape,
  RoomConfig,
  RoomDimensions,
  RectangleDims,
  SquareDims,
} from "@/types/designer";

/* ══════════════════════════════════════════════════════
   Default configs per shape
   ══════════════════════════════════════════════════════ */

const DEFAULT_DIMS: Record<RoomShape, RoomDimensions> = {
  rectangle: { shape: "rectangle", dims: { width: 4.5, length: 6 } },
  square: { shape: "square", dims: { width: 5, length: 5 } },
  "l-shape": {
    shape: "l-shape",
    dims: { mainWidth: 6, mainLength: 7, cutoutWidth: 3, cutoutLength: 3.5, legWidth: 3, legLength: 3.5 },
  },
  "u-shape": {
    shape: "u-shape",
    dims: {
      outerWidth: 7, outerLength: 6, notchWidth: 3, notchDepth: 3.5,
      leftWall: 2, rightWall: 2, backDepth: 2.5, notchStart: 2,
    },
  },
  "t-shape": {
    shape: "t-shape",
    dims: {
      barWidth: 7, barDepth: 2, stemWidth: 3, stemLength: 4,
      leftOverhang: 2, rightOverhang: 2, totalLength: 6, totalWidth: 7,
    },
  },
  studio: { shape: "studio", dims: { width: 6, length: 7, inset: 0.12 } },
};

const DEFAULT_COLORS = {
  wallColor: "#F0F0F0",
  floorColor: "#B8956A",
  ceilingColor: "#FFFFFF",
};

export function getDefaultRoomConfig(shape: RoomShape): RoomConfig {
  return {
    shape,
    dimensions: structuredClone(DEFAULT_DIMS[shape]),
    wallHeight: 2.8,
    wallColor: DEFAULT_COLORS.wallColor,
    floorColor: DEFAULT_COLORS.floorColor,
    ceilingColor: DEFAULT_COLORS.ceilingColor,
    doors: [],
    windows: [],
  };
}

export function getDefaultDimensions(shape: RoomShape): RoomDimensions {
  return structuredClone(DEFAULT_DIMS[shape]);
}

/* ══════════════════════════════════════════════════════
   Derived-field normalization
   ══════════════════════════════════════════════════════ */

export function normalizeRoomDimensions(dim: RoomDimensions): RoomDimensions {
  switch (dim.shape) {
    case "l-shape": {
      const d = dim.dims;
      return {
        shape: "l-shape",
        dims: {
          ...d,
          legWidth: d.mainWidth - d.cutoutWidth,
          legLength: d.mainLength - d.cutoutLength,
        },
      };
    }
    case "u-shape": {
      const d = dim.dims;
      const leftWall = (d.outerWidth - d.notchWidth) / 2;
      return {
        shape: "u-shape",
        dims: {
          ...d,
          leftWall,
          rightWall: leftWall,
          backDepth: d.outerLength - d.notchDepth,
          notchStart: leftWall,
        },
      };
    }
    case "t-shape": {
      const d = dim.dims;
      const leftOverhang = (d.barWidth - d.stemWidth) / 2;
      return {
        shape: "t-shape",
        dims: {
          ...d,
          leftOverhang,
          rightOverhang: leftOverhang,
          totalLength: d.barDepth + d.stemLength,
          totalWidth: d.barWidth,
        },
      };
    }
    default:
      return dim;
  }
}

/* ══════════════════════════════════════════════════════
   Validation
   ══════════════════════════════════════════════════════ */

const MIN_M = 1;
const MAX_M = 30;

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

function rangeCheck(v: number, label: string, errors: Record<string, string>, key: string) {
  if (v <= 0) errors[key] = `${label} must be positive`;
  else if (v < MIN_M) errors[key] = `${label} min ${MIN_M}m`;
  else if (v > MAX_M) errors[key] = `${label} max ${MAX_M}m`;
}

export function validateRoomDimensions(dim: RoomDimensions): ValidationResult {
  const errors: Record<string, string> = {};

  switch (dim.shape) {
    case "rectangle": {
      const d = dim.dims;
      rangeCheck(d.width, "Width", errors, "width");
      rangeCheck(d.length, "Length", errors, "length");
      break;
    }
    case "square": {
      rangeCheck(dim.dims.width, "Width", errors, "width");
      rangeCheck(dim.dims.length, "Length", errors, "length");
      break;
    }
    case "l-shape": {
      const d = dim.dims;
      rangeCheck(d.mainWidth, "Main width", errors, "mainWidth");
      rangeCheck(d.mainLength, "Main length", errors, "mainLength");
      rangeCheck(d.cutoutWidth, "Cutout width", errors, "cutoutWidth");
      rangeCheck(d.cutoutLength, "Cutout length", errors, "cutoutLength");
      if (d.cutoutWidth >= d.mainWidth) errors.cutoutWidth = "Must be less than main width";
      if (d.cutoutLength >= d.mainLength) errors.cutoutLength = "Must be less than main length";
      break;
    }
    case "u-shape": {
      const d = dim.dims;
      rangeCheck(d.outerWidth, "Outer width", errors, "outerWidth");
      rangeCheck(d.outerLength, "Outer length", errors, "outerLength");
      rangeCheck(d.notchWidth, "Notch width", errors, "notchWidth");
      rangeCheck(d.notchDepth, "Notch depth", errors, "notchDepth");
      if (d.notchWidth >= d.outerWidth - 1) errors.notchWidth = "Walls too thin";
      if (d.notchDepth >= d.outerLength) errors.notchDepth = "Must be less than outer length";
      break;
    }
    case "t-shape": {
      const d = dim.dims;
      rangeCheck(d.barWidth, "Bar width", errors, "barWidth");
      rangeCheck(d.barDepth, "Bar depth", errors, "barDepth");
      rangeCheck(d.stemWidth, "Stem width", errors, "stemWidth");
      rangeCheck(d.stemLength, "Stem length", errors, "stemLength");
      if (d.stemWidth >= d.barWidth) errors.stemWidth = "Must be less than bar width";
      break;
    }
    case "studio": {
      const d = dim.dims;
      rangeCheck(d.width, "Width", errors, "width");
      rangeCheck(d.length, "Length", errors, "length");
      if (d.inset < 0 || d.inset > 0.25) errors.inset = "Inset 0–0.25";
      break;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/* ══════════════════════════════════════════════════════
   Polygon generation (meters → relative coords)
   Returns closed polygon as [x,y,x,y,...] starting at
   top-left and going clockwise. Origin at (0,0).
   ══════════════════════════════════════════════════════ */

export function getRoomPolygon(config: RoomConfig): number[] {
  return getRoomPolygonFromDims(config.dimensions);
}

export function getRoomPolygonFromDims(dim: RoomDimensions): number[] {
  const d = normalizeRoomDimensions(dim);

  switch (d.shape) {
    case "rectangle":
      return rectPoly(d.dims.width, d.dims.length);
    case "square":
      return rectPoly(d.dims.width, d.dims.length);
    case "l-shape": {
      const { mainWidth: w, mainLength: h, cutoutWidth: cw, cutoutLength: ch } = d.dims;
      // Clockwise from top-left
      return [
        0, 0,
        w, 0,
        w, h - ch,
        w - cw, h - ch,
        w - cw, h,
        0, h,
      ];
    }
    case "u-shape": {
      const { outerWidth: w, outerLength: h, notchWidth: nw, notchDepth: nd, leftWall: lw } = d.dims;
      return [
        0, 0,
        w, 0,
        w, h,
        lw + nw, h,
        lw + nw, h - nd,
        lw, h - nd,
        lw, h,
        0, h,
      ];
    }
    case "t-shape": {
      const { barWidth: bw, barDepth: bd, stemWidth: sw, leftOverhang: lo } = d.dims;
      const totalH = d.dims.totalLength;
      return [
        0, 0,
        bw, 0,
        bw, bd,
        lo + sw, bd,
        lo + sw, totalH,
        lo, totalH,
        lo, bd,
        0, bd,
      ];
    }
    case "studio": {
      const { width: w, length: h, inset } = d.dims;
      const i = Math.min(w, h) * inset;
      return [
        i, 0,
        w - i, 0,
        w, i,
        w, h - i,
        w - i, h,
        i, h,
        0, h - i,
        0, i,
      ];
    }
  }
}

function rectPoly(w: number, h: number): number[] {
  return [0, 0, w, 0, w, h, 0, h];
}

/* ══════════════════════════════════════════════════════
   Bounding box (meters)
   ══════════════════════════════════════════════════════ */

export interface BoundingBox {
  width: number;
  height: number;
}

export function getRoomBoundingBox(config: RoomConfig): BoundingBox {
  return getBoundingBoxFromDims(config.dimensions);
}

export function getBoundingBoxFromDims(dim: RoomDimensions): BoundingBox {
  const d = normalizeRoomDimensions(dim);
  switch (d.shape) {
    case "rectangle":
      return { width: d.dims.width, height: d.dims.length };
    case "square":
      return { width: d.dims.width, height: d.dims.length };
    case "l-shape":
      return { width: d.dims.mainWidth, height: d.dims.mainLength };
    case "u-shape":
      return { width: d.dims.outerWidth, height: d.dims.outerLength };
    case "t-shape":
      return { width: d.dims.totalWidth, height: d.dims.totalLength };
    case "studio":
      return { width: d.dims.width, height: d.dims.length };
  }
}

/* ══════════════════════════════════════════════════════
   Dimension field schemas (for config-driven forms)
   ══════════════════════════════════════════════════════ */

export interface DimField {
  key: string;
  label: string;
  shortLabel: string;
  derived?: boolean;
}

export const DIMENSION_FIELDS: Record<RoomShape, DimField[]> = {
  rectangle: [
    { key: "width", label: "Width", shortLabel: "W" },
    { key: "length", label: "Length", shortLabel: "L" },
  ],
  square: [
    { key: "width", label: "Width", shortLabel: "W" },
    { key: "length", label: "Length", shortLabel: "L" },
  ],
  "l-shape": [
    { key: "mainWidth", label: "Main Width", shortLabel: "MW" },
    { key: "mainLength", label: "Main Length", shortLabel: "ML" },
    { key: "cutoutWidth", label: "Cutout Width", shortLabel: "CW" },
    { key: "cutoutLength", label: "Cutout Length", shortLabel: "CL" },
    { key: "legWidth", label: "Leg Width", shortLabel: "LW", derived: true },
    { key: "legLength", label: "Leg Length", shortLabel: "LL", derived: true },
  ],
  "u-shape": [
    { key: "outerWidth", label: "Outer Width", shortLabel: "OW" },
    { key: "outerLength", label: "Outer Length", shortLabel: "OL" },
    { key: "notchWidth", label: "Notch Width", shortLabel: "NW" },
    { key: "notchDepth", label: "Notch Depth", shortLabel: "ND" },
    { key: "leftWall", label: "Left Wall", shortLabel: "LW", derived: true },
    { key: "rightWall", label: "Right Wall", shortLabel: "RW", derived: true },
    { key: "backDepth", label: "Back Depth", shortLabel: "BD", derived: true },
    { key: "notchStart", label: "Notch Start", shortLabel: "NS", derived: true },
  ],
  "t-shape": [
    { key: "barWidth", label: "Bar Width", shortLabel: "BW" },
    { key: "barDepth", label: "Bar Depth", shortLabel: "BD" },
    { key: "stemWidth", label: "Stem Width", shortLabel: "SW" },
    { key: "stemLength", label: "Stem Length", shortLabel: "SL" },
    { key: "leftOverhang", label: "Left Overhang", shortLabel: "LO", derived: true },
    { key: "rightOverhang", label: "Right Overhang", shortLabel: "RO", derived: true },
    { key: "totalLength", label: "Total Length", shortLabel: "TL", derived: true },
    { key: "totalWidth", label: "Total Width", shortLabel: "TW", derived: true },
  ],
  studio: [
    { key: "width", label: "Width", shortLabel: "W" },
    { key: "length", label: "Length", shortLabel: "L" },
    { key: "inset", label: "Inset", shortLabel: "I" },
  ],
};

/* ══════════════════════════════════════════════════════
   Legacy compat: convert old flat RoomConfig → new
   ══════════════════════════════════════════════════════ */

export interface LegacyRoomConfig {
  shape: string;
  widthM: number;
  lengthM: number;
  wallColor: string;
  floorColor: string;
}

/* ══════════════════════════════════════════════════════
   Wall segments with dimension-key mappings
   ══════════════════════════════════════════════════════ */

export interface WallSegment {
  x1: number; y1: number;
  x2: number; y2: number;
  lengthM: number;
  label: string;
  dimKey?: string;
}

function wallMeta(shape: RoomShape): Array<{ label: string; dimKey?: string }> {
  switch (shape) {
    case "rectangle":
      return [
        { label: "Width", dimKey: "width" },
        { label: "Length", dimKey: "length" },
        { label: "Width", dimKey: "width" },
        { label: "Length", dimKey: "length" },
      ];
    case "square":
      return [
        { label: "Width", dimKey: "width" },
        { label: "Length", dimKey: "length" },
        { label: "Width", dimKey: "width" },
        { label: "Length", dimKey: "length" },
      ];
    case "l-shape":
      return [
        { label: "Main Width", dimKey: "mainWidth" },
        { label: "Leg Length" },
        { label: "Cutout Width", dimKey: "cutoutWidth" },
        { label: "Cutout Length", dimKey: "cutoutLength" },
        { label: "Leg Width" },
        { label: "Main Length", dimKey: "mainLength" },
      ];
    case "u-shape":
      return [
        { label: "Outer Width", dimKey: "outerWidth" },
        { label: "Outer Length", dimKey: "outerLength" },
        { label: "Right Wall" },
        { label: "Notch Depth", dimKey: "notchDepth" },
        { label: "Notch Width", dimKey: "notchWidth" },
        { label: "Notch Depth", dimKey: "notchDepth" },
        { label: "Left Wall" },
        { label: "Outer Length", dimKey: "outerLength" },
      ];
    case "t-shape":
      return [
        { label: "Bar Width", dimKey: "barWidth" },
        { label: "Bar Depth", dimKey: "barDepth" },
        { label: "Right Overhang" },
        { label: "Stem Length", dimKey: "stemLength" },
        { label: "Stem Width", dimKey: "stemWidth" },
        { label: "Stem Length", dimKey: "stemLength" },
        { label: "Left Overhang" },
        { label: "Bar Depth", dimKey: "barDepth" },
      ];
    case "studio":
      return [
        { label: "Top" },
        { label: "Corner" },
        { label: "Right" },
        { label: "Corner" },
        { label: "Bottom" },
        { label: "Corner" },
        { label: "Left" },
        { label: "Corner" },
      ];
  }
}

export function getWallSegments(config: RoomConfig): WallSegment[] {
  const poly = getRoomPolygon(config);
  const meta = wallMeta(config.shape);
  const segments: WallSegment[] = [];
  const n = poly.length / 2;
  for (let i = 0; i < n; i++) {
    const x1 = poly[i * 2], y1 = poly[i * 2 + 1];
    const ni = (i + 1) % n;
    const x2 = poly[ni * 2], y2 = poly[ni * 2 + 1];
    const lengthM = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const m = meta[i] || { label: `Wall ${i + 1}` };
    segments.push({ x1, y1, x2, y2, lengthM: Math.round(lengthM * 10) / 10, label: m.label, dimKey: m.dimKey });
  }
  return segments;
}

export function fromLegacyRoomConfig(old: LegacyRoomConfig): RoomConfig {
  const shape = (["rectangle", "square", "l-shape", "u-shape", "t-shape", "studio"].includes(old.shape)
    ? old.shape
    : "rectangle") as RoomShape;

  const base = getDefaultRoomConfig(shape);

  // Try to apply width/length from legacy
  if (shape === "rectangle") {
    (base.dimensions as { shape: "rectangle"; dims: RectangleDims }).dims = {
      width: old.widthM,
      length: old.lengthM,
    };
  } else if (shape === "square") {
    (base.dimensions as { shape: "square"; dims: SquareDims }).dims = {
      width: old.widthM,
      length: old.lengthM,
    };
  }

  base.wallColor = old.wallColor;
  base.floorColor = old.floorColor;
  return base;
}
