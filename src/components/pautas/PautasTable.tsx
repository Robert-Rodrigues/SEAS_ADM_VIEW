import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ListChecks, Clock, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { Pauta } from "@/hooks/usePautasData";
import { cn } from "@/lib/utils";

interface PautasTableProps {
  pautas: Pauta[];
}

export const PautasTable = ({ pautas }: PautasTableProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (pautas.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Nenhuma pauta encontrada</p>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {pautas.map((pauta, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <Card
              key={pauta.id}
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className={cn(
                "p-4 transition-all duration-300 cursor-pointer active:scale-[0.98]",
                "hover:shadow-md hover:-translate-y-0.5",
                isExpanded && "shadow-lg ring-2 ring-primary/20"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {pauta.territorio}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {pauta.descricao}
                  </h3>
                </div>
                <ChevronRight 
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0",
                    isExpanded && "rotate-90"
                  )} 
                />
              </div>

              {/* Info Grid */}
              <div className={cn(
                "grid gap-3 transition-all duration-300",
                isExpanded ? "grid-cols-1" : "grid-cols-2"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase">Data Reunião</p>
                    <p className="font-semibold text-sm truncate">
                      {format(new Date(pauta.dataReuniao), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center shrink-0">
                    <ListChecks className="w-4 h-4 text-info" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase">Apontamentos</p>
                    <p className="font-semibold text-sm">
                      {pauta.totalAcoes}
                    </p>
                  </div>
                </div>

                {isExpanded && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                        <Circle className="w-4 h-4 text-danger" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground uppercase">Pendentes</p>
                        <p className="font-semibold text-sm">
                          {pauta.acoesPendentes}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-warning" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground uppercase">Em Andamento</p>
                        <p className="font-semibold text-sm">
                          {pauta.acoesEmAndamento}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground uppercase">Concluídas</p>
                        <p className="font-semibold text-sm">
                          {pauta.acoesConcluidas}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição da Pauta</TableHead>
                <TableHead>Território</TableHead>
                <TableHead>Data Reunião</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Apontamentos</TableHead>
                <TableHead className="text-center">Progresso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pautas.map((pauta) => {
                const statusPauta = pauta.totalAcoes === 0 
                  ? { label: 'Sem ações', variant: 'secondary' as const, color: '' }
                  : pauta.acoesConcluidas === pauta.totalAcoes 
                    ? { label: 'Concluída', variant: 'outline' as const, color: 'border-success text-success bg-success/10' }
                    : pauta.acoesPendentes === pauta.totalAcoes
                      ? { label: 'Pendente', variant: 'outline' as const, color: 'border-danger text-danger bg-danger/10' }
                      : { label: 'Em andamento', variant: 'outline' as const, color: 'border-warning text-warning bg-warning/10' };
                
                const progresso = pauta.totalAcoes > 0 
                  ? Math.round((pauta.acoesConcluidas / pauta.totalAcoes) * 100) 
                  : 0;

                return (
                  <TableRow key={pauta.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium max-w-xs">
                      <p className="line-clamp-2">{pauta.descricao}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{pauta.territorio}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(pauta.dataReuniao), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusPauta.variant} className={statusPauta.color}>
                        {statusPauta.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold">{pauta.totalAcoes}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-semibold">{progresso}%</span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success rounded-full transition-all"
                            style={{ width: `${progresso}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
};
