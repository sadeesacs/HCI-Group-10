import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { PlacedFurniture } from "@/types/designer";
import type { SelectionState } from "./PropertiesPanel";
import type { DesignFile, RoomConfig } from "@/types/designer";
import { getDefaultRoomConfig, getRoomBoundingBox } from "@/lib/room-geometry";

const DEFAULT_ROOM: RoomConfig = getDefaultRoomConfig("rectangle");

export function useWorkspaceState() {
  const [viewMode, setViewMode] = useState<"2D" | "3D">("3D");
  const [furniture, setFurniture] = useState<PlacedFurniture[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [roomConfig, setRoomConfig] = useState<RoomConfig>(DEFAULT_ROOM);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [historyMeta, setHistoryMeta] = useState({ index: 0, length: 1 });

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
    setHistoryMeta({ index: historyIndexRef.current, length: historyRef.current.length });
  }, []);

  const selectedItem = furniture.find((f) => f.id === selectedId) ?? null;
  const selectionState: SelectionState = selectedItem ? "furniture" : "none";
  const canUndo = historyMeta.index > 0;
  const canRedo = historyMeta.index < historyMeta.length - 1;

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    setFurniture(historyRef.current[historyIndexRef.current]);
    setHistoryMeta({ index: historyIndexRef.current, length: historyRef.current.length });
    setSelectedId(null);
    toast("Undo applied");
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    setFurniture(historyRef.current[historyIndexRef.current]);
    setHistoryMeta({ index: historyIndexRef.current, length: historyRef.current.length });
    setSelectedId(null);
    toast("Redo applied");
  }, []);

  const markDirty = useCallback(() => setHasUnsavedChanges(true), []);

  const handleFurnitureUpdate = useCallback((id: string, attrs: Partial<PlacedFurniture>) => {
    const bbox = getRoomBoundingBox(roomConfig);
    const maxW = bbox.width * 120;  // PX_PER_M
    const maxH = bbox.height * 120;
    setFurniture((prev) => {
      const next = prev.map((f) => {
        if (f.id !== id) return f;
        const merged = { ...f, ...attrs };
        merged.x = Math.max(0, Math.min(merged.x, maxW - merged.width));
        merged.y = Math.max(0, Math.min(merged.y, maxH - merged.height));
        return merged;
      });
      pushHistory(next);
      return next;
    });
    markDirty();
  }, [pushHistory, markDirty, roomConfig]);

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
      handleFurnitureUpdate(selectedId, {
        x: initial.x,
        y: initial.y,
        rotation: initial.rotation,
        width: initial.width,
        height: initial.height,
        heightM: initial.heightM,
      });
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
    setViewMode("3D");
    initialItemsRef.current = items;
    historyRef.current = [items];
    historyIndexRef.current = 0;
    setHistoryMeta({ index: 0, length: 1 });
  }, []);

  const applyRoomConfig = useCallback((config: RoomConfig) => {
    setRoomConfig(config);
    markDirty();

    const bbox = getRoomBoundingBox(config);
    const maxPxW = bbox.width * 120;
    const maxPxH = bbox.height * 120;
    setFurniture((prev) => {
      const clamped = prev.map((f) => {
        const nx = Math.min(f.x, Math.max(0, maxPxW - f.width));
        const ny = Math.min(f.y, Math.max(0, maxPxH - f.height));
        if (nx !== f.x || ny !== f.y) return { ...f, x: nx, y: ny };
        return f;
      });
      if (clamped.some((f, i) => f !== prev[i])) pushHistory(clamped);
      return clamped;
    });
  }, [markDirty, pushHistory]);

  const addFurniture = useCallback((item: PlacedFurniture) => {
    const bbox = getRoomBoundingBox(roomConfig);
    const maxW = bbox.width * 120;
    const maxH = bbox.height * 120;
    const clamped = {
      ...item,
      x: Math.max(0, Math.min(item.x, maxW - item.width)),
      y: Math.max(0, Math.min(item.y, maxH - item.height)),
    };
    setFurniture((prev) => {
      const next = [...prev, clamped];
      pushHistory(next);
      return next;
    });
    setSelectedId(clamped.id);
    markDirty();
  }, [pushHistory, markDirty, roomConfig]);

  return {
    viewMode, setViewMode,
    furniture, selectedId, setSelectedId, selectedItem,
    roomConfig, setRoomConfig, applyRoomConfig, selectionState,
    hasUnsavedChanges,
    canUndo, canRedo, handleUndo, handleRedo,
    handleFurnitureUpdate, handleRotate, handleDuplicate,
    requestDelete, deleteConfirm, confirmDelete, cancelDelete,
    handleReset, handleSave, loadDesign, addFurniture,
  };
}
