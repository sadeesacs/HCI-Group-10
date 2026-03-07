import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlacedFurniture, RoomConfig } from "./RoomCanvas2D";

interface Props {
  roomConfig: RoomConfig;
  furniture: PlacedFurniture[];
}

const Room3DPreview = ({ roomConfig, furniture }: Props) => {
  const [zoom, setZoom] = useState(1);
  const [rotateAngle, setRotateAngle] = useState(30);
  const hasFurniture = furniture.length > 0;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[hsl(0,0%,96%)]">
        <div
          className="transition-transform duration-500 ease-out"
          style={{ transform: `scale(${zoom}) perspective(800px) rotateX(18deg) rotateY(${rotateAngle}deg)` }}
        >
          <div
            className="relative rounded border border-border shadow-lg"
            style={{
              width: Math.min(roomConfig.widthM * 60, 420),
              height: Math.min(roomConfig.lengthM * 50, 340),
              backgroundColor: roomConfig.floorColor || "hsl(35, 30%, 82%)",
            }}
          >
            <div className="absolute -top-3 left-0 right-0 h-3 rounded-t-sm bg-[hsl(0,0%,92%)]" style={{ opacity: 0.8 }} />
            <div className="absolute -left-3 top-0 bottom-0 w-3 rounded-l-sm bg-[hsl(0,0%,90%)]" style={{ opacity: 0.6 }} />

            {furniture.map((item) => {
              const scaleX = Math.min(roomConfig.widthM * 60, 420) / (roomConfig.widthM * 120);
              const scaleY = Math.min(roomConfig.lengthM * 50, 340) / (roomConfig.lengthM * 120);
              return (
                <div
                  key={item.id}
                  className="absolute rounded-sm border border-border shadow flex items-center justify-center"
                  style={{
                    left: item.x * scaleX, top: item.y * scaleY,
                    width: item.width * scaleX, height: item.height * scaleY,
                    backgroundColor: item.color,
                    transform: `rotate(${item.rotation}deg)`,
                    minWidth: 16, minHeight: 16,
                  }}
                >
                  <span className="text-[7px] font-medium text-foreground/40 truncate px-0.5">{item.label}</span>
                </div>
              );
            })}

            {!hasFurniture && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">{roomConfig.shape.replace("-", " ")}</span>
              </div>
            )}
          </div>
        </div>

        {!hasFurniture && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
              <Box size={14} className="text-muted-foreground" />
            </div>
            <p className="text-[11px] text-muted-foreground">Add furniture in 2D view to preview here.</p>
          </div>
        )}
      </div>

      {/* 3D Controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1">
        {[
          { icon: ZoomIn, label: "Zoom In", action: () => setZoom((z) => Math.min(z + 0.15, 1.8)) },
          { icon: ZoomOut, label: "Zoom Out", action: () => setZoom((z) => Math.max(z - 0.15, 0.5)) },
          { icon: RotateCcw, label: "Rotate", action: () => setRotateAngle((a) => a + 15) },
          { icon: Maximize2, label: "Reset", action: () => { setZoom(1); setRotateAngle(30); } },
        ].map(({ icon: Icon, label, action }) => (
          <Button
            key={label}
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-md border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={action}
            aria-label={label}
            title={label}
          >
            <Icon size={13} />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Room3DPreview;
