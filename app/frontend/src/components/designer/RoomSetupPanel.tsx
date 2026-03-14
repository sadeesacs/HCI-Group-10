import { useState, useEffect, useCallback } from "react";
import {
  Layers, RectangleHorizontal, Square, LayoutPanelLeft, Maximize2, Check,
  LayoutDashboard, PanelTop,
} from "lucide-react";
import type { RoomShape, RoomConfig, RoomDimensions } from "@/types/designer";
import {
  getDefaultDimensions,
  normalizeRoomDimensions,
  validateRoomDimensions,
  DIMENSION_FIELDS,
} from "@/lib/room-geometry";

const ROOM_SHAPES: { id: RoomShape; label: string; icon: typeof Square }[] = [
  { id: "rectangle", label: "Rectangle", icon: RectangleHorizontal },
  { id: "square", label: "Square", icon: Square },
  { id: "l-shape", label: "L-Shape", icon: LayoutPanelLeft },
  { id: "u-shape", label: "U-Shape", icon: LayoutDashboard },
  { id: "t-shape", label: "T-Shape", icon: PanelTop },
  { id: "studio", label: "Studio", icon: Maximize2 },
];

const COLOR_PRESETS: Record<string, { label: string; swatches: string[] }> = {
  wall: {
    label: "Wall",
    swatches: ["#FFFFFF", "#F8F8F8", "#F0F0F0", "#E8E8E8", "#FAF7F2", "#F5F0E8", "#EDE6D8", "#D4C9B5"],
  },
  floor: {
    label: "Floor",
    swatches: ["#D2B48C", "#C4A57B", "#B8956A", "#A6845C", "#8B7355", "#7A6548", "#6B5740", "#5C4A35"],
  },
  ceiling: {
    label: "Ceiling",
    swatches: ["#FFFFFF", "#FDFCFA", "#FAF8F5", "#F5F2ED", "#F0ECE4", "#EBE6DC", "#E5DFD3", "#DED7C9"],
  },
};

interface RoomSetupPanelProps {
  roomConfig: RoomConfig;
  designName: string;
  onApply: (config: RoomConfig) => void;
}

