import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type CenterMode = "edit" | "chat";
export type RightMode = "map" | "table" | "anki";

function loadState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) return JSON.parse(saved) as T;
  } catch { /* corrupted — fall through */ }
  return fallback;
}

function saveState(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota — ignore */ }
}

export function useBrainWorkspace() {
  const [centerMode, setCenterModeRaw] = useState<CenterMode>(
    () => loadState<CenterMode>("brain-center-mode", "edit")
  );
  const [rightMode, setRightModeRaw] = useState<RightMode>(
    () => loadState<RightMode>("brain-right-mode", "map")
  );
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal states
  const [importOpen, setImportOpen] = useState(false);
  const [graphOpen, setGraphOpen] = useState(false);

  const setCenterMode = useCallback((mode: CenterMode) => {
    setCenterModeRaw(mode);
    saveState("brain-center-mode", mode);
  }, []);

  const setRightMode = useCallback((mode: RightMode) => {
    setRightModeRaw(mode);
    saveState("brain-right-mode", mode);
  }, []);

  // Shared queries
  const { data: obsidianStatus } = useQuery({
    queryKey: ["obsidian", "status"],
    queryFn: api.obsidian.getStatus,
    refetchInterval: 30000,
  });

  const { data: obsidianConfig } = useQuery({
    queryKey: ["obsidian", "config"],
    queryFn: api.obsidian.getConfig,
  });

  const { data: vaultIndex } = useQuery({
    queryKey: ["obsidian", "vault-index"],
    queryFn: () => api.obsidian.getVaultIndex(),
    enabled: obsidianStatus?.connected === true,
  });

  const { data: ankiStatus } = useQuery({
    queryKey: ["anki", "status"],
    queryFn: api.anki.getStatus,
    refetchInterval: 30000,
  });

  const { data: metrics } = useQuery({
    queryKey: ["brain", "metrics"],
    queryFn: api.brain.getMetrics,
  });

  const { data: ankiDrafts = [] } = useQuery({
    queryKey: ["anki", "drafts"],
    queryFn: api.anki.getDrafts,
  });

  const pendingDrafts = ankiDrafts.filter(d => d.status === "pending");

  // File operations
  const openFile = useCallback(async (path: string) => {
    try {
      const result = await api.obsidian.getFile(path);
      if (result.success && result.content !== undefined) {
        setCurrentFile(path);
        setFileContent(result.content);
        setHasChanges(false);
        setPreviewMode(false);
      }
    } catch (error) {
      console.error("Failed to load file:", error);
    }
  }, []);

  const saveFile = useCallback(async () => {
    if (!currentFile) return;
    setIsSaving(true);
    try {
      const result = await api.obsidian.saveFile(currentFile, fileContent);
      if (result.success) {
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Failed to save file:", error);
    } finally {
      setIsSaving(false);
    }
  }, [currentFile, fileContent]);

  const updateContent = useCallback((content: string) => {
    setFileContent(content);
    setHasChanges(true);
  }, []);

  const COURSE_FOLDERS = [
    "School/Evidence Based Practice",
    "School/Exercise Physiology",
    "School/Movement Science 1",
    "School/Neuroscience",
    "School/Therapeutic Intervention",
  ];

  const handleWikilinkClick = useCallback(async (noteName: string, shiftKey: boolean) => {
    if (shiftKey) {
      const vaultName = obsidianConfig?.vaultName || "Treys School";
      window.open(
        `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(noteName)}`,
        "_blank"
      );
      return;
    }
    // Try vault index first
    const fullPath = vaultIndex?.paths?.[noteName];
    if (fullPath) {
      await openFile(fullPath);
      setPreviewMode(true);
      return;
    }
    // Try course folders
    for (const cf of COURSE_FOLDERS) {
      try {
        const result = await api.obsidian.getFile(`${cf}/${noteName}.md`);
        if (result.success && result.content !== undefined) {
          setCurrentFile(`${cf}/${noteName}.md`);
          setFileContent(result.content);
          setHasChanges(false);
          setPreviewMode(true);
          return;
        }
      } catch { /* continue */ }
    }
    console.warn(`Note not found: ${noteName}`);
  }, [obsidianConfig, vaultIndex, openFile]);

  return {
    // Column modes
    centerMode, setCenterMode,
    rightMode, setRightMode,

    // File state
    currentFile, setCurrentFile,
    fileContent, setFileContent: updateContent,
    hasChanges, setHasChanges,
    previewMode, setPreviewMode,
    isSaving,
    openFile, saveFile,

    // Modals
    importOpen, setImportOpen,
    graphOpen, setGraphOpen,

    // Wikilink navigation
    handleWikilinkClick,

    // Shared data
    obsidianStatus,
    obsidianConfig,
    vaultIndex,
    ankiStatus,
    metrics,
    ankiDrafts,
    pendingDrafts,
  };
}

export type BrainWorkspace = ReturnType<typeof useBrainWorkspace>;
