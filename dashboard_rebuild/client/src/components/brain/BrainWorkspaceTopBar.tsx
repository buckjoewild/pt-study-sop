import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, Circle, ArrowRight,
  Download,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BrainWorkspace } from "./useBrainWorkspace";

const FLOW_STEPS = [
  { id: "study", label: "Study", tab: null, section: null },
  { id: "wrap", label: "Wrap", tab: null, section: null },
  { id: "generate", label: "Generate JSON", tab: null, section: null },
  { id: "attach", label: "Attach JSON", tab: null, section: null },
  { id: "planner", label: "Planner", tab: null, section: null },
  { id: "actions", label: "Actions", tab: null, section: null },
] as const;

interface BrainWorkspaceTopBarProps {
  workspace: BrainWorkspace;
}

export function BrainWorkspaceTopBar({ workspace }: BrainWorkspaceTopBarProps) {
  const [dropHighlight, setDropHighlight] = useState(false);

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions"],
    queryFn: api.sessions.getAll,
  });

  const { data: plannerQueue = [] } = useQuery({
    queryKey: ["planner-queue"],
    queryFn: api.planner.getQueue,
  });

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const isToday = (d: Date | string) => {
    const date = typeof d === "string" ? new Date(d) : d;
    const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return ds === todayStr;
  };

  const hasRecentSession = sessions.some(
    (s: { date: Date }) => isToday(s.date)
  );
  const hasPlannerTasks = plannerQueue.length > 0;
  const hasJsonAttached = sessions.some(
    (s: { date: Date; cards: number }) => isToday(s.date) && s.cards > 0
  );

  const stepDone: Record<string, boolean> = {
    study: hasRecentSession,
    wrap: hasRecentSession,
    generate: hasJsonAttached,
    attach: hasJsonAttached,
    planner: hasPlannerTasks,
    actions: hasPlannerTasks,
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropHighlight(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      workspace.setImportOpen(true);
    }
  }, [workspace]);

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 border-b-2 border-primary/50 bg-black/60 flex-wrap ${
        dropHighlight ? "ring-2 ring-primary" : ""
      }`}
      onDragOver={(e) => { e.preventDefault(); setDropHighlight(true); }}
      onDragLeave={() => setDropHighlight(false)}
      onDrop={handleDrop}
    >
      {/* Flow steps — compact */}
      <div className="flex items-center gap-0.5 mr-2">
        {FLOW_STEPS.map((step, i) => {
          const done = stepDone[step.id] ?? false;
          return (
            <div key={step.id} className="flex items-center gap-0.5">
              <div
                className={`flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-terminal ${
                  done ? "text-green-400" : "text-muted-foreground"
                }`}
                title={step.label}
              >
                {done ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
                <span className="hidden xl:inline">{step.label}</span>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <ArrowRight className="w-2 h-2 text-muted-foreground/50" />
              )}
            </div>
          );
        })}
      </div>

      {/* Separator */}
      <div className="w-px h-5 bg-primary/30" />

      {/* Action buttons */}
      <Button
        size="sm"
        variant="outline"
        className="h-6 px-2 rounded-none font-terminal text-xs border-primary/50"
        onClick={() => workspace.setImportOpen(true)}
      >
        <Download className="w-3 h-3 mr-1" />
        Import
      </Button>

      {/* Status badges — right-aligned */}
      <div className="flex items-center gap-3 ml-auto font-terminal text-xs">
        <div className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${workspace.obsidianStatus?.connected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-muted-foreground">Obsidian</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${workspace.ankiStatus?.connected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-muted-foreground">Anki</span>
        </div>
        {workspace.pendingDrafts.length > 0 && (
          <Badge variant="outline" className="h-5 px-1.5 text-xs rounded-none border-secondary/50 text-secondary">
            {workspace.pendingDrafts.length} drafts
          </Badge>
        )}
      </div>
    </div>
  );
}