const RoomSetupPanel = ({ roomConfig, designName, onApply }: RoomSetupPanelProps) => {
  // Draft state — separate from applied state
  const [selectedShape, setSelectedShape] = useState<RoomShape>(roomConfig.shape);
  const [dimensions, setDimensions] = useState<RoomDimensions>(roomConfig.dimensions);
  const [colors, setColors] = useState({
    wall: roomConfig.wallColor,
    floor: roomConfig.floorColor,
    ceiling: roomConfig.ceilingColor,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleShapeChange = useCallback((shape: RoomShape) => {
    const newDims = getDefaultDimensions(shape);
    setSelectedShape(shape);
    setDimensions(newDims);
    setErrors({});
    onApply({
      shape,
      dimensions: newDims,
      wallHeight: roomConfig.wallHeight ?? 2.8,
      wallColor: colors.wall,
      floorColor: colors.floor,
      ceilingColor: colors.ceiling,
      doors: [],
      windows: [],
    });
  }, [colors, onApply, roomConfig.wallHeight]);

  const handleDimChange = useCallback((key: string, value: number) => {
    const updated = { ...dimensions, dims: { ...dimensions.dims, [key]: value } } as RoomDimensions;
    const normalized = normalizeRoomDimensions(updated);
    setDimensions(normalized);
    const validation = validateRoomDimensions(normalized);
    if (validation.valid) {
      setErrors({});
      onApply({
        shape: selectedShape,
        dimensions: normalized,
        wallHeight: roomConfig.wallHeight ?? 2.8,
        wallColor: colors.wall,
        floorColor: colors.floor,
        ceilingColor: colors.ceiling,
        doors: [],
        windows: [],
      });
    } else {
      setErrors(validation.errors);
    }
  }, [dimensions, selectedShape, colors, onApply, roomConfig.wallHeight]);

  const handleColorChange = useCallback((key: string, hex: string) => {
    const newColors = { ...colors, [key]: hex };
    setColors(newColors);
    onApply({
      shape: selectedShape,
      dimensions: normalizeRoomDimensions(dimensions),
      wallHeight: roomConfig.wallHeight ?? 2.8,
      wallColor: newColors.wall,
      floorColor: newColors.floor,
      ceilingColor: newColors.ceiling,
      doors: [],
      windows: [],
    });
  }, [selectedShape, dimensions, colors, onApply, roomConfig.wallHeight]);

  // Get editable fields for current shape
  const fields = DIMENSION_FIELDS[selectedShape];
  const editableFields = fields.filter((f) => !f.derived);
  const derivedFields = fields.filter((f) => f.derived);
  const dimValues = dimensions.dims as unknown as Record<string, number>;

  return (
    <div className="rounded-lg border border-border bg-background">
      {/* Header */}
      <button className="flex w-full items-center gap-2 px-3 py-2.5 text-left">
        <Layers size={14} className="text-muted-foreground" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/70">Room Setup</span>
      </button>

      <div className="border-t border-border px-3 pb-3 pt-2.5 space-y-3.5">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Configure your room before adding furniture.
        </p>

        {/* Project Name */}
        <FieldGroup label="Project Name">
          <input
            type="text"
            value={designName}
            readOnly
            placeholder="e.g. My Living Room"
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </FieldGroup>

        {/* Room Shape — 3×2 grid */}
        <FieldGroup label="Shape">
          <div className="grid grid-cols-3 gap-1.5">
            {ROOM_SHAPES.map((shape) => {
              const active = selectedShape === shape.id;
              return (
                <button
                  key={shape.id}
                  onClick={() => handleShapeChange(shape.id)}
                  className={`group relative flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-center transition-all ${
                    active
                      ? "border-[hsl(28,35%,32%)] bg-[hsl(28,35%,32%)/6]"
                      : "border-border bg-background hover:border-foreground/20 hover:bg-accent"
                  }`}
                  aria-pressed={active}
                >
                  {active && (
                    <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[hsl(28,35%,32%)]">
                      <Check size={8} className="text-white" strokeWidth={3} />
                    </span>
                  )}
                  <shape.icon size={16} strokeWidth={1.5} className={active ? "text-[hsl(28,35%,32%)]" : "text-muted-foreground"} />
                  <span className={`text-[10px] font-medium ${active ? "text-[hsl(28,35%,32%)]" : "text-muted-foreground"}`}>{shape.label}</span>
                </button>
              );
            })}
          </div>
        </FieldGroup>

        {/* Dynamic Dimensions */}
        <FieldGroup label="Dimensions">
          <div className="grid grid-cols-2 gap-1.5">
            {editableFields.map((field) => (
              <DimensionInput
                key={field.key}
                label={field.shortLabel}
                value={dimValues[field.key] ?? 0}
                onChange={(v) => handleDimChange(field.key, v)}
                error={errors[field.key]}
                tooltip={field.label}
              />
            ))}
          </div>
          {derivedFields.length > 0 && (
            <div className="mt-1.5 space-y-0.5">
              {derivedFields.map((field) => (
                <div key={field.key} className="flex items-center justify-between rounded-md bg-accent/40 px-2 py-0.5">
                  <span className="text-[9px] text-muted-foreground">{field.label}</span>
                  <span className="text-[10px] font-medium text-foreground/70">
                    {(dimValues[field.key] ?? 0).toFixed(1)}m
                  </span>
                </div>
              ))}
            </div>
          )}
        </FieldGroup>

        {/* Colors */}
        <FieldGroup label="Colors">
          <div className="space-y-2">
            {(Object.keys(COLOR_PRESETS) as Array<keyof typeof COLOR_PRESETS>).map((key) => {
              const preset = COLOR_PRESETS[key];
              const selected = colors[key as keyof typeof colors];
              return (
                <div key={key}>
                  <span className="mb-1 block text-[10px] font-medium text-muted-foreground">{preset.label}</span>
                  <div className="flex flex-wrap gap-1">
                    {preset.swatches.map((hex) => {
                      const isActive = selected === hex;
                      return (
                        <button
                          key={hex}
                          onClick={() => handleColorChange(key, hex)}
                          className={`h-5 w-5 shrink-0 rounded border transition-all ${
                            isActive ? "border-[hsl(28,35%,32%)] ring-1 ring-[hsl(28,35%,32%)/30] scale-110" : "border-border hover:border-foreground/30 hover:scale-105"
                          }`}
                          style={{ backgroundColor: hex }}
                          aria-label={`${preset.label}: ${hex}`}
                          aria-pressed={isActive}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </FieldGroup>


      </div>
    </div>
  );
};

const FieldGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="mb-1 block text-[11px] font-medium text-foreground/70">{label}</label>
    {children}
  </div>
);

const DimensionInput = ({
  label, value, onChange, error, tooltip,
}: {
  label: string; value: number; onChange: (v: number) => void; error?: string; tooltip?: string;
}) => {
  const [raw, setRaw] = useState(String(value));

  useEffect(() => {
    setRaw(String(value));
  }, [value]);

  const handleBlur = () => {
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed > 0) {
      onChange(Math.round(parsed * 10) / 10);
    } else {
      setRaw(String(value));
    }
  };

  return (
    <div title={tooltip}>
      <div className={`relative ${error ? "ring-1 ring-destructive rounded-md" : ""}`}>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">{label}</span>
        <input
          type="text"
          inputMode="decimal"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-7 text-right text-[12px] font-medium text-foreground transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">m</span>
      </div>
      {error && <p className="mt-0.5 text-[9px] text-destructive">{error}</p>}
    </div>
  );
};

export default RoomSetupPanel;
