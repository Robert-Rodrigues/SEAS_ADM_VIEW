import { Calendar, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusIndicator } from "./StatusIndicator";
import { ApontamentoHierarchical } from "@/types/hierarchical";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ApontamentoCardProps {
  apontamento: ApontamentoHierarchical;
}

export const ApontamentoCard = ({ apontamento }: ApontamentoCardProps) => {
  return (
    <Card className="p-4 bg-muted/30 border-l-4 border-l-primary/40 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header with status */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-foreground flex-1">
            {apontamento.descricao}
          </p>
          <StatusIndicator status={apontamento.status} size="sm" />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {apontamento.prazo && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>
                Prazo: {format(new Date(apontamento.prazo), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{apontamento.responsaveis}</span>
          </div>
        </div>

        {/* Solution if exists */}
        {apontamento.solucao && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Solução:</span> {apontamento.solucao}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
