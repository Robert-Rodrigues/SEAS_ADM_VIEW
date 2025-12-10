import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { Pauta } from '@/hooks/usePautasData';

interface PautasMetricsProps {
  pautas: Pauta[];
}

export const PautasMetrics = ({ pautas }: PautasMetricsProps) => {
  const totalPautas = pautas.length;
  const totalAcoes = pautas.reduce((acc, p) => acc + p.totalAcoes, 0);
  const acoesConcluidas = pautas.reduce((acc, p) => acc + p.acoesConcluidas, 0);
  const acoesPendentes = pautas.reduce((acc, p) => acc + p.acoesPendentes, 0);
  const acoesEmAndamento = pautas.reduce((acc, p) => acc + p.acoesEmAndamento, 0);
  
  const taxaConclusao = totalAcoes > 0 
    ? Math.round((acoesConcluidas / totalAcoes) * 100) 
    : 0;

  const pautasComPendencias = pautas.filter(p => p.acoesPendentes > 0).length;

  const metrics = [
    {
      title: 'Total de Pautas',
      value: totalPautas,
      subtitle: `${pautasComPendencias} com pendências`,
      icon: FileText,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Ações Concluídas',
      value: acoesConcluidas,
      subtitle: `${taxaConclusao}% do total`,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Em Andamento',
      value: acoesEmAndamento,
      subtitle: 'ações em execução',
      icon: Clock,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Pendentes',
      value: acoesPendentes,
      subtitle: 'aguardando início',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {metric.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metric.subtitle}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
