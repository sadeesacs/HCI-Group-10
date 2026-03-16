import { useState } from "react";
import { Settings, Box, Armchair, Copy, Trash2, RotateCcw, Grid3X3, Magnet, Ruler, Save, DollarSign, MousePointer, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type { PlacedFurniture } from "@/types/designer";
import type { RoomConfig } from "@/types/designer";
import { getRoomBoundingBox } from "@/lib/room-geometry";

const formatLKR = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;

type SelectionState = "none" | "room" | "furniture";

interface Props {
  selectionState: SelectionState;
  selectedItem: PlacedFurniture | null;
  roomConfig: RoomConfig;
  furniture: PlacedFurniture[];
  onDuplicate: () => void;
  onDelete: () => void;
  onReset: () => void;
  onFurnitureUpdate: (id: string, attrs: Partial<PlacedFurniture>) => void;
  onSave: () => void;
  saveStatus: string;
}

const PropertiesPanel = ({
  selectionState, selectedItem, roomConfig, furniture,
  onDuplicate, onDelete, onReset, onFurnitureUpdate, onSave, saveStatus,
}: Props) => {
  const totalPrice = furniture.reduce((sum, f) => sum + (f.price ?? 0), 0);

  return (
    <aside className="hidden w-72 shrink-0 border-l border-border bg-background xl:flex xl:flex-col">
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Settings size={14} className="text-muted-foreground" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/70">Properties</span>
            </div>
            {selectionState === "furniture" && (
              <span className="rounded bg-[hsl(28,35%,32%)/10] px-1.5 py-0.5 text-[9px] font-semibold text-[hsl(28,35%,32%)]">Item</span>
            )}
          </div>

          {selectionState === "furniture" && selectedItem ? (
            <FurnitureProperties item={selectedItem} onDuplicate={onDuplicate} onDelete={onDelete} onReset={onReset} onUpdate={(attrs) => onFurnitureUpdate(selectedItem.id, attrs)} />
          ) : selectionState === "room" ? (
            <RoomProperties roomConfig={roomConfig} />
          ) : (
            <DefaultProperties roomConfig={roomConfig} />
          )}
        </div>
      </ScrollArea>

      {/* Sticky Price Summary */}
      <div className="shrink-0 border-t border-border bg-background p-3">
        <div className="rounded-lg border border-border p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <DollarSign size={12} className="text-muted-foreground" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/60">Summary</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium text-foreground">{furniture.length}</span>
            </div>
            {furniture.length > 0 && (
              <div className="space-y-0.5 max-h-[100px] overflow-y-auto">
                {furniture.map((f) => (
                  <div key={f.id} className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground truncate max-w-[120px]">{f.name}</span>
                    <span className="text-foreground/70 shrink-0">{f.price ? formatLKR(f.price) : "—"}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-border pt-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-medium text-foreground/70">Total</span>
                <span className="text-sm font-semibold text-foreground">{formatLKR(totalPrice)}</span>
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground/60">Preview pricing only</p>
          </div>
          <Button
            size="sm"
            className={`mt-2.5 w-full h-7 gap-1.5 text-[11px] font-medium rounded-md ${
              saveStatus === "unsaved"
                ? "bg-[hsl(28,35%,32%)] text-white hover:bg-[hsl(28,35%,26%)]"
                : "bg-[hsl(28,35%,32%)] text-white hover:bg-[hsl(28,35%,26%)]"
            }`}
            onClick={onSave}
            disabled={saveStatus === "saving"}
          >
            <Save size={12} />
            {saveStatus === "saving" ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </aside>
  );
};

/* ── Sub-sections ── */

const DefaultProperties = ({ roomConfig }: { roomConfig: RoomConfig }) => {
  const bbox = getRoomBoundingBox(roomConfig);
  return (
  <>
    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-accent/30 p-3 text-center">
      <MousePointer size={14} className="text-muted-foreground" />
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Select an item on the canvas to edit its properties.
      </p>
    </div>
    <PanelCard icon={<Box size={13} />} title="Room">
      <div className="space-y-1">
        <PropRow label="Name" value="My Living Room" />
        <PropRow label="Shape" value={roomConfig.shape.replace("-", " ")} capitalize />
        <PropRow label="Width" value={`${bbox.width.toFixed(1)} m`} />
        <PropRow label="Length" value={`${bbox.height.toFixed(1)} m`} />
        <ColorRow label="Wall" color={roomConfig.wallColor} />
        <ColorRow label="Floor" color={roomConfig.floorColor} />
      </div>
    </PanelCard>
  </>
  );
};

const RoomProperties = ({ roomConfig }: { roomConfig: RoomConfig }) => {
  const bbox = getRoomBoundingBox(roomConfig);
  return (
  <>
    <PanelCard icon={<Box size={13} />} title="Room Details">
      <div className="space-y-1">
        <EditableRow label="Name" value="My Living Room" />
        <PropRow label="Shape" value={roomConfig.shape.replace("-", " ")} capitalize />
        <EditableRow label="Width" value={`${bbox.width.toFixed(1)}`} suffix="m" />
        <EditableRow label="Length" value={`${bbox.height.toFixed(1)}`} suffix="m" />
      </div>
    </PanelCard>
    <PanelCard icon={<Grid3X3 size={13} />} title="View">
      <div className="space-y-1">
        <ToggleRow label="Grid" defaultOn />
        <ToggleRow label="Snap" defaultOn />
        <ToggleRow label="Guides" />
      </div>
    </PanelCard>
  </>
  );
};

const FurnitureProperties = ({
  item, onDuplicate, onDelete, onReset, onUpdate,
}: {
  item: PlacedFurniture; onDuplicate: () => void; onDelete: () => void; onReset: () => void;
  onUpdate: (attrs: Partial<PlacedFurniture>) => void;
}) => {
  const price = item.price ?? 0;
  return (
    <>
      <PanelCard icon={<Armchair size={13} />} title="Selected">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border overflow-hidden" style={{ backgroundColor: item.color }}>
            {item.image ? (
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[8px] font-bold text-foreground/40">{item.label}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-foreground">{item.name}</p>
            {price > 0 && <p className="text-[10px] text-muted-foreground">{formatLKR(price)}</p>}
          </div>
        </div>
      </PanelCard>

      <PanelCard icon={<Ruler size={13} />} title="Transform">
        <div className="grid grid-cols-2 gap-1">
          <NumericField label="X" value={Math.round(item.x)} onChange={(v) => onUpdate({ x: v })} />
          <NumericField label="Y" value={Math.round(item.y)} onChange={(v) => onUpdate({ y: v })} />
          <NumericField label="W" value={Math.round(item.width)} onChange={(v) => onUpdate({ width: Math.max(20, v) })} />
          <NumericField label="H" value={Math.round(item.height)} onChange={(v) => onUpdate({ height: Math.max(20, v) })} />
        </div>
        <div className="mt-1">
          <NumericField label="Rot" value={Math.round(item.rotation)} onChange={(v) => onUpdate({ rotation: v })} suffix="°" />
        </div>
      </PanelCard>

      {item.glbPath && (
        <PanelCard icon={<Palette size={13} />} title="Upholstery">
          <CushionColorPicker
            currentColor={item.cushionColor || item.color}
            onChange={(color) => onUpdate({ cushionColor: color })}
          />
        </PanelCard>
      )}

      <PanelCard icon={<Settings size={13} />} title="Actions">
        <div className="space-y-1">
          <Button variant="outline" size="sm" className="w-full h-6 gap-1.5 text-[10px] font-medium rounded-md border-border" onClick={onDuplicate}><Copy size={10} />Duplicate</Button>
          <Button variant="outline" size="sm" className="w-full h-6 gap-1.5 text-[10px] font-medium rounded-md border-border" onClick={onReset}><RotateCcw size={10} />Reset</Button>
          <Button variant="outline" size="sm" className="w-full h-6 gap-1.5 text-[10px] font-medium rounded-md border-destructive/30 text-destructive/70 hover:bg-destructive/5 hover:text-destructive" onClick={onDelete}><Trash2 size={10} />Remove</Button>
        </div>
      </PanelCard>
    </>
  );
};

/* ── Cushion / Upholstery color picker ── */

const UPHOLSTERY_PRESETS = [
  { name: "Natural Beige", color: "#D4B896" },
  { name: "Charcoal", color: "#3C3C3C" },
  { name: "Ivory", color: "#F5F0E8" },
  { name: "Sage Green", color: "#8B9E7E" },
  { name: "Dusty Rose", color: "#C9A0A0" },
  { name: "Navy", color: "#2C3E5A" },
  { name: "Rust", color: "#B5563E" },
  { name: "Warm Grey", color: "#9B9590" },
  { name: "Mustard", color: "#C9A83E" },
  { name: "Teal", color: "#4A7C7E" },
];

const CushionColorPicker = ({
  currentColor,
  onChange,
}: {
  currentColor: string;
  onChange: (color: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-1.5">
        {UPHOLSTERY_PRESETS.map((preset) => (
          <button
            key={preset.color}
            title={preset.name}
            onClick={() => onChange(preset.color)}
            className={`group relative h-6 w-full rounded-md border transition-all hover:scale-110 ${
              currentColor.toLowerCase() === preset.color.toLowerCase()
                ? "border-[hsl(28,35%,32%)] ring-1 ring-[hsl(28,35%,32%)] scale-110"
                : "border-border hover:border-foreground/30"
            }`}
            style={{ backgroundColor: preset.color }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-md bg-accent/50 px-2 py-1">
        <label className="text-[9px] font-medium text-muted-foreground shrink-0">Custom</label>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onChange(e.target.value)}
          className="h-5 w-8 cursor-pointer rounded border border-border bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0"
        />
        <span className="text-[9px] font-mono text-muted-foreground uppercase">{currentColor}</span>
      </div>
    </div>
  );
};

/* ── Helpers ── */

const PanelCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="rounded-lg border border-border bg-background p-2.5">
    <div className="mb-2 flex items-center gap-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/60">{title}</span>
    </div>
    {children}
  </div>
);

const PropRow = ({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) => (
  <div className="flex items-center justify-between rounded-md bg-accent/50 px-2.5 py-1">
    <span className="text-[10px] text-muted-foreground">{label}</span>
    <span className={`text-[10px] font-medium text-foreground ${capitalize ? "capitalize" : ""}`}>{value}</span>
  </div>
);

const ColorRow = ({ label, color, editable }: { label: string; color: string; editable?: boolean }) => (
  <div className="flex items-center justify-between rounded-md bg-accent/50 px-2.5 py-1">
    <span className="text-[10px] text-muted-foreground">{label}</span>
    <div className="flex items-center gap-1.5">
      <span className="h-3.5 w-3.5 rounded border border-border" style={{ backgroundColor: color }} />
      {editable && <span className="text-[9px] text-muted-foreground/50">Edit</span>}
    </div>
  </div>
);

const EditableRow = ({ label, value, suffix }: { label: string; value: string; suffix?: string }) => (
  <div className="flex items-center justify-between rounded-md bg-accent/50 px-2.5 py-1 focus-within:ring-1 focus-within:ring-ring">
    <span className="text-[10px] text-muted-foreground">{label}</span>
    <div className="flex items-center gap-0.5">
      <input type="text" defaultValue={value} className="w-14 bg-transparent text-right text-[10px] font-medium text-foreground outline-none" />
      {suffix && <span className="text-[9px] text-muted-foreground">{suffix}</span>}
    </div>
  </div>
);

const NumericField = ({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) => (
  <div className="flex items-center justify-between rounded-md bg-accent/50 px-2 py-1 focus-within:ring-1 focus-within:ring-ring">
    <span className="text-[9px] font-medium text-muted-foreground">{label}</span>
    <div className="flex items-center gap-0.5">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-10 bg-transparent text-right text-[10px] font-medium text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      {suffix && <span className="text-[9px] text-muted-foreground">{suffix}</span>}
    </div>
  </div>
);

const ToggleRow = ({ label, defaultOn }: { label: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn ?? false);
  return (
    <button
      onClick={() => setOn(!on)}
      className="flex w-full items-center justify-between rounded-md bg-accent/50 px-2.5 py-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      role="switch" aria-checked={on}
    >
      <span className={`text-[10px] font-medium ${on ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
      <div className={`h-3.5 w-6 rounded-full border transition-all ${on ? "bg-[hsl(28,35%,32%)] border-[hsl(28,35%,32%)]" : "bg-accent border-border"}`}>
        <div className={`mt-[1px] h-2.5 w-2.5 rounded-full bg-background shadow-sm transition-transform ${on ? "translate-x-[10px]" : "translate-x-[1px]"}`} />
      </div>
    </button>
  );
};

export default PropertiesPanel;
export type { SelectionState };
