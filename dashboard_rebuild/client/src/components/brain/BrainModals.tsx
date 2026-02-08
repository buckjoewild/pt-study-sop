import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IngestionTab } from "@/components/IngestionTab";
import { VaultGraphView } from "@/components/VaultGraphView";
import { MindMapView } from "@/components/MindMapView";
import { Download, Network } from "lucide-react";
import { useState, Component, type ReactNode } from "react";
import type { BrainWorkspace } from "./useBrainWorkspace";

// Simple error boundary so a crash in VaultGraphView doesn't break the whole page
class GraphErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(err: Error) {
    return { error: err.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
          <p className="font-arcade text-[10px] text-red-400">GRAPH RENDER ERROR</p>
          <p className="font-terminal text-[10px] text-muted-foreground text-center">{this.state.error}</p>
          <button
            className="font-terminal text-xs text-primary underline"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface BrainModalsProps {
  workspace: BrainWorkspace;
}

export function BrainModals({ workspace }: BrainModalsProps) {
  const [graphTab, setGraphTab] = useState<"vault" | "mindmap">("vault");

  return (
    <>
      {/* Import / Ingestion modal */}
      <Dialog open={workspace.importOpen} onOpenChange={workspace.setImportOpen}>
        <DialogContent
          data-modal="brain-import"
          className="max-w-2xl bg-black border-2 border-primary rounded-none"
          style={{ zIndex: 100005 }}
        >
          <DialogHeader>
            <DialogTitle className="font-arcade text-sm text-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              IMPORT / INGEST
            </DialogTitle>
            <DialogDescription className="font-terminal text-xs text-muted-foreground">
              Import study materials, JSON session data, or documents into the system.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <IngestionTab />
          </div>
        </DialogContent>
      </Dialog>

      {/* Graph modal — full screen */}
      <Dialog open={workspace.graphOpen} onOpenChange={workspace.setGraphOpen}>
        <DialogContent
          data-modal="brain-graph"
          className="max-w-[95vw] w-full h-[85vh] bg-black border-2 border-primary rounded-none p-0"
          style={{ zIndex: 100005 }}
        >
          <DialogHeader className="p-3 border-b border-primary/30">
            <DialogTitle className="font-arcade text-sm text-primary flex items-center gap-2">
              <Network className="w-4 h-4" />
              KNOWLEDGE GRAPH
              <div className="flex items-center gap-0 ml-4 bg-secondary/20 border border-secondary/40 rounded-none overflow-hidden">
                <button
                  onClick={() => setGraphTab("vault")}
                  className={`px-3 py-1 font-arcade text-[10px] transition-colors ${
                    graphTab === "vault" ? "bg-primary text-black" : "text-muted-foreground"
                  }`}
                >
                  VAULT
                </button>
                <button
                  onClick={() => setGraphTab("mindmap")}
                  className={`px-3 py-1 font-arcade text-[10px] transition-colors ${
                    graphTab === "mindmap" ? "bg-primary text-black" : "text-muted-foreground"
                  }`}
                >
                  MIND MAP
                </button>
              </div>
            </DialogTitle>
            <DialogDescription className="font-terminal text-xs text-muted-foreground">
              Visualize connections between your vault notes and study topics.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 h-[calc(85vh-80px)]">
            <GraphErrorBoundary>
              {graphTab === "vault" ? <VaultGraphView /> : <MindMapView />}
            </GraphErrorBoundary>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
