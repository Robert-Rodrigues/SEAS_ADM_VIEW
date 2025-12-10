import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell, 
  PieChart, 
  Pie,
  AreaChart,
  Area
} from "recharts";
import { Apontamento } from "@/types/dashboard";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PieChartIcon, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApontamentosChartProps {
  apontamentos: Apontamento[];
}

const STATUS_COLORS = {
  'Pendente': 'hsl(var(--danger))',
  'Em andamento': 'hsl(var(--warning))',
  'Concluído': 'hsl(var(--success))',
};

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="text-xs font-semibold drop-shadow-md"
    >
      {value}
    </text>
  );
};

export const ApontamentosChart = ({ apontamentos }: ApontamentosChartProps) => {
  const [activeChart, setActiveChart] = useState<'pie' | 'bar' | 'trend'>('pie');
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);

  // Status distribution
  const statusData = useMemo(() => [
    { status: 'Pendente', count: apontamentos.filter(a => a.status === 'Pendente').length, fill: STATUS_COLORS['Pendente'] },
    { status: 'Em andamento', count: apontamentos.filter(a => a.status === 'Em andamento').length, fill: STATUS_COLORS['Em andamento'] },
    { status: 'Concluído', count: apontamentos.filter(a => a.status === 'Concluído').length, fill: STATUS_COLORS['Concluído'] },
  ], [apontamentos]);

  // Territory analysis
  const territorioData = useMemo(() => {
    const data = apontamentos.reduce((acc, a) => {
      const existing = acc.find(item => item.territorio === a.territorio);
      if (existing) {
        existing.total += 1;
        if (a.status === 'Pendente') existing.pendentes += 1;
        if (a.status === 'Em andamento') existing.emAndamento += 1;
        if (a.status === 'Concluído') existing.concluidos += 1;
      } else {
        acc.push({
          territorio: a.territorio,
          total: 1,
          pendentes: a.status === 'Pendente' ? 1 : 0,
          emAndamento: a.status === 'Em andamento' ? 1 : 0,
          concluidos: a.status === 'Concluído' ? 1 : 0,
        });
      }
      return acc;
    }, [] as Array<{ territorio: string; total: number; pendentes: number; emAndamento: number; concluidos: number }>);

    return data.sort((a, b) => b.total - a.total).slice(0, 8);
  }, [apontamentos]);

  // Trend data - últimos 6 meses
  const trendData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      
      const monthApontamentos = apontamentos.filter(a => {
        const dataReuniao = parseISO(a.dataReuniao);
        return isWithinInterval(dataReuniao, { start, end });
      });

      months.push({
        month: format(monthDate, 'MMM', { locale: ptBR }),
        fullMonth: format(monthDate, 'MMMM yyyy', { locale: ptBR }),
        total: monthApontamentos.length,
        concluidos: monthApontamentos.filter(a => a.status === 'Concluído').length,
        pendentes: monthApontamentos.filter(a => a.status !== 'Concluído').length,
      });
    }
    
    return months;
  }, [apontamentos]);

  const total = statusData.reduce((sum, d) => sum + d.count, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-popover border border-border rounded-lg shadow-xl p-3 backdrop-blur-sm">
        <p className="font-semibold text-sm mb-2">{label || payload[0]?.payload?.status || payload[0]?.payload?.fullMonth}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-semibold">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        <Button
          variant={activeChart === 'pie' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveChart('pie')}
          className="gap-2 transition-all"
        >
          <PieChartIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Status Geral</span>
        </Button>
        <Button
          variant={activeChart === 'bar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveChart('bar')}
          className="gap-2 transition-all"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Por Território</span>
        </Button>
        <Button
          variant={activeChart === 'trend' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveChart('trend')}
          className="gap-2 transition-all"
        >
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Evolução</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Pie Chart - Overall Status */}
        <Card className={cn(
          "transition-all duration-500",
          activeChart === 'pie' ? "lg:col-span-2 ring-2 ring-primary/20" : ""
        )}>
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-primary" />
              Status Geral dos Apontamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={cn(
              "flex flex-col items-center gap-6",
              activeChart === 'pie' ? "lg:flex-row lg:justify-around" : ""
            )}>
              <ResponsiveContainer 
                width="100%" 
                height={activeChart === 'pie' ? 320 : 280}
              >
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={activeChart === 'pie' ? 60 : 50}
                    outerRadius={activeChart === 'pie' ? 110 : 90}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    onMouseEnter={(_, index) => setHoveredStatus(statusData[index].status)}
                    onMouseLeave={() => setHoveredStatus(null)}
                  >
                    {statusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill}
                        opacity={hoveredStatus === null || hoveredStatus === entry.status ? 1 : 0.4}
                        className="transition-opacity duration-200 cursor-pointer"
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend with interactivity */}
              <div className={cn(
                "flex flex-wrap justify-center gap-3",
                activeChart === 'pie' ? "lg:flex-col lg:gap-4" : ""
              )}>
                {statusData.map((entry) => (
                  <div 
                    key={entry.status}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer",
                      "hover:bg-muted/50",
                      hoveredStatus === entry.status && "bg-muted ring-1 ring-primary/30"
                    )}
                    onMouseEnter={() => setHoveredStatus(entry.status)}
                    onMouseLeave={() => setHoveredStatus(null)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span className="text-sm font-medium">{entry.status}</span>
                    <span className="text-sm text-muted-foreground">
                      ({entry.count} - {total > 0 ? Math.round((entry.count / total) * 100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stacked Bar - Territory Status */}
        <Card className={cn(
          "transition-all duration-500",
          activeChart === 'bar' ? "lg:col-span-2 ring-2 ring-primary/20" : ""
        )}>
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Status por Território
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer 
              width="100%" 
              height={activeChart === 'bar' ? 400 : 280}
            >
              <BarChart 
                data={territorioData} 
                margin={{ top: 10, right: 10, left: -10, bottom: 80 }}
                barGap={0}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="territorio" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
                  width={35}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} 
                  iconSize={10}
                  iconType="circle"
                />
                <Bar 
                  dataKey="concluidos" 
                  stackId="a" 
                  fill="hsl(var(--success))" 
                  name="Concluídos" 
                  radius={[0, 0, 0, 0]}
                  className="transition-opacity hover:opacity-80"
                />
                <Bar 
                  dataKey="emAndamento" 
                  stackId="a" 
                  fill="hsl(var(--warning))" 
                  name="Em Andamento"
                  className="transition-opacity hover:opacity-80"
                />
                <Bar 
                  dataKey="pendentes" 
                  stackId="a" 
                  fill="hsl(var(--danger))" 
                  name="Pendentes" 
                  radius={[4, 4, 0, 0]}
                  className="transition-opacity hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        {activeChart === 'trend' && (
          <Card className="lg:col-span-2 ring-2 ring-primary/20 animate-fade-in">
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-sm md:text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Evolução Mensal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart 
                  data={trendData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConcluidos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
                    width={35}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px' }} 
                    iconSize={10}
                    iconType="circle"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    name="Total"
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="concluidos" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorConcluidos)"
                    name="Concluídos"
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
