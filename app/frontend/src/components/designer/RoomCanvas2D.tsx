import { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Rect, Line, Text, Group, Circle, Transformer } from "react-konva";
import Konva from "konva";
import { MousePointer } from "lucide-react";
import type { RoomConfig, RoomDimensions } from "@/types/designer";
import { getRoomPolygon, getRoomBoundingBox, getWallSegments, normalizeRoomDimensions, validateRoomDimensions } from "@/lib/room-geometry";
import type { DragFurnitureTemplate } from "@/components/designer/FurnitureLibraryPanel";

export interface PlacedFurniture {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  heightM?: number;
  rotation: number;
  color: string;
  label: string;
  glbPath?: string;
}

interface Props {
  roomConfig: RoomConfig;
  furniture: PlacedFurniture[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onFurnitureUpdate: (id: string, attrs: Partial<PlacedFurniture>) => void;
  onRoomConfigChange?: (config: RoomConfig) => void;
  onDropFurniture?: (item: PlacedFurniture) => void;
}

const GRID_SIZE = 30;
const SNAP = 15;
const snap = (v: number) => Math.round(v / SNAP) * SNAP;

const RoomCanvas2D = ({ roomConfig, furniture, selectedId, onSelect, onFurnitureUpdate, onRoomConfigChange, onDropFurniture }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [selectedWallIdx, setSelectedWallIdx] = useState<number | null>(null);
  const [wallEditValue, setWallEditValue] = useState("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setStageSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const tr = transformerRef.current;
    if (!tr) return;
    const stage = stageRef.current;
    if (!stage) return;
    if (selectedId) {
      const node = stage.findOne(`#${selectedId}`);
      if (node) { tr.nodes([node]); tr.getLayer()?.batchDraw(); return; }
    }
    tr.nodes([]);
    tr.getLayer()?.batchDraw();
  }, [selectedId, furniture]);

  const bbox = getRoomBoundingBox(roomConfig);
  const PX_PER_M = Math.min((stageSize.width - 120) / bbox.width, (stageSize.height - 120) / bbox.height, 120);
  const roomW = bbox.width * PX_PER_M;
  const roomH = bbox.height * PX_PER_M;
  const offsetX = (stageSize.width - roomW) / 2;
  const offsetY = (stageSize.height - roomH) / 2;
  // Get polygon in meters then scale to pixels and offset
  const polyM = getRoomPolygon(roomConfig);
  const roomOutline: number[] = [];
  for (let i = 0; i < polyM.length; i += 2) {
    roomOutline.push(polyM[i] * PX_PER_M + offsetX, polyM[i + 1] * PX_PER_M + offsetY);
  }

  // Wall segments for interactive selection
  const wallSegments = getWallSegments(roomConfig);
  const dimValues = roomConfig.dimensions.dims as unknown as Record<string, number>;

