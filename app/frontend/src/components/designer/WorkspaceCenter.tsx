import RoomCanvas2D from "./RoomCanvas2D";
import Room3DPreview from "./Room3DPreview";
import CanvasToolbar from "./CanvasToolbar";
import type { PlacedFurniture } from "./RoomCanvas2D";
import type { RoomConfig } from "@/types/designer";

/* ── Workspace Center Component ── */
interface WorkspaceCenterProps {
  viewMode: "2D" | "3D";
  setViewMode: (m: "2D" | "3D") => void;
  furniture: PlacedFurniture[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  roomConfig: RoomConfig;
  handleFurnitureUpdate: (id: string, attrs: Partial<PlacedFurniture>) => void;
  handleRotate: (deg: number) => void;
  handleDuplicate: () => void;
  requestDelete: () => void;
  handleReset: () => void;
  designName?: string;
  onRoomConfigChange?: (config: RoomConfig) => void;
}

const WorkspaceCenter = ({
  viewMode, setViewMode,
  furniture, selectedId, setSelectedId,
  roomConfig,
  handleFurnitureUpdate, handleRotate, handleDuplicate, requestDelete, handleReset,
  designName,
  onRoomConfigChange,
}: WorkspaceCenterProps) => {
  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-[hsl(0,0%,96%)]">
      {/* Workspace header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-background px-3 py-2 lg:px-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[13px] font-semibold text-foreground">{designName || "Untitled Design"}</h2>
          <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
            {roomConfig.shape.replace("-", " ")}
          </span>
          <span className="hidden text-[10px] text-muted-foreground md:inline">
            · {furniture.length} item{furniture.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* 2D / 3D toggle */}
        <div className="flex rounded-md border border-border bg-accent p-0.5" role="tablist">
          {(["2D", "3D"] as const).map((mode) => (
            <button
              key={mode}
              role="tab"
              aria-selected={viewMode === mode}
              onClick={() => setViewMode(mode)}
              className={`rounded px-3 py-1 text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                viewMode === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative flex-1 overflow-hidden">
        {viewMode === "2D" ? (
          <RoomCanvas2D
            roomConfig={roomConfig}
            furniture={furniture}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onFurnitureUpdate={handleFurnitureUpdate}
            onRoomConfigChange={onRoomConfigChange}
          />
        ) : (
          <Room3DPreview roomConfig={roomConfig} furniture={furniture} />
        )}

        {viewMode === "2D" && selectedId && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up">
            <CanvasToolbar
              onRotate={handleRotate}
              onDuplicate={handleDuplicate}
              onDelete={requestDelete}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default WorkspaceCenter;
