import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TerritoryFilter } from "@/components/dashboard/TerritoryFilter";
import { StatusFilter } from "@/components/dashboard/StatusFilter";
import { TerritoryMetricsChart } from "@/components/dashboard/TerritoryMetricsChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { ApontamentoTable } from "@/components/dashboard/ApontamentoTable";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  X,
  Loader2,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import { DashboardFilters, MetricasTerritoriais } from "@/types/dashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const { territorios, apontamentos, loading, error } = useDashboardData();
  const [filters, setFilters] = useState<DashboardFilters>({
    territorios: [],
    status: [],
  });

  const [showFilters, setShowFilters] = useState(true);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  // Filter apontamentos based on selected filters and active metric
  const filteredApontamentos = useMemo(() => {
    return apontamentos.filter((apontamento) => {
      if (filters.territorios.length > 0 && !filters.territorios.includes(apontamento.territorio)) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(apontamento.status)) {
        return false;
      }
      // Active metric filter
      if (activeMetric === 'pendentes' && apontamento.status !== 'Pendente') {
        return false;
      }
      if (activeMetric === 'emAndamento' && apontamento.status !== 'Em andamento') {
        return false;
      }
      if (activeMetric === 'concluidos' && apontamento.status !== 'Concluído') {
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
  }, [filters, activeMetric, apontamentos]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = filteredApontamentos.length;
    const pendentes = filteredApontamentos.filter((a) => a.status === "Pendente").length;
    const emAndamento = filteredApontamentos.filter((a) => a.status === "Em andamento").length;
    const concluidos = filteredApontamentos.filter((a) => a.status === "Concluído").length;

    return { total, pendentes, emAndamento, concluidos };
  }, [filteredApontamentos]);

  // Calculate territorial metrics
  const metricasTerritoriais: MetricasTerritoriais[] = useMemo(() => {
    const territoriosAtivos =
      filters.territorios.length > 0 ? filters.territorios : territorios.map((t) => t.nome);

    return territoriosAtivos.map((territorio) => {
      const apontamentosDoTerritorio = filteredApontamentos.filter((a) => a.territorio === territorio);
      const total = apontamentosDoTerritorio.length;
      const pendentes = apontamentosDoTerritorio.filter((a) => a.status === "Pendente").length;
      const emAndamento = apontamentosDoTerritorio.filter((a) => a.status === "Em andamento").length;
      const concluidos = apontamentosDoTerritorio.filter((a) => a.status === "Concluído").length;
      const percentualConclusao = total > 0 ? (concluidos / total) * 100 : 0;

      return {
        territorio,
        total,
        pendentes,
        emAndamento,
        concluidos,
        percentualConclusao,
      };
    });
  }, [filteredApontamentos, filters.territorios, territorios]);

  // Calculate status distribution
  const statusDistribution = useMemo(() => {
    return [
      { status: "Pendente", count: metrics.pendentes },
      { status: "Em andamento", count: metrics.emAndamento },
      { status: "Concluído", count: metrics.concluidos },
    ];
  }, [metrics]);

  const clearAllFilters = () => {
    setFilters({
      territorios: [],
      status: [],
    });
    setActiveMetric(null);
  };

  const handleMetricClick = (metric: string) => {
    setActiveMetric(activeMetric === metric ? null : metric);
  };

  const hasActiveFilters =
    filters.territorios.length > 0 ||
    filters.status.length > 0 ||
    filters.dataInicio ||
    filters.dataFim ||
    filters.responsavel ||
    filters.pauta;

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Erro ao carregar dados: {error}</AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-card/80 print:static print:shadow-none print:border-b-2">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                  <LayoutDashboard className="w-6 h-6 sm:w-7 sm:h-7 text-primary print:hidden" />
                  Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-1.5">
                  {metrics.total} {metrics.total === 1 ? 'apontamento' : 'apontamentos'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 print:hidden"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">{showFilters ? "Ocultar" : "Mostrar"}</span>
                <span className="sm:hidden">Filtros</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Sidebar - Filters */}
          {showFilters && (
            <aside className="lg:col-span-1 print:hidden">
              <Card className="p-4 sm:p-5 shadow-md sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                    Filtros
                  </h2>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-7 text-xs gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span className="hidden sm:inline">Limpar</span>
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  <TerritoryFilter
                    territorios={territorios}
                    selectedTerritorios={filters.territorios}
                    onTerritoriosChange={(territorios) =>
                      setFilters({ ...filters, territorios })
                    }
                  />

                  <Separator />

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Período</label>
                    <div className="space-y-2">
                      <Input
                        type="date"
                        value={filters.dataInicio || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, dataInicio: e.target.value })
                        }
                        className="text-sm"
                      />
                      <Input
                        type="date"
                        value={filters.dataFim || ""}
                        onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <Separator />

                  <StatusFilter
                    selectedStatus={filters.status}
                    onStatusChange={(status) => setFilters({ ...filters, status })}
                  />

                  <Separator />

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Responsável</label>
                    <Input
                      type="text"
                      placeholder="Nome do responsável..."
                      value={filters.responsavel || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, responsavel: e.target.value })
                      }
                      className="text-sm"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Pauta / Problema
                    </label>
                    <Input
                      type="text"
                      placeholder="Buscar..."
                      value={filters.pauta || ""}
                      onChange={(e) => setFilters({ ...filters, pauta: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>
              </Card>
            </aside>
          )}

          {/* Main Content */}
          <main className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="space-y-4 sm:space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 print:grid-cols-4 print:gap-2">
                <MetricCard
                  title="Total de Apontamentos"
                  value={metrics.total}
                  icon={FileText}
                  variant="default"
                  onClick={() => handleMetricClick('total')}
                  isActive={activeMetric === 'total'}
                />
                <MetricCard
                  title="Pendentes"
                  value={metrics.pendentes}
                  icon={Clock}
                  variant="danger"
                  onClick={() => handleMetricClick('pendentes')}
                  isActive={activeMetric === 'pendentes'}
                />
                <MetricCard
                  title="Em Andamento"
                  value={metrics.emAndamento}
                  icon={BarChart3}
                  variant="warning"
                  onClick={() => handleMetricClick('emAndamento')}
                  isActive={activeMetric === 'emAndamento'}
                />
                <MetricCard
                  title="Concluídos"
                  value={metrics.concluidos}
                  icon={CheckCircle2}
                  variant="success"
                  onClick={() => handleMetricClick('concluidos')}
                  isActive={activeMetric === 'concluidos'}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 print:grid-cols-2 print:gap-4">
                <StatusDistributionChart data={statusDistribution} />
                <TerritoryMetricsChart data={metricasTerritoriais} />
              </div>

              {/* Table */}
              <div>
                <div className="mb-3 sm:mb-4 print:mb-2">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold">Apontamentos Detalhados</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 print:text-xs">
                    {filteredApontamentos.length} resultado(s) encontrado(s)
                    {activeMetric && <span className="ml-2 text-primary font-medium print:hidden">(Filtrado)</span>}
                  </p>
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

export default Dashboard;
