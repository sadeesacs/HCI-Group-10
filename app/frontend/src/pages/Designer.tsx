import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Undo2, Redo2, Save, ArrowLeft, Circle, PanelRight, FolderOpen, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import SavedDesignsModal from "@/components/designer/SavedDesignsModal";
import RoomSetupWizard from "@/components/designer/RoomSetupWizard";
import FurnitureLibraryPanel from "@/components/designer/FurnitureLibraryPanel";
import WorkspaceCenter from "@/components/designer/WorkspaceCenter";
import { useWorkspaceState } from "@/components/designer/use-workspace-state";
import PropertiesPanel from "@/components/designer/PropertiesPanel";
import ConfirmDialog from "@/components/designer/ConfirmDialog";
import { useDesignFiles } from "@/hooks/use-design-files";
import type { DesignFile, RoomConfig } from "@/types/designer";

type SaveStatus = "saved" | "unsaved" | "saving";

const SAVE_LABELS: Record<SaveStatus, string> = {
  saved: "Saved",
  unsaved: "Unsaved changes",
  saving: "Saving…",
};

const Designer = () => {
  const navigate = useNavigate();
  const { slots, createDesign, renameDesign, deleteDesign, updateDesign } = useDesignFiles();
  const [activeDesign, setActiveDesign] = useState<DesignFile | null>(null);
  const [showFilePicker, setShowFilePicker] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const ws = useWorkspaceState();

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  useEffect(() => {
    if (ws.hasUnsavedChanges) setSaveStatus("unsaved");
  }, [ws.hasUnsavedChanges]);

  const handleSave = useCallback(() => {
    setSaveStatus("saving");
    setTimeout(() => {
      ws.handleSave();
      setSaveStatus("saved");
    }, 600);
  }, [ws]);

  const handleOpenDesign = useCallback((design: DesignFile) => {
    setActiveDesign(design);
    ws.loadDesign(design);
    setShowFilePicker(false);
  }, [ws]);

  const handleCreateDesign = useCallback((slotIndex: number) => {
    const design = createDesign(slotIndex);
    setActiveDesign(design);
    ws.loadDesign(design);
    setShowFilePicker(false);
    setShowWizard(true);
  }, [createDesign, ws]);

  const handleRenameDesign = useCallback((slotIndex: number, name: string) => {
    renameDesign(slotIndex, name);
    if (activeDesign?.slotIndex === slotIndex) {
      setActiveDesign((prev) => (prev ? { ...prev, name } : null));
    }
  }, [renameDesign, activeDesign?.slotIndex]);

  const handleDeleteDesign = useCallback((slotIndex: number) => {
    deleteDesign(slotIndex);
    if (activeDesign?.slotIndex === slotIndex) {
      setActiveDesign(null);
      setShowFilePicker(true);
    }
  }, [deleteDesign, activeDesign?.slotIndex]);

  const handleChangeFile = useCallback(() => {
    setShowFilePicker(true);
  }, []);

  const handleApplyRoom = useCallback((config: RoomConfig) => {
    ws.applyRoomConfig(config);
    // Sync to design slot
    if (activeDesign) {
      updateDesign(activeDesign.slotIndex, { roomConfig: config });
      setActiveDesign((prev) => prev ? { ...prev, roomConfig: config } : null);
    }
  }, [ws, activeDesign, updateDesign]);

  const handleWizardComplete = useCallback((config: RoomConfig) => {
    handleApplyRoom(config);
    setShowWizard(false);
  }, [handleApplyRoom]);

  const handleWizardCancel = useCallback(() => {
    setShowWizard(false);
  }, []);

  /* ── Room Setup Wizard (full-screen) ── */
  if (showWizard) {
    return (
      <RoomSetupWizard
        initialConfig={ws.roomConfig}
        onComplete={handleWizardComplete}
        onCancel={activeDesign ? handleWizardCancel : undefined}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[hsl(0,0%,97%)] overflow-hidden">
      <SavedDesignsModal
        open={showFilePicker}
        slots={slots}
        canClose={activeDesign !== null}
        onClose={() => setShowFilePicker(false)}
        onOpenDesign={handleOpenDesign}
        onCreateDesign={handleCreateDesign}
        onRenameDesign={handleRenameDesign}
        onDeleteDesign={handleDeleteDesign}
      />

      <ConfirmDialog
        open={!!ws.deleteConfirm}
        title="Remove item from room?"
        description={`Are you sure you want to remove "${ws.deleteConfirm?.name ?? ""}"? This action cannot be undone in the current session.`}
        confirmLabel="Remove"
        onConfirm={ws.confirmDelete}
        onCancel={ws.cancelDelete}
      />

      {/* ── Top Toolbar ── */}
      <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-3 lg:px-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="font-brand text-base font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Casa Ceylon
          </Link>
          <span className="text-border">|</span>
          <span className="text-sm font-medium text-foreground/70">Design Studio</span>
          {activeDesign && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 rounded-md text-[10px] font-medium text-foreground/50 hover:text-foreground hover:bg-accent px-2"
                onClick={handleChangeFile}
              >
                <FolderOpen size={12} />
                Change File
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 rounded-md text-[10px] font-medium text-foreground/50 hover:text-foreground hover:bg-accent px-2"
                onClick={() => setShowWizard(true)}
              >
                <Settings2 size={12} />
                Room Settings
              </Button>
            </>
          )}
        </div>

        {/* Save status */}
        <div className="hidden items-center gap-1.5 md:flex">
          <Circle
            size={5}
            className={`transition-colors ${
              saveStatus === "saved"
                ? "fill-emerald-500 text-emerald-500"
                : saveStatus === "saving"
                ? "fill-amber-400 text-amber-400 animate-pulse"
                : "fill-amber-500 text-amber-500"
            }`}
          />
          <span className={`text-[11px] font-medium ${
            saveStatus === "unsaved" ? "text-amber-600" : "text-muted-foreground"
          }`}>
            {SAVE_LABELS[saveStatus]}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-md ${ws.canUndo ? "text-foreground/60 hover:text-foreground hover:bg-accent" : "text-muted-foreground/30 cursor-not-allowed"}`}
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
            disabled={!ws.canUndo}
            onClick={ws.handleUndo}
          >
            <Undo2 size={15} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-md ${ws.canRedo ? "text-foreground/60 hover:text-foreground hover:bg-accent" : "text-muted-foreground/30 cursor-not-allowed"}`}
            aria-label="Redo"
            title="Redo (Ctrl+Shift+Z)"
            disabled={!ws.canRedo}
            onClick={ws.handleRedo}
          >
            <Redo2 size={15} />
          </Button>

          <div className="mx-1 h-4 w-px bg-border" />

          <Button
            variant={saveStatus === "unsaved" ? "default" : "outline"}
            size="sm"
            className={`h-7 gap-1.5 rounded-md text-[11px] font-medium px-3 ${
              saveStatus === "unsaved"
                ? "bg-[hsl(28,35%,32%)] text-white hover:bg-[hsl(28,35%,26%)]"
                : "border-border"
            }`}
            onClick={handleSave}
            disabled={saveStatus === "saving"}
          >
            <Save size={13} />
            {saveStatus === "saving" ? "Saving…" : "Save"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-foreground/60 hover:text-foreground hover:bg-accent"
            onClick={() => setShowRightPanel(!showRightPanel)}
            title="Toggle properties panel"
          >
            <PanelRight size={15} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 rounded-md text-[11px] text-foreground/60 hover:text-foreground hover:bg-accent px-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>
      </header>

      {/* ── Three-Column Layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Furniture Library */}
        <aside className="hidden w-80 shrink-0 border-r border-border bg-background lg:flex lg:flex-col">
          <div className="shrink-0 px-3 pt-3 pb-1">
            <div className="flex h-8 items-center rounded-lg bg-accent/60 px-3">
              <span className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider">Furniture Library</span>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3">
              <FurnitureLibraryPanel />
            </div>
          </ScrollArea>
        </aside>

        {/* Center Workspace */}
        <WorkspaceCenter
          viewMode={ws.viewMode}
          setViewMode={ws.setViewMode}
          furniture={ws.furniture}
          selectedId={ws.selectedId}
          setSelectedId={ws.setSelectedId}
          roomConfig={ws.roomConfig}
          handleFurnitureUpdate={ws.handleFurnitureUpdate}
          handleRotate={ws.handleRotate}
          handleDuplicate={ws.handleDuplicate}
          requestDelete={ws.requestDelete}
          handleReset={ws.handleReset}
          designName={activeDesign?.name}
          onRoomConfigChange={handleApplyRoom}
        />

        {/* Right Properties Panel */}
        {showRightPanel && (
          <PropertiesPanel
            selectionState={ws.selectionState}
            selectedItem={ws.selectedItem}
            roomConfig={ws.roomConfig}
            furniture={ws.furniture}
            onDuplicate={ws.handleDuplicate}
            onDelete={ws.requestDelete}
            onReset={ws.handleReset}
            onFurnitureUpdate={ws.handleFurnitureUpdate}
            onSave={handleSave}
            saveStatus={saveStatus}
          />
        )}
      </div>
    </div>
  );
};

export default Designer;
