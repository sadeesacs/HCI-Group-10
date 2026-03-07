import { useState } from "react";
import { Layers, RectangleHorizontal, Square, LayoutPanelLeft, Maximize2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ROOM_SHAPES = [
  { id: "rectangle", label: "Rectangle", icon: RectangleHorizontal },
  { id: "square", label: "Square", icon: Square },
  { id: "l-shape", label: "L-Shape", icon: LayoutPanelLeft },
  { id: "studio", label: "Studio", icon: Maximize2 },
] as const;

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

const RoomSetupPanel = () => {
  const [projectName, setProjectName] = useState("");
  const [selectedShape, setSelectedShape] = useState("rectangle");
  const [width, setWidth] = useState("4.5");
  const [length, setLength] = useState("6.0");
  const [colors, setColors] = useState({ wall: "#F0F0F0", floor: "#B8956A", ceiling: "#FFFFFF" });

  const handleApply = () => {
    toast.success("Room settings applied", {
      description: `${projectName || "Untitled"} — ${ROOM_SHAPES.find((s) => s.id === selectedShape)?.label} (${width}m × ${length}m)`,
    });
  };

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
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. My Living Room"
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </FieldGroup>

        {/* Room Shape */}
        <FieldGroup label="Shape">
          <div className="grid grid-cols-2 gap-1.5">
            {ROOM_SHAPES.map((shape) => {
              const active = selectedShape === shape.id;
              return (
                <button
                  key={shape.id}
                  onClick={() => setSelectedShape(shape.id)}
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

        {/* Dimensions */}
        <FieldGroup label="Dimensions">
          <div className="grid grid-cols-2 gap-1.5">
            <DimensionInput label="W" value={width} onChange={setWidth} />
            <DimensionInput label="L" value={length} onChange={setLength} />
          </div>
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
                          onClick={() => setColors((prev) => ({ ...prev, [key]: hex }))}
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

        <Button
          onClick={handleApply}
          className="w-full bg-[hsl(28,35%,32%)] text-white hover:bg-[hsl(28,35%,26%)] h-7 text-[11px] font-medium rounded-md"
        >
          Apply Settings
        </Button>
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

const DimensionInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="relative">
    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">{label}</span>
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-7 text-right text-[12px] font-medium text-foreground transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
    />
    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">m</span>
  </div>
);

export default RoomSetupPanel;
