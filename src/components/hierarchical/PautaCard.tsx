import { useState } from "react";
import { ChevronRight, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApontamentoCard } from "./ApontamentoCard";
import { PautaHierarchical } from "@/types/hierarchical";
import { cn } from "@/lib/utils";

interface PautaCardProps {
  pauta: PautaHierarchical;
}

export const PautaCard = ({ pauta }: PautaCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusCounts = {
    pendente: pauta.apontamentos.filter(a => a.status === 'Pendente').length,
    emAndamento: pauta.apontamentos.filter(a => a.status === 'Em andamento').length,
    concluido: pauta.apontamentos.filter(a => a.status === 'Concluído').length,
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-accent/60">
      {/* Header - clickable */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-accent" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground mb-2">
              {pauta.descricao}
            </h4>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              {statusCounts.pendente > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {statusCounts.pendente} pendente{statusCounts.pendente > 1 ? 's' : ''}
                </Badge>
              )}
              {statusCounts.emAndamento > 0 && (
                <Badge variant="outline" className="text-xs border-warning text-warning">
                  {statusCounts.emAndamento} em andamento
                </Badge>
              )}
              {statusCounts.concluido > 0 && (
                <Badge variant="outline" className="text-xs border-success text-success">
                  {statusCounts.concluido} concluído{statusCounts.concluido > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>

          <ChevronRight 
            className={cn(
              "w-5 h-5 text-muted-foreground transition-transform shrink-0",
              isExpanded && "rotate-90"
            )} 
          />
        </div>
      </div>

      {/* Expanded content - apontamentos */}
      {isExpanded && pauta.apontamentos.length > 0 && (
        <div className="px-4 pb-4 space-y-2 bg-muted/20">
          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
            Apontamentos ({pauta.apontamentos.length})
          </p>
          {pauta.apontamentos.map((apontamento) => (
            <ApontamentoCard key={apontamento.id} apontamento={apontamento} />
          ))}
        </div>
      )}

      {isExpanded && pauta.apontamentos.length === 0 && (
        <div className="px-4 pb-4 bg-muted/20">
          <p className="text-sm text-muted-foreground text-center py-3">
            Nenhum apontamento registrado
          </p>
        </div>
      )}
    </Card>
  );
};
