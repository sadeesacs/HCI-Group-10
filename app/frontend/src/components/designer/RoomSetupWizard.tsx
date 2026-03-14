import { useState, useCallback, useMemo } from "react";
import {
  RectangleHorizontal, Square, LayoutPanelLeft, LayoutDashboard,
  PanelTop, Maximize2, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomShape, RoomConfig, RoomDimensions } from "@/types/designer";
import {
  getDefaultRoomConfig,
  getDefaultDimensions,
  normalizeRoomDimensions,
  validateRoomDimensions,
  getRoomPolygon,
  getRoomBoundingBox,
  getWallSegments,
} from "@/lib/room-geometry";
import Room3DPreview from "./Room3DPreview";

/* ═══════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════ */

const STEPS = [
  { title: "Set the shape and size", subtitle: "Choose the room shape for your design." },
  { title: "Adjust your dimensions", subtitle: "Click a wall on the floor plan to adjust its length." },
  { title: "Set wall height", subtitle: "Adjust how tall the room's walls are." },
  { title: "Choose your room style", subtitle: "Pick colors for walls, floor, and ceiling." },
];

const ROOM_SHAPES: { id: RoomShape; label: string; icon: typeof Square }[] = [
  { id: "rectangle", label: "Rectangle", icon: RectangleHorizontal },
  { id: "square", label: "Square", icon: Square },
  { id: "l-shape", label: "L-Shape", icon: LayoutPanelLeft },
  { id: "u-shape", label: "U-Shape", icon: LayoutDashboard },
  { id: "t-shape", label: "T-Shape", icon: PanelTop },
  { id: "studio", label: "Studio", icon: Maximize2 },
];

const WALL_COLORS = [
  "#FFFFFF", "#E8DFD0", "#D4C4B0", "#C67D3A", "#8B5E3C", "#C5D5DC", "#A8C4D4",
  "#5D7D7E", "#8B9B6E", "#6E7B73", "#9B8B6E", "#7E5E7E", "#4E7E6E", "#3D5E4E",
];

const FLOOR_COLORS = [
  "#D2B48C", "#C4A57B", "#B8956A", "#A6845C", "#8B7355", "#7A6548", "#6B5740", "#5C4A35",
];

const CEILING_COLORS = [
  "#FFFFFF", "#FDFCFA", "#FAF8F5", "#F5F2ED", "#F0ECE4", "#EBE6DC", "#E5DFD3", "#DED7C9",
];

/* ═══════════════════════════════════════════════════
   Wizard component
   ═══════════════════════════════════════════════════ */

interface RoomSetupWizardProps {
  initialConfig: RoomConfig;
  onComplete: (config: RoomConfig) => void;
  onCancel?: () => void;
}

