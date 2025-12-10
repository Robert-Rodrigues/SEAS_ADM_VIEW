import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, FileText, ListChecks, ChevronRight } from "lucide-react";
import { Reuniao } from "@/hooks/useReunioesData";
import { cn } from "@/lib/utils";

interface ReunioesTableProps {
  reunioes: Reuniao[];
}

export const ReunioesTable = ({ reunioes }: ReunioesTableProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (reunioes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Nenhuma reunião encontrada</p>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {reunioes.map((reuniao, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <Card
              key={reuniao.id}
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
                      {reuniao.territorio}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Reunião - {reuniao.territorio}
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
                    <p className="text-xs text-muted-foreground uppercase">Data</p>
                    <p className="font-semibold text-sm truncate">
                      {format(new Date(reuniao.data), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase">Hora</p>
                    <p className="font-semibold text-sm truncate">
                      {reuniao.hora || 'Não informado'}
                    </p>
                  </div>
                </div>

                {isExpanded && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-info" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground uppercase">Secretário</p>
                        <p className="font-semibold text-sm truncate">
                          {reuniao.secretario}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-success" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground uppercase">Pautas</p>
                        <p className="font-semibold text-sm">
                          {reuniao.totalPautas}
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
                          {reuniao.totalAcoes}
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
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Território</TableHead>
                <TableHead>Secretário</TableHead>
                <TableHead className="text-center">Pautas</TableHead>
                <TableHead className="text-center">Apontamentos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reunioes.map((reuniao) => (
                <TableRow key={reuniao.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {format(new Date(reuniao.data), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{reuniao.hora || 'Não informado'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{reuniao.territorio}</Badge>
                  </TableCell>
                  <TableCell>{reuniao.secretario}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{reuniao.totalPautas}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{reuniao.totalAcoes}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
};
