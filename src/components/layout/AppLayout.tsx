import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar, FileText, ListChecks, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AppLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    label: "Reuniões",
    href: "/",
    icon: Calendar,
    description: "Histórico e análise de reuniões",
  },
  {
    label: "Pautas",
    href: "/pautas",
    icon: FileText,
    description: "Pautas e discussões",
  },
  {
    label: "Apontamentos",
    href: "/apontamentos",
    icon: ListChecks,
    description: "Ações e acompanhamento",
  },
];

const SidebarContent = () => {
  const location = useLocation();

  return (
    <>
      <div className="p-6 border-b border-border bg-card">
        <h1 className="text-xl font-bold text-foreground">
          Gestão Territorial
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Sistema de gerenciamento
        </p>
      </div>
      <nav className="flex-1 p-4 bg-card">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 rounded-lg transition-smooth group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  <span className={cn(
                    "text-xs mt-0.5",
                    isActive 
                      ? "text-primary-foreground/90" 
                      : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 bg-card border-r border-border flex-col fixed h-full z-20 print:hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Header with Menu */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-30 flex items-center px-4 print:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-bold text-foreground">
          Gestão Territorial
        </h1>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30 safe-area-bottom print:hidden">
        <ul className="flex justify-around items-center h-16">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center h-full gap-1 transition-smooth px-2",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
                  <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="md:ml-72 pt-14 md:pt-0 pb-16 md:pb-0 print:ml-0 print:pt-0 print:pb-0">
        {children}
      </main>
    </div>
  );
};
