import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilePlus2, FileText, Pencil, Trash2, FolderOpen, X } from "lucide-react";
import type { DesignFile, DesignSlot } from "@/types/designer";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

interface SavedDesignsModalProps {
  open: boolean;
  slots: DesignSlot[];
  canClose: boolean;
  onClose: () => void;
  onOpenDesign: (design: DesignFile) => void;
  onCreateDesign: (slotIndex: number) => void;
  onRenameDesign: (slotIndex: number, name: string) => void;
  onDeleteDesign: (slotIndex: number) => void;
}

const SavedDesignsModal = ({
  open, slots, canClose, onClose, onOpenDesign, onCreateDesign, onRenameDesign, onDeleteDesign,
}: SavedDesignsModalProps) => {
  const [deletingSlot, setDeletingSlot] = useState<number | null>(null);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSlot !== null) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editingSlot]);

  if (!open) return null;

  const handleStartRename = (slot: DesignSlot) => {
    if (!slot.design) return;
    setEditingSlot(slot.slotIndex);
    setEditValue(slot.design.name);
  };

  const handleCommitRename = () => {
    if (editingSlot === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      onRenameDesign(editingSlot, trimmed);
    }
    setEditingSlot(null);
    setEditValue("");
  };

  const handleCancelRename = () => {
    setEditingSlot(null);
    setEditValue("");
  };

  const handleConfirmDelete = (slotIndex: number) => {
    onDeleteDesign(slotIndex);
    setDeletingSlot(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl rounded-2xl border border-[hsl(30,15%,88%)] bg-[hsl(40,25%,98%)] shadow-2xl"
          >
            {/* Close button (only when canClose) */}
            {canClose && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            )}

            {/* Header */}
            <div className="px-8 pt-7 pb-2 text-center">
              <h2 className="text-lg font-semibold text-foreground tracking-tight">Choose a Design File</h2>
              <p className="text-[13px] text-muted-foreground mt-1">Open a saved project or start a new blank design.</p>
            </div>

            {/* 5×2 Grid */}
            <div className="px-8 pt-5 pb-8">
              <div className="grid grid-cols-5 gap-3">
                {slots.map((slot, i) => {
                  const design = slot.design;
                  const isFilled = !!design;
                  const isDeleting = deletingSlot === slot.slotIndex;
                  const isEditing = editingSlot === slot.slotIndex;

                  return (
                    <motion.div
                      key={slot.slotIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      onClick={() => {
                        if (isDeleting || isEditing) return;
                        if (design) {
                          onOpenDesign(design);
                        } else {
                          onCreateDesign(slot.slotIndex);
                        }
                      }}
                      className={`relative flex flex-col items-center rounded-xl cursor-pointer transition-all duration-200 min-h-[155px] group
                        ${isFilled
                          ? "border border-[hsl(30,15%,85%)] bg-white shadow-[0_1px_4px_hsl(30,15%,28%,0.06)] hover:shadow-[0_4px_16px_hsl(30,15%,28%,0.1)] hover:border-[hsl(28,35%,42%)] hover:-translate-y-0.5"
                          : "border-2 border-dashed border-[hsl(30,12%,80%)] bg-[hsl(38,20%,96%)] hover:border-[hsl(28,35%,55%)] hover:bg-[hsl(38,22%,94%)] hover:-translate-y-0.5"
                        }
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key !== "Enter" || isDeleting || isEditing) return;
                        if (design) onOpenDesign(design);
                        else onCreateDesign(slot.slotIndex);
                      }}
                    >
                      {/* Delete confirm overlay */}
                      <AnimatePresence>
                        {isDeleting && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/97 backdrop-blur-sm border border-destructive/20"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-xs font-medium text-foreground">Delete this file?</p>
                            <div className="flex gap-2">
                              <button
                                className="h-7 px-3 text-[11px] font-medium rounded-lg border border-[hsl(30,15%,85%)] bg-white hover:bg-[hsl(38,20%,96%)] transition-colors"
                                onClick={(e) => { e.stopPropagation(); setDeletingSlot(null); }}
                              >
                                Cancel
                              </button>
                              <button
                                className="h-7 px-3 text-[11px] font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                onClick={(e) => { e.stopPropagation(); handleConfirmDelete(slot.slotIndex); }}
                              >
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {isFilled && design ? (
                        <div className="flex flex-col items-center justify-between flex-1 w-full px-2.5 pt-4 pb-2.5">
                          <div className="flex flex-col items-center gap-2 flex-1 w-full">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(28,30%,92%)] ring-1 ring-[hsl(28,30%,82%)]">
                              <FileText size={18} className="text-[hsl(28,35%,32%)]" />
                            </div>
                            <div className="text-center w-full">
                              <span className="text-[9px] font-medium text-[hsl(30,10%,55%)] uppercase tracking-wider">
                                File {slot.slotIndex + 1}
                              </span>
                              {isEditing ? (
                                <input
                                  ref={editInputRef}
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    e.stopPropagation();
                                    if (e.key === "Enter") handleCommitRename();
                                    if (e.key === "Escape") handleCancelRename();
                                  }}
                                  onBlur={handleCommitRename}
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-0.5 w-full rounded border border-ring bg-white px-1.5 py-0.5 text-[11px] font-semibold text-foreground text-center outline-none focus:ring-1 focus:ring-ring"
                                />
                              ) : (
                                <p className="text-[11px] font-semibold text-foreground leading-snug mt-0.5 line-clamp-2">
                                  {design.name}
                                </p>
                              )}
                              <p className="text-[9px] text-muted-foreground mt-0.5">
                                {formatDate(design.updatedAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 mt-2 w-full justify-center">
                            <button
                              className="h-5.5 px-2 text-[9px] font-semibold rounded-md bg-[hsl(28,35%,32%)] text-white hover:bg-[hsl(28,35%,26%)] transition-colors flex items-center gap-1 shadow-sm"
                              onClick={(e) => { e.stopPropagation(); onOpenDesign(design); }}
                            >
                              <FolderOpen size={9} />Open
                            </button>
                            <button
                              className="h-5.5 px-1.5 text-[9px] font-medium rounded-md border border-[hsl(30,15%,85%)] bg-white hover:bg-[hsl(38,20%,96%)] transition-colors flex items-center gap-1"
                              onClick={(e) => { e.stopPropagation(); handleStartRename(slot); }}
                            >
                              <Pencil size={9} />Edit
                            </button>
                            <button
                              className="h-5.5 w-5.5 flex items-center justify-center rounded-md text-[hsl(30,10%,65%)] hover:text-destructive hover:bg-destructive/10 transition-colors"
                              onClick={(e) => { e.stopPropagation(); setDeletingSlot(slot.slotIndex); }}
                              aria-label="Delete"
                            >
                              <Trash2 size={10} className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center flex-1 gap-2 px-2.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-[hsl(30,12%,78%)] group-hover:border-[hsl(28,35%,55%)] transition-colors">
                            <FilePlus2 size={18} className="text-[hsl(30,12%,68%)] group-hover:text-[hsl(28,35%,42%)] transition-colors" />
                          </div>
                          <div className="text-center">
                            <p className="text-[11px] font-semibold text-[hsl(30,8%,50%)] group-hover:text-foreground transition-colors">Blank Design</p>
                            <p className="text-[9px] text-[hsl(30,8%,65%)] mt-0.5">Start fresh</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SavedDesignsModal;
