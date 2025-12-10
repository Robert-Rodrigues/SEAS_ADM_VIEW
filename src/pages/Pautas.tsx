import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PautasTable } from "@/components/pautas/PautasTable";
import { PautasChart } from "@/components/pautas/PautasChart";
import { usePautasData } from "@/hooks/usePautasData";
import { TerritoryFilter } from "@/components/dashboard/TerritoryFilter";
import { Loader2, AlertCircle, FileText, X, Filter } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ReportDialog } from "@/components/reports/ReportDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Pautas = () => {
  const { pautas, loading, error } = usePautasData();
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    territorios: [] as string[],
    dataInicio: "",
    dataFim: "",
    descricao: "",
    statusAcoes: "",
  });

  // Extract unique territories
  const territorios = useMemo(() => {
    const uniqueNames = Array.from(new Set(pautas.map((p) => p.territorio))).sort();
    return uniqueNames.map((nome, index) => ({ id: index.toString(), nome }));
  }, [pautas]);

  const filteredPautas = useMemo(() => {
    return pautas.filter((pauta) => {
      if (filters.territorios.length > 0 && !filters.territorios.includes(pauta.territorio)) {
        return false;
      }
      if (filters.dataInicio && new Date(pauta.dataReuniao) < new Date(filters.dataInicio)) {
        return false;
      }
      if (filters.dataFim && new Date(pauta.dataReuniao) > new Date(filters.dataFim)) {
        return false;
      }
      if (
        filters.descricao &&
        !pauta.descricao.toLowerCase().includes(filters.descricao.toLowerCase())
      ) {
        return false;
      }
      if (filters.statusAcoes) {
        if (filters.statusAcoes === "pendente" && pauta.acoesPendentes === 0) return false;
        if (filters.statusAcoes === "andamento" && pauta.acoesEmAndamento === 0) return false;
        if (filters.statusAcoes === "concluido" && pauta.acoesConcluidas === 0) return false;
      }
      return true;
    });
  }, [pautas, filters]);

  const clearAllFilters = () => {
    setFilters({
      territorios: [],
      dataInicio: "",
      dataFim: "",
      descricao: "",
      statusAcoes: "",
    });
  };

  const hasActiveFilters =
    filters.territorios.length > 0 ||
    filters.dataInicio ||
    filters.dataFim ||
    filters.descricao ||
    filters.statusAcoes;

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Carregando pautas...</p>
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
            <AlertDescription>Erro ao carregar pautas: {error}</AlertDescription>
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
                  <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-primary print:hidden" />
                  Pautas
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-1.5 truncate">
                  Análise de {filteredPautas.length} {filteredPautas.length === 1 ? 'pauta' : 'pautas'} discutida{filteredPautas.length === 1 ? '' : 's'} nas reuniões
                </p>
              </div>
              <div className="flex gap-2 print:hidden">
                <ReportDialog
                  type="pautas"
                  data={filteredPautas}
                  territorios={territorios.map((t) => t.nome)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">{showFilters ? "Ocultar" : "Mostrar"}</span>
                  <span className="sm:hidden">Filtros</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <aside className="lg:col-span-1 space-y-4 print:hidden">
                <Card className="p-3 sm:p-4 shadow-md sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
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
                          value={filters.dataInicio}
                          onChange={(e) =>
                            setFilters({ ...filters, dataInicio: e.target.value })
                          }
                          className="text-sm"
                        />
                        <Input
                          type="date"
                          value={filters.dataFim}
                          onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <Separator />

                     <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Status da Pauta</label>
                      <Select
                        value={filters.statusAcoes}
                        onValueChange={(value) =>
                          setFilters({ ...filters, statusAcoes: value })
                        }
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os status</SelectItem>
                          <SelectItem value="pendente">Pautas pendentes</SelectItem>
                          <SelectItem value="andamento">Pautas em andamento</SelectItem>
                          <SelectItem value="concluido">Pautas concluídas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Descrição</label>
                      <Input
                        type="text"
                        placeholder="Buscar na descrição..."
                        value={filters.descricao}
                        onChange={(e) =>
                          setFilters({ ...filters, descricao: e.target.value })
                        }
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
                {/* Charts */}
                <PautasChart pautas={filteredPautas} />

                {/* Table */}
                <div>
                  <h2 className="text-base sm:text-lg font-semibold mb-3 print:text-[12pt]">Lista de Pautas</h2>
                  <PautasTable pautas={filteredPautas} />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Pautas;
