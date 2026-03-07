import { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Rect, Line, Text, Group, Circle, Transformer } from "react-konva";
import Konva from "konva";
import { MousePointer } from "lucide-react";

export interface PlacedFurniture {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  label: string;
}

export interface RoomConfig {
  shape: string;
  widthM: number;
  lengthM: number;
  wallColor: string;
  floorColor: string;
}

interface Props {
  roomConfig: RoomConfig;
  furniture: PlacedFurniture[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onFurnitureUpdate: (id: string, attrs: Partial<PlacedFurniture>) => void;
}

const GRID_SIZE = 30;
const SNAP = 15;
const snap = (v: number) => Math.round(v / SNAP) * SNAP;

function getRoomOutline(shape: string, w: number, h: number, ox: number, oy: number): number[] {
  switch (shape) {
    case "l-shape": {
      const cutW = w * 0.45;
      const cutH = h * 0.45;
      return [ox, oy, ox + w, oy, ox + w, oy + h - cutH, ox + w - cutW, oy + h - cutH, ox + w - cutW, oy + h, ox, oy + h, ox, oy];
    }
    case "studio": {
      const inset = Math.min(w, h) * 0.12;
      return [ox + inset, oy, ox + w - inset, oy, ox + w, oy + inset, ox + w, oy + h - inset, ox + w - inset, oy + h, ox + inset, oy + h, ox, oy + h - inset, ox, oy + inset, ox + inset, oy];
    }
    default:
      return [ox, oy, ox + w, oy, ox + w, oy + h, ox, oy + h, ox, oy];
  }
}

const RoomCanvas2D = ({ roomConfig, furniture, selectedId, onSelect, onFurnitureUpdate }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

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

  const PX_PER_M = Math.min((stageSize.width - 120) / roomConfig.widthM, (stageSize.height - 120) / roomConfig.lengthM, 120);
  const roomW = roomConfig.widthM * PX_PER_M;
  const roomH = roomConfig.lengthM * PX_PER_M;
  const offsetX = (stageSize.width - roomW) / 2;
  const offsetY = (stageSize.height - roomH) / 2;
  const roomOutline = getRoomOutline(roomConfig.shape, roomW, roomH, offsetX, offsetY);

  const gridLines: number[][] = [];
  for (let x = 0; x <= stageSize.width; x += GRID_SIZE) gridLines.push([x, 0, x, stageSize.height]);
  for (let y = 0; y <= stageSize.height; y += GRID_SIZE) gridLines.push([0, y, stageSize.width, y]);

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) onSelect(null);
  }, [onSelect]);

  const hasFurniture = furniture.length > 0;
  const hasRoom = roomConfig.widthM > 0 && roomConfig.lengthM > 0;

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
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
            <Line points={roomOutline} closed={false} stroke="hsl(28, 35%, 32%)" strokeWidth={2} lineJoin="round" />
            <Text x={offsetX + roomW / 2 - 20} y={offsetY - 18} text={`${roomConfig.widthM}m`} fontSize={10} fontFamily="Inter, sans-serif" fill="hsl(0, 0%, 45%)" fontStyle="500" />
            <Text x={offsetX + roomW + 6} y={offsetY + roomH / 2 - 5} text={`${roomConfig.lengthM}m`} fontSize={10} fontFamily="Inter, sans-serif" fill="hsl(0, 0%, 45%)" fontStyle="500" />
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
    </div>
  );
};

export default RoomCanvas2D;
