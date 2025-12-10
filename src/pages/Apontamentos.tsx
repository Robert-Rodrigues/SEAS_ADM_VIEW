import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ApontamentoTable } from "@/components/dashboard/ApontamentoTable";
import { ApontamentosChart } from "@/components/apontamentos/ApontamentosChart";
import { ApontamentosMetrics } from "@/components/apontamentos/ApontamentosMetrics";
import { TerritoryFilter } from "@/components/dashboard/TerritoryFilter";
import { StatusFilter } from "@/components/dashboard/StatusFilter";
import { DashboardFilters } from "@/types/dashboard";
import { 
  ListChecks, 
  Filter, 
  X, 
  Loader2, 
  AlertCircle, 
  ChevronDown,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Apontamentos = () => {
  const { territorios, apontamentos, loading, error } = useDashboardData();
  const [filters, setFilters] = useState<DashboardFilters>({
    territorios: [],
    status: [],
  });

  const [showFilters, setShowFilters] = useState(true);
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    territorio: true,
    periodo: false,
    status: true,
    responsavel: false,
    pauta: false,
  });

  const filteredApontamentos = useMemo(() => {
    return apontamentos.filter((apontamento) => {
      if (filters.territorios.length > 0 && !filters.territorios.includes(apontamento.territorio)) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(apontamento.status)) {
        return false;
      }
      if (filters.dataInicio && new Date(apontamento.dataReuniao) < new Date(filters.dataInicio)) {
        return false;
      }
      if (filters.dataFim && new Date(apontamento.dataReuniao) > new Date(filters.dataFim)) {
        return false;
      }
      if (
        filters.responsavel &&
        !apontamento.responsaveis.toLowerCase().includes(filters.responsavel.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.pauta &&
        !apontamento.pauta.toLowerCase().includes(filters.pauta.toLowerCase()) &&
        !apontamento.problema.toLowerCase().includes(filters.pauta.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [filters, apontamentos]);

  const clearAllFilters = () => {
    setFilters({
      territorios: [],
      status: [],
    });
  };

  const hasActiveFilters =
    filters.territorios.length > 0 ||
    filters.status.length > 0 ||
    filters.dataInicio ||
    filters.dataFim ||
    filters.responsavel ||
    filters.pauta;

  const activeFiltersCount = [
    filters.territorios.length > 0,
    filters.status.length > 0,
    !!filters.dataInicio || !!filters.dataFim,
    !!filters.responsavel,
    !!filters.pauta,
  ].filter(Boolean).length;

  const toggleFilterSection = (section: keyof typeof expandedFilterSections) => {
    setExpandedFilterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <div className="absolute inset-0 w-12 h-12 mx-auto rounded-full bg-primary/20 animate-ping" />
            </div>
            <p className="text-muted-foreground animate-pulse">Carregando dados...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md animate-scale-in">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar dados: {error}
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-card/80 print:static print:shadow-none">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ListChecks className="w-5 h-5 sm:w-6 sm:h-6 text-primary print:hidden" />
                  </div>
                  Apontamentos
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    {filteredApontamentos.length}
                  </span>
                  apontamento{filteredApontamentos.length === 1 ? '' : 's'} 
                  {hasActiveFilters && (
                    <span className="text-primary font-medium">(filtrado)</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2 print:hidden">
                <ReportDialog
                  type="apontamentos"
                  data={filteredApontamentos}
                  territorios={territorios.map((t) => t.nome)}
                />
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "gap-2 transition-all",
                    showFilters && "shadow-md"
                  )}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">{showFilters ? "Ocultar" : "Filtros"}</span>
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-accent text-accent-foreground">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Sidebar - Filters */}
            {showFilters && (
              <aside className="lg:col-span-1 space-y-4 print:hidden animate-fade-in">
                <Card className="p-3 sm:p-4 shadow-md sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                      <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      Filtros
                    </h2>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-7 text-xs gap-1 text-danger hover:text-danger hover:bg-danger/10"
                      >
                        <X className="w-3 h-3" />
                        <span className="hidden sm:inline">Limpar</span>
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Território */}
                    <Collapsible 
                      open={expandedFilterSections.territorio}
                      onOpenChange={() => toggleFilterSection('territorio')}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-medium">Território</span>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          expandedFilterSections.territorio && "rotate-180"
                        )} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-2">
                        <TerritoryFilter
                          territorios={territorios}
                          selectedTerritorios={filters.territorios}
                          onTerritoriosChange={(territorios) =>
                            setFilters({ ...filters, territorios })
                          }
                        />
                      </CollapsibleContent>
                    </Collapsible>

                    <Separator />

                    {/* Período */}
                    <Collapsible 
                      open={expandedFilterSections.periodo}
                      onOpenChange={() => toggleFilterSection('periodo')}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-medium">Período</span>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          expandedFilterSections.periodo && "rotate-180"
                        )} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-2 space-y-2">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Data inicial</label>
                          <Input
                            type="date"
                            value={filters.dataInicio || ""}
                            onChange={(e) =>
                              setFilters({ ...filters, dataInicio: e.target.value })
                            }
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Data final</label>
                          <Input
                            type="date"
                            value={filters.dataFim || ""}
                            onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                            className="text-sm"
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Separator />

                    {/* Status */}
                    <Collapsible 
                      open={expandedFilterSections.status}
                      onOpenChange={() => toggleFilterSection('status')}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-medium">Status</span>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          expandedFilterSections.status && "rotate-180"
                        )} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-2">
                        <StatusFilter
                          selectedStatus={filters.status}
                          onStatusChange={(status) => setFilters({ ...filters, status })}
                        />
                      </CollapsibleContent>
                    </Collapsible>

                    <Separator />

                    {/* Responsável */}
                    <Collapsible 
                      open={expandedFilterSections.responsavel}
                      onOpenChange={() => toggleFilterSection('responsavel')}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-medium">Responsável</span>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          expandedFilterSections.responsavel && "rotate-180"
                        )} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Buscar responsável..."
                            value={filters.responsavel || ""}
                            onChange={(e) =>
                              setFilters({ ...filters, responsavel: e.target.value })
                            }
                            className="text-sm pl-9"
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Separator />

                    {/* Pauta / Problema */}
                    <Collapsible 
                      open={expandedFilterSections.pauta}
                      onOpenChange={() => toggleFilterSection('pauta')}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-medium">Pauta / Problema</span>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          expandedFilterSections.pauta && "rotate-180"
                        )} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Buscar..."
                            value={filters.pauta || ""}
                            onChange={(e) => setFilters({ ...filters, pauta: e.target.value })}
                            className="text-sm pl-9"
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </Card>
              </aside>
            )}

            {/* Main Content */}
            <main className={cn(
              "transition-all duration-300",
              showFilters ? "lg:col-span-3" : "lg:col-span-4"
            )}>
              <div className="space-y-4 sm:space-y-6">
                {/* Metrics Cards */}
                <ApontamentosMetrics apontamentos={filteredApontamentos} />

                {/* Charts */}
                <ApontamentosChart apontamentos={filteredApontamentos} />

                {/* Table */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base sm:text-lg font-semibold print:text-[12pt] flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-primary" />
                      Lista de Apontamentos
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {filteredApontamentos.length} registro{filteredApontamentos.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <ApontamentoTable apontamentos={filteredApontamentos} />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Apontamentos;
