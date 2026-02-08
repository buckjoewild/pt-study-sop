import { Layers, Map, Table2 } from "lucide-react";
import { AnkiIntegration } from "@/components/AnkiIntegration";
import { ConceptMapEditor } from "@/components/ConceptMapEditor";
import { ComparisonTableEditor } from "@/components/ComparisonTableEditor";
import type { BrainWorkspace } from "./useBrainWorkspace";

interface RightColumnProps {
  workspace: BrainWorkspace;
}

export function RightColumn({ workspace }: RightColumnProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Toggle header */}
      <div className="flex items-center gap-0 border-b border-primary/40 bg-black/40 shrink-0">
        <button
          onClick={() => workspace.setRightMode("map")}
          className={`flex items-center gap-1 px-3 py-1.5 font-arcade text-[10px] transition-colors ${
            workspace.rightMode === "map"
              ? "bg-primary text-black"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Map className="w-3 h-3" />
          MAP
        </button>
        <button
          onClick={() => workspace.setRightMode("table")}
          className={`flex items-center gap-1 px-3 py-1.5 font-arcade text-[10px] transition-colors ${
            workspace.rightMode === "table"
              ? "bg-primary text-black"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Table2 className="w-3 h-3" />
          TABLE
        </button>
        <button
          onClick={() => workspace.setRightMode("anki")}
          className={`flex items-center gap-1 px-3 py-1.5 font-arcade text-[10px] transition-colors ${
            workspace.rightMode === "anki"
              ? "bg-primary text-black"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="w-3 h-3" />
          ANKI
          {workspace.pendingDrafts.length > 0 && (
            <span className="ml-1 px-1 py-0 text-[8px] bg-secondary text-black font-arcade">
              {workspace.pendingDrafts.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        {workspace.rightMode === "map" ? (
          <ConceptMapEditor />
        ) : workspace.rightMode === "table" ? (
          <ComparisonTableEditor />
        ) : (
          <AnkiIntegration totalCards={workspace.metrics?.totalCards || 0} compact />
        )}
      </div>
    </div>
  );
}
