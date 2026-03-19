import { useState, useCallback, useEffect } from "react";
import type { DesignFile, DesignSlot } from "@/types/designer";
import type { PlacedFurniture, RoomConfig } from "@/types/designer";
import { INITIAL_DESIGN_SLOTS } from "@/data/design-files";
import { getDefaultRoomConfig } from "@/lib/room-geometry";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchDesigns,
  saveDesign as saveDesignApi,
  deleteDesignApi,
  renameDesignApi,
} from "@/lib/api";

function toDesignFile(d: Record<string, unknown>): DesignFile {
  return {
    id: d.id as string,
    slotIndex: d.slotIndex as number,
    name: d.name as string,
    roomConfig: d.roomConfig as RoomConfig,
    items: d.items as PlacedFurniture[],
    createdAt: d.createdAt as string,
    updatedAt: d.updatedAt as string,
  };
}

export function useDesignFiles() {
  const { token } = useAuth();
  const [slots, setSlots] = useState<DesignSlot[]>(INITIAL_DESIGN_SLOTS);
  const [loading, setLoading] = useState(true);

  // Load designs from backend on mount
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { designs } = await fetchDesigns(token);
        if (cancelled) return;
        const fresh: DesignSlot[] = INITIAL_DESIGN_SLOTS.map((s) => ({ ...s, design: null }));
        for (const d of designs) {
          const df = toDesignFile(d as unknown as Record<string, unknown>);
          if (df.slotIndex >= 0 && df.slotIndex < 10) {
            fresh[df.slotIndex] = { slotIndex: df.slotIndex, design: df };
          }
        }
        setSlots(fresh);
      } catch (err) {
        console.error("Failed to load designs:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const createDesign = useCallback((slotIndex: number): DesignFile => {
    const now = new Date().toISOString();
    const design: DesignFile = {
      id: `df-${Date.now()}`,
      slotIndex,
      name: `Untitled Design ${slotIndex + 1}`,
      roomConfig: getDefaultRoomConfig("rectangle"),
      items: [],
      createdAt: now,
      updatedAt: now,
    };
    setSlots((prev) =>
      prev.map((s) => (s.slotIndex === slotIndex ? { ...s, design } : s))
    );
    // Save new design to backend
    if (token) {
      saveDesignApi(token, slotIndex, {
        name: design.name,
        roomConfig: design.roomConfig,
        items: design.items,
      }).catch((err) => console.error("Failed to create design:", err));
    }
    return design;
  }, [token]);

  const renameDesign = useCallback((slotIndex: number, name: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.slotIndex === slotIndex && s.design
          ? { ...s, design: { ...s.design, name, updatedAt: new Date().toISOString() } }
          : s
      )
    );
    if (token) {
      renameDesignApi(token, slotIndex, name).catch((err) =>
        console.error("Failed to rename design:", err)
      );
    }
  }, [token]);

  const deleteDesign = useCallback((slotIndex: number) => {
    setSlots((prev) =>
      prev.map((s) => (s.slotIndex === slotIndex ? { ...s, design: null } : s))
    );
    if (token) {
      deleteDesignApi(token, slotIndex).catch((err) =>
        console.error("Failed to delete design:", err)
      );
    }
  }, [token]);

  const updateDesign = useCallback((slotIndex: number, updates: Partial<DesignFile>) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.slotIndex === slotIndex && s.design
          ? { ...s, design: { ...s.design, ...updates, updatedAt: new Date().toISOString() } }
          : s
      )
    );
  }, []);

  /** Persist current design state to backend */
  const persistDesign = useCallback(
    async (slotIndex: number, name: string, roomConfig: RoomConfig, items: PlacedFurniture[]) => {
      if (!token) return;
      const { design } = await saveDesignApi(token, slotIndex, { name, roomConfig, items });
      const df = toDesignFile(design as unknown as Record<string, unknown>);
      setSlots((prev) =>
        prev.map((s) => (s.slotIndex === slotIndex ? { ...s, design: df } : s))
      );
      return df;
    },
    [token]
  );

  return { slots, loading, createDesign, renameDesign, deleteDesign, updateDesign, persistDesign };
}
