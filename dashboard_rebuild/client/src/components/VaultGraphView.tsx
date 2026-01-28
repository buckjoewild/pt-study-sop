import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { api } from "@/lib/api";

interface GraphNode {
  id: string;
  name: string;
  folder: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface VaultGraphViewProps {
  onNodeClick?: (noteName: string) => void;
}

const FOLDER_COLORS: Record<string, string> = {
  "": "#6366f1",
  "School": "#22d3ee",
  "Clinical": "#f472b6",
  "Research": "#a78bfa",
  "Personal": "#34d399",
};

function getFolderColor(folder: string): string {
  const top = folder.split("/")[0];
  return FOLDER_COLORS[top] || "#6366f1";
}

export function VaultGraphView({ onNodeClick }: VaultGraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ReturnType<typeof ForceGraph2D> extends React.ComponentType<infer P> ? P : never>();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setDimensions({ width: Math.floor(rect.width) - 2, height: Math.floor(rect.height) - 2 });
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.obsidian.getGraph().then((data) => {
      if (cancelled) return;
      if (data.success) {
        setGraphData({ nodes: data.nodes, links: data.links });
      } else {
        setError("Failed to load graph data");
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setError("Network error loading graph");
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    onNodeClick?.(node.name);
  }, [onNodeClick]);

  const handleZoom = useCallback((val: number) => {
    const clamped = Math.max(0.1, Math.min(10, val));
    setZoomLevel(clamped);
    const fg = graphRef.current as any;
    if (fg?.zoom) {
      fg.zoom(clamped, 200);
    }
  }, []);

  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = Math.max(10 / globalScale, 2);
    const nodeR = Math.max(4, 3 + (graphData.links.filter(
      (l) => (typeof l.source === "string" ? l.source : l.source.id) === node.id ||
             (typeof l.target === "string" ? l.target : l.target.id) === node.id
    ).length * 0.5));

    const color = getFolderColor(node.folder);
    const isHovered = hoveredNode?.id === node.id;

    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, nodeR, 0, 2 * Math.PI);
    ctx.fillStyle = isHovered ? "#ffffff" : color;
    ctx.fill();

    if (isHovered || globalScale > 1.5) {
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(label, node.x || 0, (node.y || 0) + nodeR + 2);
    }
  }, [graphData.links, hoveredNode]);

  const ready = !loading && !error && dimensions;

  return (
    <div ref={containerRef} className="w-full h-full relative bg-black/80 rounded border border-primary/30 overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-primary font-terminal z-10">
          <div className="animate-pulse">SCANNING VAULT CONNECTIONS...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 font-terminal z-10">
          {error}
        </div>
      )}
      {ready && (
        <>
          <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="text-xs font-terminal text-primary/70">
                {graphData.nodes.length} notes | {graphData.links.length} links
              </span>
              <button
                onClick={() => {
                  (graphRef.current as any)?.zoomToFit?.(400, 40);
                  setTimeout(() => {
                    const fg = graphRef.current as any;
                    if (fg?.zoom) setZoomLevel(fg.zoom());
                  }, 450);
                }}
                className="px-2 py-0.5 text-xs font-terminal bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 rounded-none"
              >
                CENTER
              </button>
            </div>
            <div className="flex items-center gap-1.5 pointer-events-auto bg-black/70 border border-primary/30 rounded-none px-2 py-1">
              <button
                onClick={() => handleZoom(zoomLevel / 1.3)}
                className="text-primary hover:text-white font-mono text-sm w-5 h-5 flex items-center justify-center"
              >
                -
              </button>
              <input
                type="range"
                min={-2.3}
                max={2.3}
                step={0.01}
                value={Math.log(zoomLevel)}
                onChange={(e) => handleZoom(Math.exp(parseFloat(e.target.value)))}
                className="w-24 h-1 accent-primary cursor-pointer"
              />
              <button
                onClick={() => handleZoom(zoomLevel * 1.3)}
                className="text-primary hover:text-white font-mono text-sm w-5 h-5 flex items-center justify-center"
              >
                +
              </button>
              <span className="text-[10px] font-terminal text-primary/50 w-8 text-right">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
          </div>
          <ForceGraph2D
            ref={graphRef as React.MutableRefObject<never>}
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            nodeCanvasObject={nodeCanvasObject}
            nodePointerAreaPaint={(node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
              ctx.beginPath();
              ctx.arc(node.x || 0, node.y || 0, 6, 0, 2 * Math.PI);
              ctx.fillStyle = color;
              ctx.fill();
            }}
            onNodeClick={handleNodeClick}
            onNodeHover={(node: GraphNode | null) => setHoveredNode(node)}
            onZoom={({ k }: { k: number }) => setZoomLevel(k)}
            linkColor={() => "rgba(99, 102, 241, 0.15)"}
            linkWidth={0.5}
            backgroundColor="transparent"
            cooldownTicks={100}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
          />
        </>
      )}
    </div>
  );
}
