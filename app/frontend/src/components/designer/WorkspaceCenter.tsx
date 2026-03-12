import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import RoomCanvas2D from "./RoomCanvas2D";
import Room3DPreview from "./Room3DPreview";
import CanvasToolbar from "./CanvasToolbar";
import type { PlacedFurniture } from "./RoomCanvas2D";
import type { SelectionState } from "./PropertiesPanel";
import type { DesignFile, RoomConfig } from "@/types/designer";
import { getDefaultRoomConfig, getRoomBoundingBox } from "@/lib/room-geometry";

const DEFAULT_ROOM: RoomConfig = getDefaultRoomConfig("rectangle");

export function useWorkspaceState() {
  const [viewMode, setViewMode] = useState<"2D" | "3D">("2D");
  const [furniture, setFurniture] = useState<PlacedFurniture[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [roomConfig, setRoomConfig] = useState<RoomConfig>(DEFAULT_ROOM);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const initialItemsRef = useRef<PlacedFurniture[]>([]);
  const historyRef = useRef<PlacedFurniture[][]>([[]]);
  const historyIndexRef = useRef(0);

  const pushHistory = useCallback((next: PlacedFurniture[]) => {
    const idx = historyIndexRef.current;
    const newHistory = historyRef.current.slice(0, idx + 1);
    newHistory.push(next);
    if (newHistory.length > 30) newHistory.shift();
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
  }, []);

  const selectedItem = furniture.find((f) => f.id === selectedId) ?? null;
  const selectionState: SelectionState = selectedItem ? "furniture" : "none";
  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    setFurniture(historyRef.current[historyIndexRef.current]);
    setSelectedId(null);
    toast("Undo applied");
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    setFurniture(historyRef.current[historyIndexRef.current]);
    setSelectedId(null);
    toast("Redo applied");
  }, []);

  const markDirty = useCallback(() => setHasUnsavedChanges(true), []);

  const handleFurnitureUpdate = useCallback((id: string, attrs: Partial<PlacedFurniture>) => {
    setFurniture((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...attrs } : f));
      pushHistory(next);
      return next;
    });
    markDirty();
  }, [pushHistory, markDirty]);

  const handleRotate = useCallback((deg: number) => {
    if (!selectedId) return;
    setFurniture((prev) => {
      const next = prev.map((f) => (f.id === selectedId ? { ...f, rotation: f.rotation + deg } : f));
      pushHistory(next);
      return next;
    });
    markDirty();
  }, [selectedId, pushHistory, markDirty]);

  const handleDuplicate = useCallback(() => {
    if (!selectedId) return;
    const src = furniture.find((f) => f.id === selectedId);
    if (!src) return;
    const newItem: PlacedFurniture = { ...src, id: `p${Date.now()}`, x: src.x + 20, y: src.y + 20 };
    setFurniture((prev) => {
      const next = [...prev, newItem];
      pushHistory(next);
      return next;
    });
    setSelectedId(newItem.id);
    markDirty();
    toast.success(`${src.name} duplicated`);
  }, [selectedId, furniture, pushHistory, markDirty]);

  const requestDelete = useCallback(() => {
    if (!selectedId) return;
    const item = furniture.find((f) => f.id === selectedId);
    if (item) setDeleteConfirm({ id: item.id, name: item.name });
  }, [selectedId, furniture]);

  const confirmDelete = useCallback(() => {
    if (!deleteConfirm) return;
    const { id, name } = deleteConfirm;
    const removedItem = furniture.find((f) => f.id === id);
    setFurniture((prev) => {
      const next = prev.filter((f) => f.id !== id);
      pushHistory(next);
      return next;
    });
    setSelectedId(null);
    setDeleteConfirm(null);
    markDirty();
    toast(`${name} removed`, {
      action: removedItem ? {
        label: "Undo",
        onClick: () => {
          setFurniture((prev) => {
            const next = [...prev, removedItem];
            pushHistory(next);
            return next;
          });
          toast.success(`${name} restored`);
        },
      } : undefined,
    });
  }, [deleteConfirm, furniture, pushHistory, markDirty]);

  const cancelDelete = useCallback(() => setDeleteConfirm(null), []);

  const handleReset = useCallback(() => {
    if (!selectedId) return;
    const initial = initialItemsRef.current.find((f) => f.id === selectedId);
    if (initial) {
      handleFurnitureUpdate(selectedId, { x: initial.x, y: initial.y, rotation: initial.rotation, width: initial.width, height: initial.height });
      toast("Position reset");
    }
  }, [selectedId, handleFurnitureUpdate]);

  const handleSave = useCallback(() => {
    setHasUnsavedChanges(false);
    toast.success("Design saved");
  }, []);

  const loadDesign = useCallback((design: DesignFile) => {
    const items = design.items;
    const room = design.roomConfig;
    setFurniture(items);
    setRoomConfig(room);
    setSelectedId(null);
    setHasUnsavedChanges(false);
    setDeleteConfirm(null);
    setViewMode("2D");
    initialItemsRef.current = items;
    historyRef.current = [items];
    historyIndexRef.current = 0;
  }, []);

  const applyRoomConfig = useCallback((config: RoomConfig) => {
    setRoomConfig(config);
    markDirty();

    // Clamp furniture to new bounding box (MVP: nudge items inside)
    const bbox = getRoomBoundingBox(config);
    const maxPxW = bbox.width * 120; // approximate pixel space
    const maxPxH = bbox.height * 120;
    setFurniture((prev) => {
      const clamped = prev.map((f) => {
        const nx = Math.min(f.x, Math.max(0, maxPxW - f.width));
        const ny = Math.min(f.y, Math.max(0, maxPxH - f.height));
        if (nx !== f.x || ny !== f.y) return { ...f, x: nx, y: ny };
        return f;
      });
      // Only push history if something actually moved
      if (clamped.some((f, i) => f !== prev[i])) pushHistory(clamped);
      return clamped;
    });
  }, [markDirty, pushHistory]);

  return {
    viewMode, setViewMode,
    furniture, selectedId, setSelectedId, selectedItem,
    roomConfig, setRoomConfig, applyRoomConfig, selectionState,
    hasUnsavedChanges,
    canUndo, canRedo, handleUndo, handleRedo,
    handleFurnitureUpdate, handleRotate, handleDuplicate,
    requestDelete, deleteConfirm, confirmDelete, cancelDelete,
    handleReset, handleSave, loadDesign,
  };
}

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
