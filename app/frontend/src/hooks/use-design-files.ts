import { useState, useCallback } from "react";
import type { DesignFile, DesignSlot } from "@/types/designer";
import { INITIAL_DESIGN_SLOTS } from "@/data/design-files";
import { getDefaultRoomConfig } from "@/lib/room-geometry";

export function useDesignFiles() {
  const [slots, setSlots] = useState<DesignSlot[]>(INITIAL_DESIGN_SLOTS);

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
    return design;
  }, []);

  const renameDesign = useCallback((slotIndex: number, name: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.slotIndex === slotIndex && s.design
          ? { ...s, design: { ...s.design, name, updatedAt: new Date().toISOString() } }
          : s
      )
    );
  }, []);

  const deleteDesign = useCallback((slotIndex: number) => {
    setSlots((prev) =>
      prev.map((s) => (s.slotIndex === slotIndex ? { ...s, design: null } : s))
    );
  }, []);

  const updateDesign = useCallback((slotIndex: number, updates: Partial<DesignFile>) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.slotIndex === slotIndex && s.design
          ? { ...s, design: { ...s.design, ...updates, updatedAt: new Date().toISOString() } }
          : s
      )
    );
  }, []);

  return { slots, createDesign, renameDesign, deleteDesign, updateDesign };
}
