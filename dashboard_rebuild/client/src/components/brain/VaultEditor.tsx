import { Button } from "@/components/ui/button";
import { ObsidianRenderer } from "@/components/ObsidianRenderer";
import { Save, ExternalLink, FileText } from "lucide-react";
import type { BrainWorkspace } from "./useBrainWorkspace";

interface VaultEditorProps {
  workspace: BrainWorkspace;
}

export function VaultEditor({ workspace }: VaultEditorProps) {
  if (!workspace.currentFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground font-terminal text-xs gap-2">
        <FileText className="w-8 h-8 opacity-30" />
        <p>Select a file from the vault sidebar</p>
        <p className="text-[10px]">or create a new note</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* File toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-secondary/30 bg-black/40">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-terminal text-xs text-primary truncate">
            {workspace.currentFile.split("/").pop()}
            {workspace.hasChanges && <span className="text-yellow-500 ml-1">*</span>}
          </span>
          <button
            onClick={() => {
              const vaultName = workspace.obsidianConfig?.vaultName || "Treys School";
              const fp = workspace.currentFile!.replace(/\.md$/, "");
              window.open(
                `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(fp)}`,
                "_blank"
              );
            }}
            className="text-muted-foreground hover:text-primary shrink-0"
            title="Open in Obsidian"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-5 px-2 text-[10px] font-terminal"
            onClick={() => workspace.setPreviewMode(!workspace.previewMode)}
          >
            {workspace.previewMode ? "Edit" : "Preview"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={workspace.saveFile}
            disabled={!workspace.hasChanges || workspace.isSaving}
            className="h-5 px-2 text-[10px] font-terminal"
          >
            <Save className="w-3 h-3 mr-1" />
            {workspace.isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Content area */}
      {workspace.previewMode ? (
        <div className="flex-1 p-3 bg-black/60 font-terminal overflow-y-auto">
          <ObsidianRenderer
            content={workspace.fileContent}
            onWikilinkClick={workspace.handleWikilinkClick}
          />
        </div>
      ) : (
        <textarea
          value={workspace.fileContent}
          onChange={(e) => workspace.setFileContent(e.target.value)}
          className="flex-1 w-full p-3 bg-black/60 font-terminal text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary overflow-y-auto min-h-[200px]"
          placeholder="File content..."
          style={{ height: "100%" }}
        />
      )}
    </div>
  );
}
