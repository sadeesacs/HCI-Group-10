import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Undo2, Redo2, Save, ArrowLeft, Circle, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SavedDesignsModal from "@/components/designer/SavedDesignsModal";
import RoomSetupPanel from "@/components/designer/RoomSetupPanel";
import FurnitureLibraryPanel from "@/components/designer/FurnitureLibraryPanel";
import WorkspaceCenter, { useWorkspaceState } from "@/components/designer/WorkspaceCenter";
import PropertiesPanel from "@/components/designer/PropertiesPanel";
import ConfirmDialog from "@/components/designer/ConfirmDialog";

type SaveStatus = "saved" | "unsaved" | "saving";

const SAVE_LABELS: Record<SaveStatus, string> = {
  saved: "Saved",
  unsaved: "Unsaved changes",
  saving: "Saving…",
};

const Designer = () => {
  const navigate = useNavigate();
  const [showSavedDesigns, setShowSavedDesigns] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
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

  return (
    <div className="flex h-screen flex-col bg-[hsl(0,0%,97%)] overflow-hidden">
      <SavedDesignsModal
        open={showSavedDesigns}
        onOpenDesign={() => setShowSavedDesigns(false)}
        onNewDesign={() => setShowSavedDesigns(false)}
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
        {/* Left Sidebar */}
        <aside className="hidden w-80 shrink-0 border-r border-border bg-background lg:flex lg:flex-col">
          <Tabs defaultValue="room" className="flex flex-1 flex-col overflow-hidden">
            <div className="shrink-0 px-3 pt-3 pb-1">
              <TabsList className="w-full h-8 bg-accent/60 p-0.5 rounded-lg">
                <TabsTrigger
                  value="room"
                  className="flex-1 h-full text-[11px] font-semibold rounded-md data-[state=active]:bg-[hsl(28,35%,32%)] data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Room
                </TabsTrigger>
                <TabsTrigger
                  value="furniture"
                  className="flex-1 h-full text-[11px] font-semibold rounded-md data-[state=active]:bg-[hsl(28,35%,32%)] data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Furniture
                </TabsTrigger>
              </TabsList>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3">
                <TabsContent value="room" className="mt-0">
                  <RoomSetupPanel />
                </TabsContent>
                <TabsContent value="furniture" className="mt-0">
                  <FurnitureLibraryPanel />
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
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