  const gridLines: number[][] = [];
  for (let x = 0; x <= stageSize.width; x += GRID_SIZE) gridLines.push([x, 0, x, stageSize.height]);
  for (let y = 0; y <= stageSize.height; y += GRID_SIZE) gridLines.push([0, y, stageSize.width, y]);

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      onSelect(null);
      setSelectedWallIdx(null);
    }
  }, [onSelect]);

  const handleWallClick = useCallback((idx: number) => {
    onSelect(null);
    setSelectedWallIdx((prev) => {
      if (prev === idx) return null;
      const wall = wallSegments[idx];
      if (wall.dimKey) setWallEditValue(String(dimValues[wall.dimKey] ?? wall.lengthM));
      return idx;
    });
  }, [onSelect, wallSegments, dimValues]);

  const handleWallDimApply = useCallback(() => {
    if (selectedWallIdx === null || !onRoomConfigChange) return;
    const wall = wallSegments[selectedWallIdx];
    if (!wall.dimKey) return;
    const parsed = parseFloat(wallEditValue);
    if (isNaN(parsed) || parsed <= 0) return;
    const rounded = Math.round(parsed * 10) / 10;
    const updated = { ...roomConfig.dimensions, dims: { ...roomConfig.dimensions.dims, [wall.dimKey]: rounded } } as RoomDimensions;
    const normalized = normalizeRoomDimensions(updated);
    const validation = validateRoomDimensions(normalized);
    if (validation.valid) {
      onRoomConfigChange({ ...roomConfig, dimensions: normalized });
      setSelectedWallIdx(null);
    }
  }, [selectedWallIdx, wallSegments, wallEditValue, roomConfig, onRoomConfigChange]);

  const hasFurniture = furniture.length > 0;
  const hasRoom = bbox.width > 0 && bbox.height > 0;

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!onDropFurniture || !containerRef.current) return;
    const raw = e.dataTransfer.getData("application/furniture");
    if (!raw) return;
    const template = JSON.parse(raw) as DragFurnitureTemplate;
    const rect = containerRef.current.getBoundingClientRect();
    const stageX = e.clientX - rect.left;
    const stageY = e.clientY - rect.top;
    const w = Math.round(template.widthM * PX_PER_M);
    const h = Math.round(template.depthM * PX_PER_M);
    const x = Math.max(0, snap(stageX - offsetX - w / 2));
    const y = Math.max(0, snap(stageY - offsetY - h / 2));
    onDropFurniture({
      id: `p${Date.now()}`,
      name: template.name,
      label: template.label,
      color: template.color,
      glbPath: template.glbPath,
      x,
      y,
      width: w,
      height: h,
      heightM: template.heightM,
      rotation: 0,
    });
  }, [onDropFurniture, PX_PER_M, offsetX, offsetY]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }}
      onDrop={handleDrop}
    >
      <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} onClick={handleStageClick} onTap={handleStageClick}>
        {/* Grid */}
        <Layer listening={false}>
          <Rect x={0} y={0} width={stageSize.width} height={stageSize.height} fill="hsl(0, 0%, 96%)" />
          {gridLines.map((pts, i) => (
            <Line key={i} points={pts} stroke="hsl(0, 0%, 88%)" strokeWidth={0.5} opacity={0.6} />
          ))}
        </Layer>

        {/* Room outline */}
        {hasRoom && (
          <Layer listening={false}>
            <Line points={roomOutline} closed fill={roomConfig.floorColor || "hsl(35, 30%, 92%)"} opacity={0.3} />
          </Layer>
        )}

        {/* Interactive walls */}
        {hasRoom && (
          <Layer>
            {wallSegments.map((wall, i) => {
              const isSelected = selectedWallIdx === i;
              return (
                <Line
                  key={i}
                  points={[
                    wall.x1 * PX_PER_M + offsetX,
                    wall.y1 * PX_PER_M + offsetY,
                    wall.x2 * PX_PER_M + offsetX,
                    wall.y2 * PX_PER_M + offsetY,
                  ]}
                  stroke={isSelected ? "hsl(28, 80%, 45%)" : "hsl(28, 35%, 32%)"}
                  strokeWidth={isSelected ? 3.5 : 2}
                  hitStrokeWidth={14}
                  onClick={() => handleWallClick(i)}
                  onTap={() => handleWallClick(i)}
                />
              );
            })}
            {/* Dimension labels */}
            <Text x={offsetX + roomW / 2 - 20} y={offsetY - 18} text={`${bbox.width.toFixed(1)}m`} fontSize={10} fontFamily="Inter, sans-serif" fill="hsl(0, 0%, 45%)" fontStyle="500" />
            <Text x={offsetX + roomW + 6} y={offsetY + roomH / 2 - 5} text={`${bbox.height.toFixed(1)}m`} fontSize={10} fontFamily="Inter, sans-serif" fill="hsl(0, 0%, 45%)" fontStyle="500" />
          </Layer>
        )}

        {/* Furniture */}
        <Layer>
          {furniture.map((item) => (
            <Group
              key={item.id}
              id={item.id}
              x={offsetX + item.x}
              y={offsetY + item.y}
              rotation={item.rotation}
              draggable
              onClick={(e) => { e.cancelBubble = true; onSelect(item.id); }}
              onTap={(e) => { e.cancelBubble = true; onSelect(item.id); }}
              onDragEnd={(e) => {
                const node = e.target;
                onFurnitureUpdate(item.id, { x: snap(node.x() - offsetX), y: snap(node.y() - offsetY) });
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                node.scaleX(1);
                node.scaleY(1);
                onFurnitureUpdate(item.id, {
                  x: snap(node.x() - offsetX), y: snap(node.y() - offsetY),
                  width: Math.max(20, snap(item.width * scaleX)), height: Math.max(20, snap(item.height * scaleY)),
                  rotation: Math.round(node.rotation()),
                });
              }}
            >
              <Rect
                width={item.width} height={item.height} fill={item.color} cornerRadius={3}
                stroke={selectedId === item.id ? "hsl(28, 35%, 32%)" : "hsl(0, 0%, 75%)"}
                strokeWidth={selectedId === item.id ? 2 : 0.5}
                shadowColor="hsl(0, 0%, 30%)"
                shadowBlur={selectedId === item.id ? 6 : 2}
                shadowOpacity={selectedId === item.id ? 0.15 : 0.06}
                shadowOffset={{ x: 0, y: 1 }}
              />
              <Circle x={item.width / 2} y={3} radius={2.5} fill={selectedId === item.id ? "hsl(28, 35%, 32%)" : "hsl(0, 0%, 60%)"} />
              <Text
                x={3} y={item.height / 2 - 4} width={item.width - 6}
                text={item.label} fontSize={9} fontFamily="Inter, sans-serif"
                fill="hsl(0, 0%, 35%)" fontStyle="500" align="center" ellipsis wrap="none"
              />
            </Group>
          ))}
          <Transformer
            ref={transformerRef}
            rotateEnabled
            enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
            borderStroke="hsl(28, 35%, 32%)" borderStrokeWidth={1.5}
            anchorStroke="hsl(28, 35%, 32%)" anchorFill="hsl(0, 0%, 98%)"
            anchorSize={7} anchorCornerRadius={2} rotateAnchorOffset={18}
          />
        </Layer>
      </Stage>

      {/* Empty state */}
      {!hasFurniture && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
              <MousePointer size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground/60">Start designing</p>
            <p className="max-w-[220px] text-[11px] text-muted-foreground">
              Set up your room on the left, then add furniture to begin.
            </p>
          </div>
        </div>
      )}

      {/* Wall dimension edit popup */}
      {selectedWallIdx !== null && (() => {
        const wall = wallSegments[selectedWallIdx];
        if (!wall.dimKey) return null;
        const midPxX = ((wall.x1 + wall.x2) / 2) * PX_PER_M + offsetX;
        const midPxY = ((wall.y1 + wall.y2) / 2) * PX_PER_M + offsetY;
        const centerX = offsetX + roomW / 2;
        const centerY = offsetY + roomH / 2;
        const awayX = midPxX - centerX;
        const awayY = midPxY - centerY;
        const awayLen = Math.sqrt(awayX * awayX + awayY * awayY) || 1;
        const popX = midPxX + (awayX / awayLen) * 30;
        const popY = midPxY + (awayY / awayLen) * 30;
        return (
          <div
            className="absolute z-30 flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 shadow-lg"
            style={{ left: popX - 55, top: popY - 16 }}
          >
            <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{wall.label}</span>
            <input
              type="text"
              inputMode="decimal"
              autoFocus
              value={wallEditValue}
              onChange={(e) => setWallEditValue(e.target.value)}
              onBlur={handleWallDimApply}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleWallDimApply();
                if (e.key === "Escape") setSelectedWallIdx(null);
              }}
              className="w-14 rounded border border-input bg-background px-1.5 py-0.5 text-right text-[11px] font-medium text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <span className="text-[10px] text-muted-foreground">m</span>
          </div>
        );
      })()}
    </div>
  );
};

export default RoomCanvas2D;