const RoomSetupWizard = ({ initialConfig, onComplete, onCancel }: RoomSetupWizardProps) => {
  const [step, setStep] = useState(0);

  // Draft room state
  const [shape, setShape] = useState<RoomShape>(initialConfig.shape);
  const [dimensions, setDimensions] = useState<RoomDimensions>(initialConfig.dimensions);
  const [wallHeight, setWallHeight] = useState(initialConfig.wallHeight ?? 2.8);
  const [wallColor, setWallColor] = useState(initialConfig.wallColor);
  const [floorColor, setFloorColor] = useState(initialConfig.floorColor);
  const [ceilingColor, setCeilingColor] = useState(initialConfig.ceilingColor);

  // Step 2 — wall selection
  const [selectedWallIdx, setSelectedWallIdx] = useState<number | null>(null);
  const [wallEditValue, setWallEditValue] = useState("");

  // Build current draft config
  const draftConfig = useMemo(
    (): RoomConfig => ({
      shape,
      dimensions: normalizeRoomDimensions(dimensions),
      wallHeight,
      wallColor,
      floorColor,
      ceilingColor,
      doors: [],
      windows: [],
    }),
    [shape, dimensions, wallHeight, wallColor, floorColor, ceilingColor],
  );

  const handleShapeSelect = useCallback((s: RoomShape) => {
    setShape(s);
    setDimensions(getDefaultDimensions(s));
    setSelectedWallIdx(null);
  }, []);

  const handleNext = useCallback(() => {
    if (step < 3) {
      setStep(step + 1);
      setSelectedWallIdx(null);
    } else {
      onComplete(draftConfig);
    }
  }, [step, draftConfig, onComplete]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      setStep(step - 1);
      setSelectedWallIdx(null);
    } else {
      onCancel?.();
    }
  }, [step, onCancel]);

  return (
    <div className="flex h-screen bg-background">
      {/* ── Left Panel ── */}
      <div className="flex w-full flex-col border-r border-border md:w-[42%] lg:w-[38%]">
        {/* Step header */}
        <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4 lg:px-10 lg:pt-10">
          <p className="text-[13px] font-medium text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </p>
          <h1 className="mt-1 text-xl font-bold text-foreground lg:text-2xl">{STEPS[step].title}</h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{STEPS[step].subtitle}</p>

          <div className="mt-6">
            {step === 0 && (
              <StepShape shape={shape} onSelect={handleShapeSelect} />
            )}
            {step === 1 && (
              <StepDimensionsPanel
                config={draftConfig}
                selectedWallIdx={selectedWallIdx}
              />
            )}
            {step === 2 && (
              <StepHeight wallHeight={wallHeight} onChange={setWallHeight} />
            )}
            {step === 3 && (
              <StepColors
                wallColor={wallColor}
                floorColor={floorColor}
                ceilingColor={ceilingColor}
                onWallColor={setWallColor}
                onFloorColor={setFloorColor}
                onCeilingColor={setCeilingColor}
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 border-t border-border p-5 lg:p-6">
          {step > 0 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              className="h-11 flex-1 rounded-full border-foreground/20 text-sm font-semibold"
            >
              Go back
            </Button>
          ) : onCancel ? (
            <Button
              variant="outline"
              onClick={onCancel}
              className="h-11 flex-1 rounded-full border-foreground/20 text-sm font-semibold"
            >
              Cancel
            </Button>
          ) : null}
          <Button
            onClick={handleNext}
            className="h-11 flex-1 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90"
          >
            {step === 3 ? "Design this room" : "Next"}
          </Button>
        </div>
      </div>

      {/* ── Right Panel — Preview ── */}
      <div className="hidden flex-1 items-center justify-center bg-[hsl(0,0%,88%)] p-4 md:flex lg:p-6">
        {step <= 1 ? (
          <FloorPlanEditor
            config={draftConfig}
            selectedWallIdx={step === 1 ? selectedWallIdx : null}
            onWallSelect={(idx) => {
              if (step !== 1) return;
              const segments = getWallSegments(draftConfig);
              const wall = segments[idx];
              setSelectedWallIdx(idx);
              if (wall.dimKey) {
                const dimValues = draftConfig.dimensions.dims as unknown as Record<string, number>;
                setWallEditValue(String(dimValues[wall.dimKey] ?? wall.lengthM));
              }
            }}
            editValue={step === 1 ? wallEditValue : ""}
            onEditChange={step === 1 ? setWallEditValue : () => {}}
            onEditApply={() => {
              if (step !== 1 || selectedWallIdx === null) return;
              const segments = getWallSegments(draftConfig);
              const wall = segments[selectedWallIdx];
              if (!wall.dimKey) return;
              const parsed = parseFloat(wallEditValue);
              if (isNaN(parsed) || parsed <= 0) return;
              const rounded = Math.round(parsed * 10) / 10;
              const updated = {
                ...dimensions,
                dims: { ...dimensions.dims, [wall.dimKey]: rounded },
              } as RoomDimensions;
              const normalized = normalizeRoomDimensions(updated);
              if (validateRoomDimensions(normalized).valid) {
                setDimensions(normalized);
              }
            }}
          />
        ) : (
          <div className="h-full w-full overflow-hidden rounded-xl border border-border bg-[hsl(0,0%,96%)] shadow-lg">
            <Room3DPreview
              roomConfig={draftConfig}
              furniture={[]}
              cameraPreset="front"
              cameraLocked
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Step 1 — Shape selection
   ═══════════════════════════════════════════════════ */

const StepShape = ({
  shape,
  onSelect,
}: {
  shape: RoomShape;
  onSelect: (s: RoomShape) => void;
}) => (
  <div className="grid grid-cols-2 gap-3">
    {ROOM_SHAPES.map((s) => {
      const active = shape === s.id;
      return (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`group relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
            active
              ? "border-foreground bg-background shadow-md"
              : "border-border bg-accent/20 hover:border-foreground/30 hover:bg-accent/40"
          }`}
          aria-pressed={active}
        >
          {/* Selection handles at corners */}
          {active && (
            <>
              <span className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full border-2 border-foreground bg-background" />
              <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full border-2 border-foreground bg-background" />
              <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full border-2 border-foreground bg-background" />
              <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full border-2 border-foreground bg-background" />
            </>
          )}
          <ShapePreview shape={s.id} active={active} />
          <span className={`text-xs font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>
            {s.label}
          </span>
        </button>
      );
    })}
  </div>
);

/** Tiny SVG preview of a room shape. */
const ShapePreview = ({ shape, active }: { shape: RoomShape; active: boolean }) => {
  const config = getDefaultRoomConfig(shape);
  const poly = getRoomPolygon(config);
  const bb = getRoomBoundingBox(config);
  const size = 72;
  const pad = 6;
  const s = Math.min((size - pad * 2) / bb.width, (size - pad * 2) / bb.height);
  const ox = (size - bb.width * s) / 2;
  const oy = (size - bb.height * s) / 2;
  const pts: string[] = [];
  for (let i = 0; i < poly.length; i += 2) {
    pts.push(`${poly[i] * s + ox},${poly[i + 1] * s + oy}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon
        points={pts.join(" ")}
        fill={active ? "hsl(0,0%,92%)" : "hsl(0,0%,88%)"}
        stroke={active ? "hsl(0,0%,15%)" : "hsl(0,0%,65%)"}
        strokeWidth={active ? 2 : 1.2}
      />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════
   Step 2 — Dimension panel (left side info)
   ═══════════════════════════════════════════════════ */

const StepDimensionsPanel = ({
  config,
  selectedWallIdx,
}: {
  config: RoomConfig;
  selectedWallIdx: number | null;
}) => {
  const segments = getWallSegments(config);
  const selectedWall = selectedWallIdx !== null ? segments[selectedWallIdx] : null;

  return (
    <div className="space-y-4">
      <p className="text-[12px] text-muted-foreground leading-relaxed">
        Click on a wall in the floor plan to select it and change its dimension.
        Editable walls will highlight when selected.
      </p>

      {/* Mini shape diagram */}
      <div className="flex justify-center">
        <MiniShapeDiagram config={config} selectedWallIdx={selectedWallIdx} />
      </div>

      {selectedWall ? (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-center">
          <p className="text-xs font-semibold text-yellow-800">{selectedWall.label}</p>
          <p className="text-lg font-bold text-yellow-900">{selectedWall.lengthM.toFixed(1)} m</p>
          {selectedWall.dimKey ? (
            <p className="text-[11px] text-yellow-700">Edit the value in the floor plan →</p>
          ) : (
            <p className="text-[11px] text-yellow-700">This wall's length is derived from other dimensions</p>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-accent/30 p-3 text-center">
          <p className="text-xs text-muted-foreground">Select a wall to edit its dimension</p>
        </div>
      )}
    </div>
  );
};

/** Small shape diagram with highlighted selected wall. */
const MiniShapeDiagram = ({
  config,
  selectedWallIdx,
}: {
  config: RoomConfig;
  selectedWallIdx: number | null;
}) => {
  const poly = getRoomPolygon(config);
  const bb = getRoomBoundingBox(config);
  const size = 140;
  const pad = 12;
  const s = Math.min((size - pad * 2) / bb.width, (size - pad * 2) / bb.height);
  const ox = (size - bb.width * s) / 2;
  const oy = (size - bb.height * s) / 2;
  const n = poly.length / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon
        points={Array.from({ length: n })
          .map((_, i) => `${poly[i * 2] * s + ox},${poly[i * 2 + 1] * s + oy}`)
          .join(" ")}
        fill="hsl(0,0%,92%)"
        stroke="hsl(0,0%,70%)"
        strokeWidth={1}
      />
      {Array.from({ length: n }).map((_, i) => {
        const ni = (i + 1) % n;
        const x1 = poly[i * 2] * s + ox;
        const y1 = poly[i * 2 + 1] * s + oy;
        const x2 = poly[ni * 2] * s + ox;
        const y2 = poly[ni * 2 + 1] * s + oy;
        const selected = selectedWallIdx === i;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={selected ? "#EAB308" : "hsl(0,0%,30%)"}
            strokeWidth={selected ? 5 : 2}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

/* ═══════════════════════════════════════════════════
   Step 2 — Interactive floor plan (right panel)
   ═══════════════════════════════════════════════════ */

const FloorPlanEditor = ({
  config,
  selectedWallIdx,
  onWallSelect,
  editValue,
  onEditChange,
  onEditApply,
}: {
  config: RoomConfig;
  selectedWallIdx: number | null;
  onWallSelect: (idx: number) => void;
  editValue: string;
  onEditChange: (v: string) => void;
  onEditApply: () => void;
}) => {
  const segments = getWallSegments(config);
  const poly = getRoomPolygon(config);
  const bbox = getRoomBoundingBox(config);
  const n = poly.length / 2;

  const viewW = 650;
  const viewH = 500;
  const pad = 80;
  const scale = Math.min((viewW - pad * 2) / bbox.width, (viewH - pad * 2) / bbox.height);
  const roomW = bbox.width * scale;
  const roomH = bbox.height * scale;
  const ox = (viewW - roomW) / 2;
  const oy = (viewH - roomH) / 2;

  const polyPoints = Array.from({ length: n })
    .map((_, i) => `${poly[i * 2] * scale + ox},${poly[i * 2 + 1] * scale + oy}`)
    .join(" ");

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative rounded-xl border border-border bg-[hsl(0,0%,94%)] shadow-lg overflow-hidden">
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          className="block w-full max-w-[700px]"
          style={{ aspectRatio: `${viewW}/${viewH}` }}
        >
          {/* Floor fill */}
          <polygon
            points={polyPoints}
            fill={config.floorColor || "#D2B48C"}
            stroke="none"
          />

          {/* Wall segments */}
          {segments.map((seg, i) => {
            const x1 = seg.x1 * scale + ox;
            const y1 = seg.y1 * scale + oy;
            const x2 = seg.x2 * scale + ox;
            const y2 = seg.y2 * scale + oy;
            const selected = selectedWallIdx === i;
            const editable = !!seg.dimKey;

            return (
              <g key={i}>
                {/* Invisible wider hit area */}
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="transparent"
                  strokeWidth={20}
                  style={{ cursor: editable ? "pointer" : "default" }}
                  onClick={() => onWallSelect(i)}
                />
                {/* Visible wall line */}
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={selected ? "#EAB308" : "#1a1a1a"}
                  strokeWidth={selected ? 10 : 7}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke 0.2s, stroke-width 0.2s",
                    pointerEvents: "none",
                  }}
                />
              </g>
            );
          })}

          {/* Dimension labels */}
          {segments.map((seg, i) => {
            const x1 = seg.x1 * scale + ox;
            const y1 = seg.y1 * scale + oy;
            const x2 = seg.x2 * scale + ox;
            const y2 = seg.y2 * scale + oy;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 10) return null;

            // Outward normal (right-hand for CW polygon)
            const nx = dy / len;
            const ny = -dx / len;
            const labelDist = 28;
            const mx = (x1 + x2) / 2 + nx * labelDist;
            const my = (y1 + y2) / 2 + ny * labelDist;

            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            if (angle > 90 || angle < -90) angle += 180;

            const selected = selectedWallIdx === i;

            return (
              <text
                key={`dim-${i}`}
                x={mx}
                y={my}
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${angle}, ${mx}, ${my})`}
                fontSize={12}
                fontWeight={600}
                fontFamily="Inter, sans-serif"
                fill={selected ? "#CA8A04" : "#555"}
              >
                {seg.lengthM.toFixed(1)}m
              </text>
            );
          })}

          {/* Corner handles */}
          {Array.from({ length: n }).map((_, i) => (
            <circle
              key={`c-${i}`}
              cx={poly[i * 2] * scale + ox}
              cy={poly[i * 2 + 1] * scale + oy}
              r={5}
              fill="white"
              stroke="#333"
              strokeWidth={2}
            />
          ))}
        </svg>

        {/* Floating dimension editor for selected wall */}
        {selectedWallIdx !== null && (() => {
          const seg = segments[selectedWallIdx];
          if (!seg.dimKey) return null;
          const x1 = seg.x1 * scale + ox;
          const y1 = seg.y1 * scale + oy;
          const x2 = seg.x2 * scale + ox;
          const y2 = seg.y2 * scale + oy;
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = dy / len;
          const ny = -dx / len;
          // Position popup further out from the wall
          const popX = ((x1 + x2) / 2 + nx * 55) / viewW * 100;
          const popY = ((y1 + y2) / 2 + ny * 55) / viewH * 100;

          return (
            <div
              className="absolute z-10 flex items-center gap-1.5 rounded-lg border border-yellow-300 bg-white px-3 py-2 shadow-lg"
              style={{ left: `${popX}%`, top: `${popY}%`, transform: "translate(-50%, -50%)" }}
            >
              <span className="text-[11px] font-semibold text-foreground/60 whitespace-nowrap">{seg.label}</span>
              <input
                type="text"
                inputMode="decimal"
                autoFocus
                value={editValue}
                onChange={(e) => onEditChange(e.target.value)}
                onBlur={onEditApply}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onEditApply();
                  if (e.key === "Escape") onEditApply();
                }}
                className="w-16 rounded border border-input bg-background px-2 py-1 text-center text-sm font-bold text-foreground focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              <span className="text-[11px] text-muted-foreground">m</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Step 3 — Wall height
   ═══════════════════════════════════════════════════ */

const StepHeight = ({
  wallHeight,
  onChange,
}: {
  wallHeight: number;
  onChange: (h: number) => void;
}) => {
  const [raw, setRaw] = useState(String(wallHeight));

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    onChange(v);
    setRaw(String(v));
  };

  const handleInputBlur = () => {
    const v = parseFloat(raw);
    if (!isNaN(v) && v >= 2 && v <= 5) {
      onChange(Math.round(v * 10) / 10);
    } else {
      setRaw(String(wallHeight));
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Wall Height</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={2}
            max={5}
            step={0.1}
            value={wallHeight}
            onChange={handleSlider}
            className="flex-1 h-2 appearance-none rounded-full bg-foreground/15 accent-foreground cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background"
          />
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="decimal"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={(e) => e.key === "Enter" && handleInputBlur()}
              className="w-14 rounded-md border border-input bg-background px-2 py-1.5 text-center text-sm font-bold text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <span className="text-sm text-muted-foreground">m</span>
          </div>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground">2.0m</span>
          <span className="text-[10px] text-muted-foreground">5.0m</span>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-accent/30 p-4">
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          Standard residential ceiling height is <strong>2.7 – 3.0m</strong>.
          Adjust the slider or type a value between 2.0m and 5.0m.
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Step 4 — Colors
   ═══════════════════════════════════════════════════ */

const StepColors = ({
  wallColor,
  floorColor,
  ceilingColor,
  onWallColor,
  onFloorColor,
  onCeilingColor,
}: {
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  onWallColor: (c: string) => void;
  onFloorColor: (c: string) => void;
  onCeilingColor: (c: string) => void;
}) => (
  <div className="space-y-5">
    <ColorPalette label="Wall color" colors={WALL_COLORS} selected={wallColor} onSelect={onWallColor} />
    <div className="h-px bg-border" />
    <ColorPalette label="Floor color" colors={FLOOR_COLORS} selected={floorColor} onSelect={onFloorColor} />
    <div className="h-px bg-border" />
    <ColorPalette label="Ceiling color" colors={CEILING_COLORS} selected={ceilingColor} onSelect={onCeilingColor} />
  </div>
);

const ColorPalette = ({
  label,
  colors,
  selected,
  onSelect,
}: {
  label: string;
  colors: string[];
  selected: string;
  onSelect: (c: string) => void;
}) => (
  <div>
    <span className="mb-2 block text-sm font-semibold text-foreground">{label}</span>
    <div className="flex flex-wrap gap-2">
      {colors.map((hex) => {
        const active = selected.toLowerCase() === hex.toLowerCase();
        return (
          <button
            key={hex}
            onClick={() => onSelect(hex)}
            className={`h-8 w-8 shrink-0 rounded-md border-2 transition-all ${
              active
                ? "border-foreground ring-2 ring-foreground/20 scale-110"
                : "border-border hover:border-foreground/40 hover:scale-105"
            }`}
            style={{ backgroundColor: hex }}
            aria-label={`${label}: ${hex}`}
            aria-pressed={active}
          >
            {active && (
              <Check size={14} className="mx-auto text-foreground/60 drop-shadow-[0_0_2px_rgba(255,255,255,0.9)]" />
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default RoomSetupWizard;
