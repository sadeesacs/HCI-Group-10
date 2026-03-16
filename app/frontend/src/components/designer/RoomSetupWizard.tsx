import { useState, useCallback, useMemo } from "react";
import {
  RectangleHorizontal, Square, LayoutPanelLeft, LayoutDashboard,
  PanelTop, Maximize2, Check, DoorOpen, AppWindow, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomShape, RoomConfig, RoomDimensions, DoorPlacement, WindowPlacement } from "@/types/designer";
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
  { title: "Add doors & windows", subtitle: "Select a door or window style, then click a wall in the floor plan to place it." },
  { title: "Choose your room style", subtitle: "Pick colors for walls, floor, and ceiling." },
];

/* ── Door style catalog ── */
const DOOR_STYLES: { id: string; label: string; description: string; widthM: number }[] = [
  { id: "single",  label: "Single Door",  description: "Standard 900mm swing door",  widthM: 0.9  },
  { id: "double",  label: "Double Door",  description: "French / double swing door",  widthM: 1.5  },
  { id: "sliding", label: "Sliding Door", description: "Space-saving sliding panel",   widthM: 1.5  },
  { id: "bifold",  label: "Bi-fold Door", description: "Compact folding door panels",  widthM: 1.2  },
];

/* ── Window style catalog ── */
const WINDOW_STYLES: { id: string; label: string; description: string; widthM: number; heightM: number; sillHeightM: number }[] = [
  { id: "standard", label: "Standard Window", description: "Fixed or casement window",  widthM: 1.0, heightM: 1.2, sillHeightM: 0.9 },
  { id: "wide",     label: "Wide Window",     description: "Large picture window",       widthM: 1.5, heightM: 1.2, sillHeightM: 0.9 },
  { id: "bay",      label: "Bay Window",      description: "Projecting bay window",      widthM: 2.0, heightM: 1.2, sillHeightM: 0.9 },
  { id: "narrow",   label: "Narrow Window",   description: "Slim / tall window",         widthM: 0.6, heightM: 1.4, sillHeightM: 0.9 },
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

/* CSS grid-dot background pattern for right panel */
const GRID_BG_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, #c5c0b8 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

/* ═══════════════════════════════════════════════════
   Step Progress Indicator
   ═══════════════════════════════════════════════════ */

const StepProgress = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center justify-center gap-2 mb-2">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
            i < current
              ? "bg-[hsl(28,35%,32%)] text-white"
              : i === current
              ? "bg-[hsl(28,35%,32%)] text-white ring-4 ring-[hsl(28,35%,32%,0.15)]"
              : "bg-[hsl(30,15%,88%)] text-[hsl(30,10%,55%)]"
          }`}
        >
          {i < current ? <Check size={14} /> : i + 1}
        </div>
        {i < total - 1 && (
          <div
            className={`h-[2px] w-8 rounded-full transition-colors ${
              i < current ? "bg-[hsl(28,35%,32%)]" : "bg-[hsl(30,15%,85%)]"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

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
  const [wallEditUnit, setWallEditUnit] = useState<"m" | "cm">("m");

  // Step 3 — doors & windows
  const [doors, setDoors] = useState<DoorPlacement[]>(initialConfig.doors ?? []);
  const [windows, setWindows] = useState<WindowPlacement[]>(initialConfig.windows ?? []);
  const [dwTab, setDwTab] = useState<"doors" | "windows">("doors");
  const [selectedDoorStyleId, setSelectedDoorStyleId] = useState<string | null>(null);
  const [selectedWindowStyleId, setSelectedWindowStyleId] = useState<string | null>(null);

  // Build current draft config
  const draftConfig = useMemo(
    (): RoomConfig => ({
      shape,
      dimensions: normalizeRoomDimensions(dimensions),
      wallHeight,
      wallColor,
      floorColor,
      ceilingColor,
      doors,
      windows,
    }),
    [shape, dimensions, wallHeight, wallColor, floorColor, ceilingColor, doors, windows],
  );

  const handleShapeSelect = useCallback((s: RoomShape) => {
    setShape(s);
    setDimensions(getDefaultDimensions(s));
    setSelectedWallIdx(null);
    // Reset door/window placements when shape changes (wall indices would be invalid)
    setDoors([]);
    setWindows([]);
  }, []);

  const handleNext = useCallback(() => {
    if (step < 4) {
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
    <div className="flex h-screen bg-[hsl(40,25%,98%)]">
      {/* ── Left Panel ── */}
      <div className="flex w-full flex-col border-r border-[hsl(30,15%,88%)] md:w-[42%] lg:w-[36%]">
        {/* Step header */}
        <div className="flex-1 overflow-y-auto px-7 pt-10 pb-4 lg:px-10 lg:pt-12">
          <StepProgress current={step} total={STEPS.length} />

          <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[hsl(30,10%,55%)]">
            Step {step + 1} of {STEPS.length}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-[hsl(28,20%,15%)] lg:text-[1.7rem] leading-snug">
            {STEPS[step].title}
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[hsl(30,10%,50%)]">
            {STEPS[step].subtitle}
          </p>

          <div className="mt-8">
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
              <StepDoorsWindows
                config={draftConfig}
                doors={doors}
                windows={windows}
                onDoorsChange={setDoors}
                onWindowsChange={setWindows}
                activeTab={dwTab}
                onTabChange={setDwTab}
                selectedDoorStyleId={selectedDoorStyleId}
                setSelectedDoorStyleId={setSelectedDoorStyleId}
                selectedWindowStyleId={selectedWindowStyleId}
                setSelectedWindowStyleId={setSelectedWindowStyleId}
              />
            )}
            {step === 4 && (
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
        <div className="flex gap-3 border-t border-[hsl(30,15%,88%)] bg-[hsl(40,20%,97%)] p-5 lg:p-6">
          {step > 0 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              className="h-12 flex-1 rounded-full border-[hsl(30,15%,80%)] bg-white text-sm font-semibold text-[hsl(28,20%,25%)] hover:bg-[hsl(38,20%,95%)] hover:border-[hsl(28,35%,55%)]"
            >
              Go back
            </Button>
          ) : onCancel ? (
            <Button
              variant="outline"
              onClick={onCancel}
              className="h-12 flex-1 rounded-full border-[hsl(30,15%,80%)] bg-white text-sm font-semibold text-[hsl(28,20%,25%)] hover:bg-[hsl(38,20%,95%)] hover:border-[hsl(28,35%,55%)]"
            >
              Cancel
            </Button>
          ) : null}
          <Button
            onClick={handleNext}
            className="h-12 flex-1 rounded-full bg-[hsl(28,35%,32%)] text-white text-sm font-semibold uppercase tracking-wider hover:bg-[hsl(28,35%,26%)] shadow-md"
          >
            {step === 4 ? "Design this room" : "Next"}
          </Button>
        </div>
      </div>

      {/* ── Right Panel — Preview ── */}
      <div
        className="hidden flex-1 md:flex items-center justify-center bg-[hsl(38,12%,91%)] overflow-hidden"
        style={GRID_BG_STYLE}
      >
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
                const valM = dimValues[wall.dimKey] ?? wall.lengthM;
                setWallEditValue(wallEditUnit === "cm" ? String(Math.round(valM * 100)) : String(valM));
              }
            }}
            editValue={step === 1 ? wallEditValue : ""}
            editUnit={wallEditUnit}
            onEditUnitToggle={() => {
              const newUnit = wallEditUnit === "m" ? "cm" : "m";
              setWallEditUnit(newUnit);
              const parsed = parseFloat(wallEditValue);
              if (!isNaN(parsed) && parsed > 0) {
                setWallEditValue(
                  newUnit === "cm"
                    ? String(Math.round(parsed * 100))
                    : String(Math.round((parsed / 100) * 10) / 10)
                );
              }
            }}
            onEditChange={(val: string) => {
              if (step !== 1) return;
              setWallEditValue(val);
              // live-apply
              if (selectedWallIdx === null) return;
              const segments = getWallSegments(draftConfig);
              const wall = segments[selectedWallIdx];
              if (!wall.dimKey) return;
              const parsed = parseFloat(val);
              if (isNaN(parsed) || parsed <= 0) return;
              const meters = wallEditUnit === "cm" ? parsed / 100 : parsed;
              const rounded = Math.round(meters * 100) / 100;
              if (rounded < 0.1 || rounded > 50) return;
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
        ) : step === 3 ? (
          <DoorsWindowsFloorPlan
            config={draftConfig}
            doors={doors}
            windows={windows}
            activeTab={dwTab}
            selectedDoorStyleId={selectedDoorStyleId}
            selectedWindowStyleId={selectedWindowStyleId}
            onWallClick={(wallIdx) => {
              if (dwTab === "doors" && selectedDoorStyleId) {
                const style = DOOR_STYLES.find((s) => s.id === selectedDoorStyleId);
                if (!style) return;
                const newDoor: DoorPlacement = {
                  id: `door-${Date.now()}`,
                  wallIndex: wallIdx,
                  positionAlongWall: 0.5,
                  widthM: style.widthM,
                  styleId: style.id,
                };
                setDoors((prev) => [...prev.filter((d) => d.wallIndex !== wallIdx), newDoor]);
              } else if (dwTab === "windows" && selectedWindowStyleId) {
                const style = WINDOW_STYLES.find((s) => s.id === selectedWindowStyleId);
                if (!style) return;
                const newWindow: WindowPlacement = {
                  id: `win-${Date.now()}`,
                  wallIndex: wallIdx,
                  positionAlongWall: 0.5,
                  widthM: style.widthM,
                  heightM: style.heightM,
                  sillHeightM: style.sillHeightM,
                  styleId: style.id,
                };
                setWindows((prev) => [...prev.filter((w) => w.wallIndex !== wallIdx), newWindow]);
              }
            }}
          />
        ) : (
          <div className="h-full w-full">
            <Room3DPreview
              roomConfig={draftConfig}
              furniture={[]}
              cameraPreset="front"
              cameraLocked
              showGrid
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
          className={`group relative flex flex-col items-center gap-2.5 rounded-xl border-2 p-4 transition-all duration-200 ${
            active
              ? "border-[hsl(28,35%,32%)] bg-white shadow-[0_2px_12px_hsl(28,30%,30%,0.1)]"
              : "border-[hsl(30,15%,86%)] bg-white/60 hover:border-[hsl(28,30%,60%)] hover:bg-white hover:shadow-sm"
          }`}
          aria-pressed={active}
        >
          {/* Selection handles at corners */}
          {active && (
            <>
              <span className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full border-2 border-[hsl(28,35%,32%)] bg-white" />
              <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full border-2 border-[hsl(28,35%,32%)] bg-white" />
              <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full border-2 border-[hsl(28,35%,32%)] bg-white" />
              <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full border-2 border-[hsl(28,35%,32%)] bg-white" />
            </>
          )}
          <ShapePreview shape={s.id} active={active} />
          <span className={`text-xs font-semibold ${active ? "text-[hsl(28,35%,32%)]" : "text-[hsl(30,10%,50%)]"}`}>
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
        fill={active ? "hsl(30,20%,90%)" : "hsl(0,0%,90%)"}
        stroke={active ? "hsl(28,35%,32%)" : "hsl(0,0%,70%)"}
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
    <div className="space-y-5">
      <p className="text-[12px] text-[hsl(30,10%,50%)] leading-relaxed">
        Click on a wall in the floor plan to select it and change its dimension.
        Editable walls will highlight when selected.
      </p>

      {/* Mini shape diagram */}
      <div className="flex justify-center">
        <MiniShapeDiagram config={config} selectedWallIdx={selectedWallIdx} />
      </div>

      {selectedWall ? (
        <div className="rounded-xl border border-[hsl(28,40%,75%)] bg-[hsl(38,40%,96%)] p-4 text-center">
          <p className="text-xs font-semibold text-[hsl(28,35%,32%)]">{selectedWall.label}</p>
          <p className="text-xl font-bold text-[hsl(28,30%,22%)] mt-1">{selectedWall.lengthM.toFixed(1)} m</p>
          {selectedWall.dimKey ? (
            <p className="text-[11px] text-[hsl(28,25%,45%)] mt-1">Edit the value in the floor plan →</p>
          ) : (
            <p className="text-[11px] text-[hsl(28,25%,45%)] mt-1">This wall's length is derived from other dimensions</p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-[hsl(30,15%,86%)] bg-white/60 p-4 text-center">
          <p className="text-xs text-[hsl(30,10%,55%)]">Select a wall to edit its dimension</p>
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
        fill="hsl(38,20%,93%)"
        stroke="hsl(30,15%,75%)"
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
            stroke={selected ? "hsl(28,35%,42%)" : "hsl(28,20%,30%)"}
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
  editUnit,
  onEditUnitToggle,
  onEditChange,
}: {
  config: RoomConfig;
  selectedWallIdx: number | null;
  onWallSelect: (idx: number) => void;
  editValue: string;
  editUnit: "m" | "cm";
  onEditUnitToggle: () => void;
  onEditChange: (v: string) => void;
}) => {
  const segments = getWallSegments(config);
  const poly = getRoomPolygon(config);
  const bbox = getRoomBoundingBox(config);
  const n = poly.length / 2;

  const viewW = 900;
  const viewH = 700;
  const pad = 100;
  const scale = Math.min((viewW - pad * 2) / bbox.width, (viewH - pad * 2) / bbox.height);
  const roomW = bbox.width * scale;
  const roomH = bbox.height * scale;
  const ox = (viewW - roomW) / 2;
  const oy = (viewH - roomH) / 2;

  const polyPoints = Array.from({ length: n })
    .map((_, i) => `${poly[i * 2] * scale + ox},${poly[i * 2 + 1] * scale + oy}`)
    .join(" ");

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6 lg:p-10">
      <div className="relative w-full h-full max-h-full">
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          className="block w-full h-full"
          preserveAspectRatio="xMidYMid meet"
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
                  stroke={selected ? "hsl(28,35%,42%)" : "#1a1a1a"}
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
            const labelDist = 32;
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
                fontSize={14}
                fontWeight={600}
                fontFamily="Inter, sans-serif"
                fill={selected ? "hsl(28,35%,35%)" : "#666"}
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
          const popX = ((x1 + x2) / 2 + nx * 60) / viewW * 100;
          const popY = ((y1 + y2) / 2 + ny * 60) / viewH * 100;

          return (
            <div
              className="absolute z-10 flex items-center gap-2 rounded-xl border border-[hsl(28,40%,75%)] bg-white px-4 py-2.5 shadow-lg"
              style={{ left: `${popX}%`, top: `${popY}%`, transform: "translate(-50%, -50%)" }}
            >
              <span className="text-[11px] font-semibold text-[hsl(30,10%,50%)] whitespace-nowrap">{seg.label}</span>
              <input
                type="text"
                inputMode="decimal"
                autoFocus
                value={editValue}
                onChange={(e) => onEditChange(e.target.value)}
                className="w-16 rounded-lg border border-[hsl(30,15%,82%)] bg-[hsl(40,25%,98%)] px-2 py-1 text-center text-sm font-bold text-[hsl(28,20%,20%)] focus:border-[hsl(28,35%,42%)] focus:outline-none focus:ring-1 focus:ring-[hsl(28,35%,42%)]"
              />
              <button
                type="button"
                onClick={onEditUnitToggle}
                className="text-[11px] font-semibold text-[hsl(28,35%,42%)] hover:text-[hsl(28,35%,28%)] underline decoration-dotted cursor-pointer px-0.5"
              >
                {editUnit}
              </button>
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
  const [unit, setUnit] = useState<"m" | "cm">("m");
  const [raw, setRaw] = useState(String(wallHeight));

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    onChange(v);
    setRaw(unit === "cm" ? String(Math.round(v * 100)) : String(v));
  };

  const handleInputChange = (val: string) => {
    setRaw(val);
    const parsed = parseFloat(val);
    if (isNaN(parsed) || parsed <= 0) return;
    const meters = unit === "cm" ? parsed / 100 : parsed;
    if (meters >= 2 && meters <= 5) {
      onChange(Math.round(meters * 100) / 100);
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === "m" ? "cm" : "m";
    setUnit(newUnit);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed > 0) {
      setRaw(
        newUnit === "cm"
          ? String(Math.round(parsed * 100))
          : String(Math.round((parsed / 100) * 10) / 10)
      );
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div>
        <label className="block text-sm font-semibold text-[hsl(28,20%,20%)] mb-3">Wall Height</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={2}
            max={5}
            step={0.1}
            value={wallHeight}
            onChange={handleSlider}
            className="flex-1 h-2 appearance-none rounded-full bg-[hsl(30,15%,85%)] cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(28,35%,32%)] [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
          />
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="decimal"
              value={raw}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-16 rounded-lg border border-[hsl(30,15%,82%)] bg-white px-2 py-1.5 text-center text-sm font-bold text-[hsl(28,20%,20%)] focus:border-[hsl(28,35%,42%)] focus:outline-none focus:ring-1 focus:ring-[hsl(28,35%,42%)]"
            />
            <button
              type="button"
              onClick={toggleUnit}
              className="text-sm font-semibold text-[hsl(28,35%,42%)] hover:text-[hsl(28,35%,28%)] underline decoration-dotted cursor-pointer"
            >
              {unit}
            </button>
          </div>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-[hsl(30,10%,60%)]">{unit === "cm" ? "200cm" : "2.0m"}</span>
          <span className="text-[10px] text-[hsl(30,10%,60%)]">{unit === "cm" ? "500cm" : "5.0m"}</span>
        </div>
      </div>

      <div className="rounded-xl border border-[hsl(30,15%,86%)] bg-white/60 p-4">
        <p className="text-[12px] text-[hsl(30,10%,50%)] leading-relaxed">
          Standard residential ceiling height is <strong className="text-[hsl(28,20%,25%)]">2.7 – 3.0m</strong>.
          Adjust the slider or type a value between 2.0m and 5.0m. Click the unit to toggle between m and cm.
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Step 4 — Doors & Windows
   ═══════════════════════════════════════════════════ */

interface StepDoorsWindowsProps {
  config: RoomConfig;
  doors: DoorPlacement[];
  windows: WindowPlacement[];
  onDoorsChange: React.Dispatch<React.SetStateAction<DoorPlacement[]>>;
  onWindowsChange: React.Dispatch<React.SetStateAction<WindowPlacement[]>>;
  activeTab: "doors" | "windows";
  onTabChange: (tab: "doors" | "windows") => void;
  selectedDoorStyleId: string | null;
  setSelectedDoorStyleId: (id: string | null) => void;
  selectedWindowStyleId: string | null;
  setSelectedWindowStyleId: (id: string | null) => void;
}

const StepDoorsWindows = ({
  doors, windows, onDoorsChange, onWindowsChange,
  activeTab, onTabChange,
  selectedDoorStyleId, setSelectedDoorStyleId,
  selectedWindowStyleId, setSelectedWindowStyleId,
}: StepDoorsWindowsProps) => {
  const isAnythingSelected =
    (activeTab === "doors" && selectedDoorStyleId) ||
    (activeTab === "windows" && selectedWindowStyleId);

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex rounded-xl border border-[hsl(30,15%,86%)] bg-[hsl(38,15%,95%)] p-1">
        {(["doors", "windows"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-white shadow-sm text-[hsl(28,35%,32%)]"
                : "text-[hsl(30,10%,55%)] hover:text-[hsl(28,20%,30%)]"
            }`}
          >
            {tab === "doors" ? <DoorOpen size={14} /> : <AppWindow size={14} />}
            {tab === "doors" ? "Doors" : "Windows"}
          </button>
        ))}
      </div>

      {/* Instruction */}
      <p className="text-[12px] leading-relaxed text-[hsl(30,10%,50%)]">
        {isAnythingSelected
          ? "Click a wall in the floor plan on the right to place."
          : "Select a style below, then click a wall in the preview to place it."}
      </p>

      {/* Style cards */}
      <div className="space-y-2">
        {activeTab === "doors"
          ? DOOR_STYLES.map((style) => {
              const active = selectedDoorStyleId === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedDoorStyleId(active ? null : style.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                    active
                      ? "border-[hsl(28,35%,32%)] bg-white shadow-md"
                      : "border-[hsl(30,15%,86%)] bg-white/60 hover:border-[hsl(28,30%,60%)] hover:bg-white"
                  }`}
                >
                  {/* Door icon */}
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${active ? "bg-[hsl(28,35%,32%)]" : "bg-[hsl(38,15%,90%)]"}`}>
                    <DoorOpen size={20} className={active ? "text-white" : "text-[hsl(28,20%,45%)]"} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${active ? "text-[hsl(28,35%,22%)]" : "text-[hsl(28,20%,25%)]"}`}>{style.label}</p>
                    <p className="text-[11px] text-[hsl(30,10%,55%)]">{style.description}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-[hsl(30,10%,55%)]">{style.widthM * 100} cm</span>
                  {active && <Check size={15} className="shrink-0 text-[hsl(28,35%,32%)]" />}
                </button>
              );
            })
          : WINDOW_STYLES.map((style) => {
              const active = selectedWindowStyleId === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedWindowStyleId(active ? null : style.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                    active
                      ? "border-[hsl(28,35%,32%)] bg-white shadow-md"
                      : "border-[hsl(30,15%,86%)] bg-white/60 hover:border-[hsl(28,30%,60%)] hover:bg-white"
                  }`}
                >
                  {/* Window icon */}
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${active ? "bg-[hsl(28,35%,32%)]" : "bg-[hsl(38,15%,90%)]"}`}>
                    <AppWindow size={20} className={active ? "text-white" : "text-[hsl(28,20%,45%)]"} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${active ? "text-[hsl(28,35%,22%)]" : "text-[hsl(28,20%,25%)]"}`}>{style.label}</p>
                    <p className="text-[11px] text-[hsl(30,10%,55%)]">{style.description}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-[hsl(30,10%,55%)]">{style.widthM * 100} cm</span>
                  {active && <Check size={15} className="shrink-0 text-[hsl(28,35%,32%)]" />}
                </button>
              );
            })}
      </div>

      {/* Placed items list */}
      {(doors.length > 0 || windows.length > 0) && (
        <div className="rounded-xl border border-[hsl(30,15%,86%)] bg-white/60 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(28,20%,35%)]">Placed</p>
          {doors.map((d) => (
            <div key={d.id} className="flex items-center gap-2 rounded-lg bg-[hsl(28,30%,92%)] px-3 py-2">
              <DoorOpen size={13} className="shrink-0 text-[hsl(28,35%,38%)]" />
              <span className="flex-1 text-xs font-medium text-[hsl(28,20%,25%)]">
                {DOOR_STYLES.find((s) => s.id === d.styleId)?.label ?? "Door"} — Wall {d.wallIndex + 1}
              </span>
              <button
                onClick={() => onDoorsChange((prev) => prev.filter((x) => x.id !== d.id))}
                className="rounded p-0.5 hover:bg-[hsl(28,30%,80%)]"
                aria-label="Remove door"
              >
                <X size={12} className="text-[hsl(28,20%,35%)]" />
              </button>
            </div>
          ))}
          {windows.map((w) => (
            <div key={w.id} className="flex items-center gap-2 rounded-lg bg-[hsl(200,25%,92%)] px-3 py-2">
              <AppWindow size={13} className="shrink-0 text-[hsl(200,50%,40%)]" />
              <span className="flex-1 text-xs font-medium text-[hsl(28,20%,25%)]">
                {WINDOW_STYLES.find((s) => s.id === w.styleId)?.label ?? "Window"} — Wall {w.wallIndex + 1}
              </span>
              <button
                onClick={() => onWindowsChange((prev) => prev.filter((x) => x.id !== w.id))}
                className="rounded p-0.5 hover:bg-[hsl(200,25%,80%)]"
                aria-label="Remove window"
              >
                <X size={12} className="text-[hsl(28,20%,35%)]" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-[hsl(30,15%,86%)] bg-white/60 p-3">
        <p className="text-[11px] text-[hsl(30,10%,50%)] leading-relaxed">
          This step is optional — you can skip it and continue without adding doors or windows.
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Doors & Windows floor plan (right panel, step 4)
   ═══════════════════════════════════════════════════ */

const DoorsWindowsFloorPlan = ({
  config, doors, windows, activeTab,
  selectedDoorStyleId, selectedWindowStyleId,
  onWallClick,
}: {
  config: RoomConfig;
  doors: DoorPlacement[];
  windows: WindowPlacement[];
  activeTab: "doors" | "windows";
  selectedDoorStyleId: string | null;
  selectedWindowStyleId: string | null;
  onWallClick: (wallIdx: number) => void;
}) => {
  const [hoveredWall, setHoveredWall] = useState<number | null>(null);

  const poly = getRoomPolygon(config);
  const bbox = getRoomBoundingBox(config);
  const n = poly.length / 2;

  const viewW = 900;
  const viewH = 700;
  const pad = 110;
  const scale = Math.min((viewW - pad * 2) / bbox.width, (viewH - pad * 2) / bbox.height);
  const roomW = bbox.width * scale;
  const roomH = bbox.height * scale;
  const ox = (viewW - roomW) / 2;
  const oy = (viewH - roomH) / 2;

  const pts = Array.from({ length: n }).map((_, i) => ({
    x: poly[i * 2] * scale + ox,
    y: poly[i * 2 + 1] * scale + oy,
  }));

  const isAnythingSelected =
    (activeTab === "doors" && !!selectedDoorStyleId) ||
    (activeTab === "windows" && !!selectedWindowStyleId);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {isAnythingSelected && (
        <div className="absolute top-5 left-0 right-0 z-10 text-center pointer-events-none">
          <span className="rounded-full bg-[hsl(28,35%,32%)]/90 px-4 py-1.5 text-xs font-semibold text-white shadow">
            Click a wall to place
          </span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="max-h-full max-w-full"
        style={{ cursor: isAnythingSelected ? "crosshair" : "default" }}
      >
        {/* Room fill */}
        <polygon
          points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="hsl(38,20%,93%)"
          stroke="none"
        />

        {/* Rendered wall segments with door/window cutouts */}
        {Array.from({ length: n }).map((_, i) => {
          const ni = (i + 1) % n;
          const x1 = pts[i].x; const y1 = pts[i].y;
          const x2 = pts[ni].x; const y2 = pts[ni].y;
          const wallLenPx = Math.hypot(x2 - x1, y2 - y1);
          if (wallLenPx < 1) return null;
          const dx = (x2 - x1) / wallLenPx;
          const dy = (y2 - y1) / wallLenPx;
          // Inward normal (SVG y-down: rotate CW = (dy, -dx))
          const nx = dy; const ny = -dx;

          const door = doors.find((d) => d.wallIndex === i);
          const win = windows.find((w) => w.wallIndex === i);
          const hovered = hoveredWall === i;
          const baseStroke = hovered && isAnythingSelected
            ? "hsl(28,50%,38%)"
            : "hsl(28,20%,30%)";
          const strokeW = hovered ? 8 : 5;

          if (door) {
            const dW = Math.min(door.widthM * scale, wallLenPx * 0.85);
            const centerPx = door.positionAlongWall * wallLenPx;
            const gapStart = Math.max(0, centerPx - dW / 2);
            const gapEnd = Math.min(wallLenPx, centerPx + dW / 2);
            const pivX = x1 + dx * gapStart; const pivY = y1 + dy * gapStart;
            const gapEndX = x1 + dx * gapEnd; const gapEndY = y1 + dy * gapEnd;
            // Door leaf open position (inward from pivot by dW)
            const openX = pivX + nx * dW; const openY = pivY + ny * dW;
            return (
              <g key={i}>
                {gapStart > 2 && <line x1={x1} y1={y1} x2={pivX} y2={pivY} stroke={baseStroke} strokeWidth={strokeW} strokeLinecap="round" />}
                {gapEnd < wallLenPx - 2 && <line x1={gapEndX} y1={gapEndY} x2={x2} y2={y2} stroke={baseStroke} strokeWidth={strokeW} strokeLinecap="round" />}
                {/* Door leaf */}
                <line x1={pivX} y1={pivY} x2={openX} y2={openY} stroke="hsl(28,45%,40%)" strokeWidth={2} />
                {/* Swing arc */}
                <path
                  d={`M ${gapEndX} ${gapEndY} A ${dW} ${dW} 0 0 ${nx > 0 || (nx === 0 && ny > 0) ? 0 : 1} ${openX} ${openY}`}
                  fill="hsl(28,40%,70%,0.12)"
                  stroke="hsl(28,40%,58%)"
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                />
                {/* Hinge pin */}
                <circle cx={pivX} cy={pivY} r={3.5} fill="hsl(28,35%,32%)" />
              </g>
            );
          }

          if (win) {
            const wW = Math.min(win.widthM * scale, wallLenPx * 0.85);
            const centerPx = win.positionAlongWall * wallLenPx;
            const gapStart = Math.max(0, centerPx - wW / 2);
            const gapEnd = Math.min(wallLenPx, centerPx + wW / 2);
            const sX = x1 + dx * gapStart; const sY = y1 + dy * gapStart;
            const eX = x1 + dx * gapEnd; const eY = y1 + dy * gapEnd;
            const off = strokeW / 2; // half wall thickness offset for parallel lines
            return (
              <g key={i}>
                {gapStart > 2 && <line x1={x1} y1={y1} x2={sX} y2={sY} stroke={baseStroke} strokeWidth={strokeW} strokeLinecap="round" />}
                {gapEnd < wallLenPx - 2 && <line x1={eX} y1={eY} x2={x2} y2={y2} stroke={baseStroke} strokeWidth={strokeW} strokeLinecap="round" />}
                {/* Window glazing lines (two parallel lines = cross-section of frame) */}
                <line x1={sX - nx * off} y1={sY - ny * off} x2={eX - nx * off} y2={eY - ny * off} stroke="hsl(200,55%,48%)" strokeWidth={2} />
                <line x1={sX + nx * off} y1={sY + ny * off} x2={eX + nx * off} y2={eY + ny * off} stroke="hsl(200,55%,48%)" strokeWidth={2} />
                {/* Window fill (light blue tint) */}
                <line x1={sX} y1={sY} x2={eX} y2={eY} stroke="hsl(200,60%,70%)" strokeWidth={strokeW} strokeLinecap="butt" opacity={0.35} />
              </g>
            );
          }

          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={baseStroke}
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
          );
        })}

        {/* Invisible wide click zones */}
        {Array.from({ length: n }).map((_, i) => {
          const ni = (i + 1) % n;
          return (
            <line
              key={`hit-${i}`}
              x1={pts[i].x} y1={pts[i].y}
              x2={pts[ni].x} y2={pts[ni].y}
              stroke="transparent"
              strokeWidth={28}
              style={{ cursor: isAnythingSelected ? "pointer" : "default" }}
              onClick={() => { if (isAnythingSelected) onWallClick(i); }}
              onMouseEnter={() => setHoveredWall(i)}
              onMouseLeave={() => setHoveredWall(null)}
            />
          );
        })}

        {/* Wall index labels */}
        {Array.from({ length: n }).map((_, i) => {
          const ni = (i + 1) % n;
          const mx = (pts[i].x + pts[ni].x) / 2;
          const my = (pts[i].y + pts[ni].y) / 2;
          const wallLenPx = Math.hypot(pts[ni].x - pts[i].x, pts[ni].y - pts[i].y);
          if (wallLenPx < 24) return null;
          const dx2 = (pts[ni].x - pts[i].x) / wallLenPx;
          const dy2 = (pts[ni].y - pts[i].y) / wallLenPx;
          // Outward label offset (opposite of inward normal)
          const lx = mx - dy2 * 22;
          const ly = my + dx2 * 22;
          const hasDoor = doors.some((d) => d.wallIndex === i);
          const hasWin = windows.some((w) => w.wallIndex === i);
          return (
            <text
              key={`lbl-${i}`}
              x={lx} y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fontWeight="700"
              fill={hasDoor ? "hsl(28,35%,38%)" : hasWin ? "hsl(200,55%,40%)" : "hsl(30,10%,55%)"}
            >
              W{i + 1}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Step 5 — Colors
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
  <div className="space-y-6">
    <ColorPalette label="Wall Color" colors={WALL_COLORS} selected={wallColor} onSelect={onWallColor} />
    <div className="h-px bg-[hsl(30,15%,88%)]" />
    <ColorPalette label="Floor Color" colors={FLOOR_COLORS} selected={floorColor} onSelect={onFloorColor} />
    <div className="h-px bg-[hsl(30,15%,88%)]" />
    <ColorPalette label="Ceiling Color" colors={CEILING_COLORS} selected={ceilingColor} onSelect={onCeilingColor} />
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
    <span className="mb-3 block text-sm font-semibold text-[hsl(28,20%,20%)]">{label}</span>
    <div className="flex flex-wrap gap-2.5">
      {colors.map((hex) => {
        const active = selected.toLowerCase() === hex.toLowerCase();
        return (
          <button
            key={hex}
            onClick={() => onSelect(hex)}
            className={`h-9 w-9 shrink-0 rounded-full transition-all duration-200 ${
              active
                ? "ring-2 ring-[hsl(28,35%,32%)] ring-offset-2 ring-offset-[hsl(40,25%,98%)] scale-110 shadow-md"
                : "border-2 border-[hsl(30,15%,85%)] hover:border-[hsl(28,30%,55%)] hover:scale-110 hover:shadow-sm"
            }`}
            style={{ backgroundColor: hex }}
            aria-label={`${label}: ${hex}`}
            aria-pressed={active}
          >
            {active && (
              <Check size={14} className="mx-auto text-foreground/70 drop-shadow-[0_0_3px_rgba(255,255,255,1)]" />
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default RoomSetupWizard;
