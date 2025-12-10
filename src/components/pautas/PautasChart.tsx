import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie } from "recharts";
import { Pauta } from "@/hooks/usePautasData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

interface PautasChartProps {
  pautas: Pauta[];
}

export const PautasChart = ({ pautas }: PautasChartProps) => {
  // === MÉTRICAS PRIMÁRIAS: PAUTAS ===
  const totalPautas = pautas.length;
  
  // Pautas por status (baseado nas ações)
  const pautasConcluidas = pautas.filter(p => p.totalAcoes > 0 && p.acoesConcluidas === p.totalAcoes).length;
  const pautasEmAndamento = pautas.filter(p => p.totalAcoes > 0 && p.acoesEmAndamento > 0 && p.acoesConcluidas !== p.totalAcoes).length;
  const pautasPendentes = pautas.filter(p => p.totalAcoes > 0 && p.acoesPendentes === p.totalAcoes).length;
  const pautasSemAcoes = pautas.filter(p => p.totalAcoes === 0).length;
  
  // Taxa de conclusão de pautas
  const pautasComAcoes = totalPautas - pautasSemAcoes;
  const taxaConclusaoPautas = pautasComAcoes > 0 ? Math.round((pautasConcluidas / pautasComAcoes) * 100) : 0;

  // Distribuição por território (quantidade de PAUTAS)
  const territorioData = pautas.reduce((acc, p) => {
    const existing = acc.find(item => item.territorio === p.territorio);
    if (existing) {
      existing.total += 1;
      if (p.totalAcoes > 0 && p.acoesConcluidas === p.totalAcoes) existing.concluidas += 1;
    } else {
      acc.push({
        territorio: p.territorio,
        total: 1,
        concluidas: p.totalAcoes > 0 && p.acoesConcluidas === p.totalAcoes ? 1 : 0,
      });
    }
    return acc;
  }, [] as Array<{ territorio: string; total: number; concluidas: number }>);

  territorioData.sort((a, b) => b.total - a.total);
  const top5Territorios = territorioData.slice(0, 5);

  // Dados para gráfico de pizza - Status das PAUTAS (sem "Sem Ações")
  const statusPautasData = [
    { name: 'Concluídas', value: pautasConcluidas, color: 'hsl(var(--success))' },
    { name: 'Em Andamento', value: pautasEmAndamento, color: 'hsl(var(--warning))' },
    { name: 'Pendentes', value: pautasPendentes, color: 'hsl(var(--danger))' },
  ].filter(item => item.value > 0);

  // Evolução de PAUTAS por mês
  const monthlyPautasData = pautas.reduce((acc, p) => {
    const month = format(new Date(p.dataReuniao), "MMM/yy", { locale: ptBR });
    const existing = acc.find(item => item.month === month);
    const isConcluida = p.totalAcoes > 0 && p.acoesConcluidas === p.totalAcoes;
    
    if (existing) {
      existing.total += 1;
      if (isConcluida) existing.concluidas += 1;
    } else {
      acc.push({
        month,
        total: 1,
        concluidas: isConcluida ? 1 : 0,
      });
    }
    return acc;
  }, [] as Array<{ month: string; total: number; concluidas: number }>);

  monthlyPautasData.sort((a, b) => a.month.localeCompare(b.month));

  // === MÉTRICAS SECUNDÁRIAS: APONTAMENTOS (resumo) ===
  const totalApontamentos = pautas.reduce((acc, p) => acc + p.totalAcoes, 0);
  const mediaApontamentosPorPauta = totalPautas > 0 ? (totalApontamentos / totalPautas).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Métricas Cards - PAUTAS como foco principal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total de Pautas - PRIMÁRIO */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total de Pautas</p>
                <p className="text-3xl sm:text-4xl font-bold text-primary">{totalPautas}</p>
                <p className="text-xs text-muted-foreground">
                  {totalApontamentos} apontamentos no total
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pautas Concluídas */}
        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Pautas Concluídas</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{pautasConcluidas}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                    {taxaConclusaoPautas}%
                  </span>
                  <span className="text-xs text-muted-foreground">das pautas</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pautas em Andamento */}
        <Card className="relative overflow-hidden border-l-4 border-l-amber-500">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Em Andamento</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-600">{pautasEmAndamento}</p>
                <p className="text-xs text-muted-foreground">
                  {pautasPendentes} pendentes
                </p>
              </div>
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Territórios */}
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Territórios</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{territorioData.length}</p>
                <p className="text-xs text-muted-foreground">
                  com pautas registradas
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Status das PAUTAS */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Status das Pautas</CardTitle>
            <p className="text-xs text-muted-foreground">Distribuição por status de conclusão</p>
          </CardHeader>
          <CardContent className="pt-0">
            {statusPautasData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusPautasData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPautasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} pautas`, '']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom"
                    formatter={(value, entry: any) => {
                      const item = statusPautasData.find(d => d.name === value);
                      return `${value} (${item?.value || 0})`;
                    }}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                Nenhuma pauta disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Barras - Pautas por Território */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pautas por Território</CardTitle>
            <p className="text-xs text-muted-foreground">Top 5 territórios com mais pautas</p>
          </CardHeader>
          <CardContent className="pt-0">
            {top5Territorios.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={top5Territorios} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis
                    dataKey="territorio"
                    type="category"
                    width={100}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    tickFormatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'total') return [`${value} pautas`, 'Total'];
                      if (name === 'concluidas') return [`${value} pautas`, 'Concluídas'];
                      return [value, name];
                    }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="total" name="Total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="concluidas" name="Concluídas" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                Nenhum território disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evolução de Pautas no tempo */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Evolução de Pautas</CardTitle>
            <p className="text-xs text-muted-foreground">Quantidade de pautas criadas e concluídas por mês</p>
          </CardHeader>
          <CardContent className="pt-0">
            {monthlyPautasData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyPautasData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    name="Total de Pautas"
                  />
                  <Area
                    type="monotone"
                    dataKey="concluidas"
                    stroke="hsl(var(--success))"
                    fill="hsl(var(--success))"
                    fillOpacity={0.5}
                    name="Pautas Concluídas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};