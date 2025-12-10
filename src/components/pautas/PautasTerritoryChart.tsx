import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MapPin } from 'lucide-react';
import type { Pauta } from '@/hooks/usePautasData';

interface PautasTerritoryChartProps {
  pautas: Pauta[];
}

export const PautasTerritoryChart = ({ pautas }: PautasTerritoryChartProps) => {
  // Agrupar pautas por território
  const territorioMap = pautas.reduce((acc, pauta) => {
    const territorio = pauta.territorio || 'Sem território';
    if (!acc[territorio]) {
      acc[territorio] = { pautas: 0, acoes: 0, concluidas: 0 };
    }
    acc[territorio].pautas += 1;
    acc[territorio].acoes += pauta.totalAcoes;
    acc[territorio].concluidas += pauta.acoesConcluidas;
    return acc;
  }, {} as Record<string, { pautas: number; acoes: number; concluidas: number }>);

  const data = Object.entries(territorioMap)
    .map(([name, stats]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      fullName: name,
      pautas: stats.pautas,
      acoes: stats.acoes,
      concluidas: stats.concluidas,
      taxa: stats.acoes > 0 ? Math.round((stats.concluidas / stats.acoes) * 100) : 0,
    }))
    .sort((a, b) => b.pautas - a.pautas)
    .slice(0, 6);

  if (data.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Pautas por Território
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Pautas por Território
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Quantidade de pautas em cada território
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'pautas') return [`${value} pautas`, 'Total'];
                  return [value, name];
                }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="pautas" radius={[0, 4, 4, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
