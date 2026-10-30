import { useEffect, useState, type ReactNode } from "react";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const KEY = "dyvin-sidebar-collapsed";

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(KEY) === "1");
  }, []);

  // Strict viewport lock: prevent browser window/body from scrolling when inside the workspace
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  const toggle = () => {
    setCollapsed((c) => {
      localStorage.setItem(KEY, c ? "0" : "1");
      return !c;
    });
  };

  return (
    <TooltipProvider delayDuration={120}>
      {/* Root Viewport Frame: Fixed viewport bounds, strictly zero outer-window scrolling */}
      <div className="fixed inset-0 flex h-screen w-full overflow-hidden bg-background text-foreground antialiased selection:bg-brand/20 overscroll-none">
        
        {/* Desktop Fixed Left Navigation Rail (Always 100vh, isolated from page scroll) */}
        <aside
          className={cn(
            "hidden lg:flex flex-col h-full shrink-0 border-r border-sidebar-border bg-sidebar overflow-hidden z-30 transition-[width] duration-200 ease-out",
            collapsed ? "w-16" : "w-[240px]",
          )}
        >
          <AppSidebar collapsed={collapsed} />
        </aside>

        {/* Main Application Column */}
        <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden bg-background">
          
          {/* Mobile Navigation Header & Sheet */}
          <div className="lg:hidden shrink-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 py-2.5">
            <Sheet>
              <div className="flex h-10 items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-9 cursor-pointer" aria-label="Open navigation">
                      <Menu className="size-4" />
                    </Button>
                  </SheetTrigger>
                  <span className="truncate text-sm font-semibold tracking-tight text-foreground">{title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <img
                    src="/dyvin-logo-black.png"
                    alt="Dyvin AI"
                    className="size-6 object-contain dark:hidden"
                  />
                  <img
                    src="/dyvin-logo-white.png"
                    alt="Dyvin AI"
                    className="hidden size-6 object-contain dark:block"
                  />
                </div>
              </div>
              <SheetContent side="left" className="w-[260px] p-0 border-r border-border bg-sidebar h-full">
                <SheetTitle className="sr-only">Dyvin Navigation</SheetTitle>
                <AppSidebar collapsed={false} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Fixed Header Toolbar (Fixed at top, never scrolls away) */}
          <div className="hidden lg:block shrink-0 h-14 z-20 border-b border-border bg-background/90 backdrop-blur">
            <Header collapsed={collapsed} onToggleSidebar={toggle} title={title} />
          </div>

          {/* Independently Scrollable Workspace Content with smooth scrolling */}
          <main
            tabIndex={-1}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar focus:outline-none overscroll-contain scroll-smooth"
          >
            <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8 space-y-8 pb-16">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
