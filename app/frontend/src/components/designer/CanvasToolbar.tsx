import { Move, RotateCcw, Maximize2, Copy, Trash2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface Props {
  onRotate: (deg: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onReset: () => void;
}

const CanvasToolbar = ({ onRotate, onDuplicate, onDelete, onReset }: Props) => {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-background px-1 py-0.5 shadow-lg">
      <ToolbarBtn icon={Move} label="Move" onClick={() => {}} />
      <ToolbarBtn icon={RotateCcw} label="Rotate Left" onClick={() => onRotate(-15)} />
      <ToolbarBtn icon={RotateCw} label="Rotate Right" onClick={() => onRotate(15)} />
      <ToolbarBtn icon={Maximize2} label="Resize" onClick={() => {}} />
      <div className="mx-0.5 h-4 w-px bg-border" />
      <ToolbarBtn icon={Copy} label="Duplicate" onClick={onDuplicate} />
      <ToolbarBtn icon={RotateCcw} label="Reset" onClick={onReset} />
      <div className="mx-0.5 h-4 w-px bg-border" />
      <ToolbarBtn icon={Trash2} label="Delete" onClick={onDelete} destructive />
    </div>
  );
};

const ToolbarBtn = ({ icon: Icon, label, onClick, destructive }: { icon: LucideIcon; label: string; onClick: () => void; destructive?: boolean }) => (
  <Button
    variant="ghost"
    size="icon"
    className={`h-7 w-7 rounded-md active:scale-95 transition-all ${
      destructive ? "text-destructive/60 hover:text-destructive hover:bg-destructive/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
    }`}
    onClick={onClick}
    aria-label={label}
    title={label}
  >
    <Icon size={13} strokeWidth={1.8} />
  </Button>
);

export default CanvasToolbar;
