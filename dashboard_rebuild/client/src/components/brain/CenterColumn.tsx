import { MessageSquare, Pencil } from "lucide-react";
import { BrainChat } from "@/components/BrainChat";
import { VaultEditor } from "./VaultEditor";
import type { BrainWorkspace } from "./useBrainWorkspace";

interface CenterColumnProps {
  workspace: BrainWorkspace;
}

export function CenterColumn({ workspace }: CenterColumnProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Toggle header */}
      <div className="flex items-center gap-0 border-b border-primary/40 bg-black/40 shrink-0">
        <button
          onClick={() => workspace.setCenterMode("edit")}
          className={`flex items-center gap-1 px-3 py-1.5 font-arcade text-[10px] transition-colors ${
            workspace.centerMode === "edit"
              ? "bg-primary text-black"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Pencil className="w-3 h-3" />
          EDIT
        </button>
        <button
          onClick={() => workspace.setCenterMode("chat")}
          className={`flex items-center gap-1 px-3 py-1.5 font-arcade text-[10px] transition-colors ${
            workspace.centerMode === "chat"
              ? "bg-primary text-black"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="w-3 h-3" />
          CHAT
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {workspace.centerMode === "edit" ? (
          <VaultEditor workspace={workspace} />
        ) : (
          <BrainChat embedded />
        )}
      </div>
    </div>
  );
}
