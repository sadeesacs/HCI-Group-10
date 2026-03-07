import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilePlus2, FileText, Pencil, Trash2, FolderOpen } from "lucide-react";

interface DesignSlot {
  id: string;
  name: string | null;
}

const SLOTS: DesignSlot[] = [
  { id: "1", name: "Modern Living Setup" },
  { id: "2", name: "Compact Bedroom Plan" },
  { id: "3", name: "Dining Space A" },
  { id: "4", name: "Open Studio Layout" },
  { id: "5", name: null },
  { id: "6", name: null },
  { id: "7", name: null },
  { id: "8", name: null },
];

interface SavedDesignsModalProps {
  open: boolean;
  onOpenDesign: (id: string) => void;
  onNewDesign: () => void;
}

const SavedDesignsModal = ({ open, onOpenDesign, onNewDesign }: SavedDesignsModalProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!open) return null;

  const handleSlotClick = (slot: DesignSlot) => {
    if (deletingId === slot.id) return;
    if (slot.name) {
      onOpenDesign(slot.id);
    } else {
      onNewDesign();
    }
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
            className="w-full max-w-3xl rounded-2xl border border-[hsl(30,15%,88%)] bg-[hsl(40,25%,98%)] shadow-2xl"
          >
            {/* Header — centered */}
            <div className="px-8 pt-7 pb-2 text-center">
              <h2 className="text-lg font-semibold text-foreground tracking-tight">Choose a Design File</h2>
              <p className="text-[13px] text-muted-foreground mt-1">Open a saved project or start a new blank design.</p>
            </div>

            {/* 2×4 Grid */}
            <div className="px-8 pt-5 pb-8">
              <div className="grid grid-cols-4 gap-4">
                {SLOTS.map((slot, i) => {
                  const isFilled = !!slot.name;
                  const isDeleting = deletingId === slot.id;

                  return (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      onClick={() => handleSlotClick(slot)}
                      className={`relative flex flex-col items-center rounded-xl cursor-pointer transition-all duration-200 min-h-[160px] group
                        ${isFilled
                          ? "border border-[hsl(30,15%,85%)] bg-white shadow-[0_1px_4px_hsl(30,15%,28%,0.06)] hover:shadow-[0_4px_16px_hsl(30,15%,28%,0.1)] hover:border-[hsl(28,35%,42%)] hover:-translate-y-0.5"
                          : "border-2 border-dashed border-[hsl(30,12%,80%)] bg-[hsl(38,20%,96%)] hover:border-[hsl(28,35%,55%)] hover:bg-[hsl(38,22%,94%)] hover:-translate-y-0.5"
                        }
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => e.key === "Enter" && handleSlotClick(slot)}
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
                                onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}
                              >
                                Cancel
                              </button>
                              <button
                                className="h-7 px-3 text-[11px] font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}
                              >
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {isFilled ? (
                        <div className="flex flex-col items-center justify-between flex-1 w-full px-3 pt-5 pb-3">
                          <div className="flex flex-col items-center gap-2.5 flex-1">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(28,30%,92%)] ring-1 ring-[hsl(28,30%,82%)]">
                              <FileText size={20} className="text-[hsl(28,35%,32%)]" />
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] font-medium text-[hsl(30,10%,55%)] uppercase tracking-wider">File {slot.id}</span>
                              <p className="text-[12px] font-semibold text-foreground leading-snug mt-0.5 line-clamp-2">{slot.name}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 mt-3 w-full justify-center">
                            <button
                              className="h-6 px-2.5 text-[10px] font-semibold rounded-md bg-[hsl(28,35%,32%)] text-white hover:bg-[hsl(28,35%,26%)] transition-colors flex items-center gap-1 shadow-sm"
                              onClick={(e) => { e.stopPropagation(); onOpenDesign(slot.id); }}
                            >
                              <FolderOpen size={10} />Open
                            </button>
                            <button
                              className="h-6 px-2 text-[10px] font-medium rounded-md border border-[hsl(30,15%,85%)] bg-white hover:bg-[hsl(38,20%,96%)] transition-colors flex items-center gap-1"
                              onClick={(e) => { e.stopPropagation(); onOpenDesign(slot.id); }}
                            >
                              <Pencil size={10} />Edit
                            </button>
                            <button
                              className="h-6 w-6 flex items-center justify-center rounded-md text-[hsl(30,10%,65%)] hover:text-destructive hover:bg-destructive/10 transition-colors"
                              onClick={(e) => { e.stopPropagation(); setDeletingId(slot.id); }}
                              aria-label="Delete"
                            >
                              <Trash2 size={11} className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center flex-1 gap-2.5 px-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-dashed border-[hsl(30,12%,78%)] group-hover:border-[hsl(28,35%,55%)] transition-colors">
                            <FilePlus2 size={20} className="text-[hsl(30,12%,68%)] group-hover:text-[hsl(28,35%,42%)] transition-colors" />
                          </div>
                          <div className="text-center">
                            <p className="text-[12px] font-semibold text-[hsl(30,8%,50%)] group-hover:text-foreground transition-colors">Blank Design</p>
                            <p className="text-[10px] text-[hsl(30,8%,65%)] mt-0.5">Start fresh</p>
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
