import { Link, useLocation } from "wouter";
import { useState } from "react";
import { LayoutDashboard, Brain, Calendar, GraduationCap, Bot, Menu, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import arcadeBg from "@assets/generated_images/dark_retro_arcade_grid_background_texture.png";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/", label: "DASHBOARD", icon: LayoutDashboard },
  { path: "/brain", label: "BRAIN", icon: Brain },
  { path: "/calendar", label: "CALENDAR", icon: Calendar },
  { path: "/scholar", label: "SCHOLAR", icon: GraduationCap },
  { path: "/tutor", label: "TUTOR", icon: Bot },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const currentPath = location === "/" ? "/" : "/" + location.split("/")[1];

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col font-terminal">
      {/* Background with overlay */}
      <div
        className="fixed inset-0 z-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url(${arcadeBg})`,
          backgroundSize: '300px'
        }}
      />
      <div className="fixed inset-0 z-10 crt-overlay pointer-events-none" />

      {/* Top Nav */}
      <header className="relative z-20 border-b-4 border-primary bg-black/80 backdrop-blur-sm sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 bg-primary animate-pulse" />
                <span className="font-arcade text-xl text-white group-hover:text-primary transition-colors">PT_STUDY</span>
              </div>
            </Link>

            <nav className="hidden md:flex gap-1">
              {NAV_ITEMS.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={location === item.path ? "default" : "ghost"}
                    className={cn(
                      "font-arcade rounded-none h-10 px-4 text-xs transition-all hover:bg-primary/20",
                      location === item.path && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="font-arcade rounded-none border-2">
                  NOTES
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-black border-l-4 border-primary w-[300px] sm:w-[500px]">
                <SheetTitle className="font-arcade text-primary mb-4">QUICK_NOTES</SheetTitle>
                <div className="flex flex-col h-full pb-8 gap-4">
                  <NotesEditor />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto p-4 md:p-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-secondary bg-black/95 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs text-muted-foreground font-terminal">
          <div className="flex gap-4">
            <span>STATUS: <span className="text-primary">ONLINE</span></span>
            <span>SYNC: <span className="text-white">09:41 AM</span></span>
          </div>
          <div>v2.0.25 [BETA]</div>
        </div>
      </footer>
      {/* Footer spacer */}
      <div className="h-10" />
    </div>
  );
}

import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

function NotesEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data } = useQuery({
    queryKey: ["notes"],
    queryFn: api.notes.get,
    staleTime: 0,
  });

  const saveMutation = useMutation({
    mutationFn: api.notes.save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({ title: "NOTES_SAVED", variant: "default" });
    },
  });

  // Load content into textarea when data arrives
  useEffect(() => {
    if (data && textareaRef.current) {
      textareaRef.current.value = data.content;
    }
  }, [data]);

  return (
    <>
      <Textarea
        ref={textareaRef}
        placeholder="TYPE_NOTES_HERE..."
        className="flex-1 bg-secondary/20 border-2 border-secondary font-terminal text-lg rounded-none resize-none focus-visible:ring-primary text-white"
      />
      <Button
        className="w-full font-arcade rounded-none hover:bg-primary/90"
        onClick={() => {
          if (textareaRef.current) {
            saveMutation.mutate(textareaRef.current.value);
          }
        }}
        disabled={saveMutation.isPending}
      >
        <Save className="w-4 h-4 mr-2" /> {saveMutation.isPending ? "SAVING..." : "SAVE"}
      </Button>
    </>
  );
}
