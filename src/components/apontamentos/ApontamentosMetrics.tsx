import { Card } from "@/components/ui/card";
import { Apontamento } from "@/types/dashboard";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  CalendarClock,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface ApontamentosMetricsProps {
  apontamentos: Apontamento[];
}

export const ApontamentosMetrics = ({ apontamentos }: ApontamentosMetricsProps) => {
  const metrics = useMemo(() => {
    const total = apontamentos.length;
    const pendentes = apontamentos.filter(a => a.status === 'Pendente').length;
    const emAndamento = apontamentos.filter(a => a.status === 'Em andamento').length;
    const concluidos = apontamentos.filter(a => a.status === 'Concluído').length;
    
    // Calcular apontamentos com prazo vencido
    const hoje = new Date();
    const vencidos = apontamentos.filter(a => {
      if (a.status === 'Concluído' || !a.prazo) return false;
      return new Date(a.prazo) < hoje;
    }).length;

    // Calcular responsáveis únicos
    const responsaveisUnicos = new Set(
      apontamentos.flatMap(a => a.responsaveis.split(',').map(r => r.trim()))
    ).size;

    const taxaConclusao = total > 0 ? Math.round((concluidos / total) * 100) : 0;

    return {
      total,
      pendentes,
      emAndamento,
      concluidos,
      vencidos,
      responsaveisUnicos,
      taxaConclusao
    };
  }, [apontamentos]);

  const cards = [
    {
      label: "Concluídos",
      value: metrics.concluidos,
      icon: CheckCircle2,
      color: "success",
      gradient: "from-success/20 to-success/5",
      iconBg: "bg-success/10",
      iconColor: "text-success",
      description: `${metrics.taxaConclusao}% do total`
    },
    {
      label: "Em Andamento",
      value: metrics.emAndamento,
      icon: Clock,
      color: "warning",
      gradient: "from-warning/20 to-warning/5",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      description: "Em progresso"
    },
    {
      label: "Pendentes",
      value: metrics.pendentes,
      icon: AlertTriangle,
      color: "danger",
      gradient: "from-danger/20 to-danger/5",
      iconBg: "bg-danger/10",
      iconColor: "text-danger",
      description: metrics.vencidos > 0 ? `${metrics.vencidos} vencidos` : "Aguardando início"
    },
    {
      label: "Taxa de Conclusão",
      value: `${metrics.taxaConclusao}%`,
      icon: TrendingUp,
      color: "primary",
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      description: `${metrics.concluidos} de ${metrics.total}`
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, index) => (
        <Card
          key={card.label}
          className={cn(
            "relative overflow-hidden p-4 sm:p-5 transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]",
            "group cursor-default border-0"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background gradient */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity group-hover:opacity-100",
            card.gradient
          )} />
          
          {/* Decorative circle */}
          <div className={cn(
            "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110",
            `bg-${card.color}`
          )} 
          style={{ backgroundColor: `hsl(var(--${card.color}))` }}
          />

          <div className="relative flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {card.label}
              </p>
              <p className={cn(
                "text-2xl sm:text-3xl font-bold tracking-tight",
                card.iconColor
              )}>
                {card.value}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {card.description}
              </p>
            </div>
            
            <div className={cn(
              "shrink-0 p-2.5 sm:p-3 rounded-xl transition-all duration-300",
              "group-hover:scale-110 group-hover:rotate-3",
              card.iconBg
            )}>
              <card.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", card.iconColor)} />
            </div>
          </div>

          {/* Progress bar for completion rate */}
          {card.label === "Taxa de Conclusão" && (
            <div className="relative mt-3 h-1.5 bg-muted/50 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${metrics.taxaConclusao}%` }}
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
