import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Folder, File, ChevronRight, FileText, FolderOpen, Search,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BrainWorkspace } from "./useBrainWorkspace";

const COURSE_FOLDERS = [
  { name: "EBP", path: "School/Evidence Based Practice" },
  { name: "ExPhys", path: "School/Exercise Physiology" },
  { name: "MS1", path: "School/Movement Science 1" },
  { name: "Neuro", path: "School/Neuroscience" },
  { name: "TI", path: "School/Therapeutic Intervention" },
];

interface VaultSidebarProps {
  workspace: BrainWorkspace;
}

export function VaultSidebar({ workspace }: VaultSidebarProps) {
  const [currentFolder, setCurrentFolder] = useState("School");
  const [search, setSearch] = useState("");

  const { data: obsidianFiles } = useQuery({
    queryKey: ["obsidian", "files", currentFolder],
    queryFn: () => api.obsidian.getFiles(currentFolder),
    enabled: workspace.obsidianStatus?.connected === true,
  });

  const navigateToFolder = (folder: string) => {
    setCurrentFolder(folder);
  };

  const createNewNote = () => {
    const today = new Date().toISOString().split("T")[0];
    const newPath = currentFolder
      ? `${currentFolder}/Session-${today}.md`
      : `Session-${today}.md`;
    const template = `# Study Session - ${today}\n\n## Summary\n\n\n## Concepts Covered\n- \n\n## Notes\n\n`;
    workspace.setCurrentFile(newPath);
    workspace.setFileContent(template);
    workspace.setHasChanges(true);
  };

  const filteredFiles = useMemo(() => {
    const files = obsidianFiles?.files || [];
    if (!search.trim()) return files;
    const q = search.toLowerCase();
    return files.filter((file: string | { path: string }) => {
      const filePath = typeof file === "string" ? file : file.path;
      return filePath.toLowerCase().includes(q);
    });
  }, [obsidianFiles, search]);

  if (!workspace.obsidianStatus?.connected) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <FolderOpen className="w-6 h-6 text-red-500 mb-2" />
        <p className="font-terminal text-[10px] text-red-400 text-center">Obsidian Offline</p>
        <p className="font-terminal text-[9px] text-muted-foreground text-center mt-1">
          Open Obsidian with Local REST API
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search + New Note */}
      <div className="p-2 space-y-1.5 border-b border-primary/30">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="h-6 pl-6 text-[10px] font-terminal rounded-none border-secondary/50 bg-black/40"
          />
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full h-5 text-[9px] font-terminal rounded-none border-primary/50"
          onClick={createNewNote}
        >
          <FileText className="w-2.5 h-2.5 mr-1" />
          New Note
        </Button>
      </div>

      {/* Course quick-nav */}
      <div className="flex flex-col gap-0.5 p-1.5 border-b border-primary/30">
        {COURSE_FOLDERS.map((course) => (
          <button
            key={course.path}
            onClick={() => navigateToFolder(course.path)}
            className={`text-left px-2 py-1 text-[9px] font-terminal rounded-none transition-colors ${
              currentFolder === course.path
                ? "bg-primary/20 text-primary border-l-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
            }`}
          >
            {course.name}
          </button>
        ))}
      </div>

      {/* Breadcrumb */}
      {currentFolder && (
        <div className="flex items-center gap-0.5 px-2 py-1 font-terminal text-[9px] text-muted-foreground border-b border-secondary/20 flex-wrap">
          <button onClick={() => navigateToFolder("")} className="hover:text-primary">
            vault
          </button>
          {currentFolder.split("/").map((part, i, arr) => (
            <span key={i} className="flex items-center gap-0.5">
              <ChevronRight className="w-2 h-2" />
              <button
                onClick={() => navigateToFolder(arr.slice(0, i + 1).join("/"))}
                className="hover:text-primary"
              >
                {part}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* File tree */}
      <ScrollArea className="flex-1">
        <div className="p-1 space-y-0.5">
          {currentFolder && (
            <button
              onClick={() => {
                const parts = currentFolder.split("/");
                parts.pop();
                navigateToFolder(parts.join("/"));
              }}
              className="w-full flex items-center gap-1.5 px-2 py-1 hover:bg-secondary/20 font-terminal text-[10px] text-muted-foreground"
            >
              <Folder className="w-3 h-3" />
              ..
            </button>
          )}
          {filteredFiles.map((file: string | { path: string }) => {
            const filePath = typeof file === "string" ? file : file.path;
            const isFolder = filePath.endsWith("/");
            const name = filePath.replace(/\/$/, "").split("/").pop() || filePath;
            const isActive = workspace.currentFile?.endsWith(name);
            return (
              <button
                key={filePath}
                onClick={() => {
                  if (isFolder) {
                    const cleanName = name.replace(/\/$/, "");
                    navigateToFolder(currentFolder ? `${currentFolder}/${cleanName}` : cleanName);
                  } else {
                    const fullPath = currentFolder ? `${currentFolder}/${name}` : name;
                    workspace.openFile(fullPath);
                  }
                }}
                className={`w-full flex items-center gap-1.5 px-2 py-1 hover:bg-secondary/20 font-terminal text-[10px] ${
                  isActive ? "bg-primary/20 text-primary" : ""
                }`}
              >
                {isFolder ? (
                  <Folder className="w-3 h-3 text-yellow-500 shrink-0" />
                ) : (
                  <File className="w-3 h-3 text-blue-400 shrink-0" />
                )}
                <span className="truncate">{name}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
