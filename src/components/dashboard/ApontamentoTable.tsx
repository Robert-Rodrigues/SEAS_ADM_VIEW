import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Apontamento } from "@/types/dashboard";
import { CheckCircle2, Circle, Clock, Calendar, MapPin, Users, FileText, AlertCircle, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ApontamentoTableProps {
  apontamentos: Apontamento[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Concluído":
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    case "Em andamento":
      return <Clock className="w-4 h-4 text-warning" />;
    default:
      return <Circle className="w-4 h-4 text-danger" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Concluído":
      return "bg-success/10 text-success border-success/20";
    case "Em andamento":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-danger/10 text-danger border-danger/20";
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Concluído":
      return "default" as const;
    case "Em andamento":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
};

export const ApontamentoTable = ({ apontamentos }: ApontamentoTableProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (apontamentos.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Nenhum apontamento encontrado</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile View - Cards */}
      <div className="lg:hidden space-y-2 sm:space-y-3 print:hidden">
        {apontamentos.map((apontamento, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <Card 
              key={index} 
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className={cn(
                "overflow-hidden cursor-pointer transition-all duration-300 border-l-4 active:scale-[0.98]",
                isExpanded ? "shadow-lg ring-2 ring-primary/20" : "hover:shadow-md hover:-translate-y-0.5"
              )} 
              style={{
                borderLeftColor: apontamento.status === 'Concluído' ? 'hsl(var(--success))' : 
                               apontamento.status === 'Em andamento' ? 'hsl(var(--warning))' : 
                               'hsl(var(--danger))'
              }}
            >
              {/* Header com Status Badge */}
              <div className={cn(
                "px-4 py-3 flex items-center justify-between transition-colors",
                getStatusColor(apontamento.status).replace('/10', isExpanded ? '/15' : '/8')
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn("transition-transform", isExpanded && "scale-110")}>
                    {getStatusIcon(apontamento.status)}
                  </div>
                  <span className="text-sm font-semibold">{apontamento.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-medium border-current">
                    {apontamento.territorio}
                  </Badge>
                  <ChevronRight className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform duration-300",
                    isExpanded && "rotate-90"
                  )} />
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-4 space-y-3">
                {/* Pauta - Destaque principal */}
                <div>
                  <h3 className="font-semibold text-base leading-tight mb-2">{apontamento.pauta}</h3>
                  <div className={cn(
                    "text-sm text-muted-foreground transition-all duration-300",
                    isExpanded ? "line-clamp-none" : "line-clamp-2"
                  )}>
                    {apontamento.problema}
                  </div>
                </div>

                {/* Informações em grid */}
                <div className={cn(
                  "grid gap-3 pt-3 border-t text-xs transition-all duration-300",
                  isExpanded ? "grid-cols-1" : "grid-cols-2"
                )}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">Data Reunião</span>
                      <span className="font-medium">
                        {format(new Date(apontamento.dataReuniao), "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  
                  {apontamento.prazo && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-warning" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">Prazo</span>
                        <span className="font-medium">
                          {format(new Date(apontamento.prazo), "dd 'de' MMMM", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className={cn("flex items-center gap-2", !apontamento.prazo && "col-span-2")}>
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">Responsáveis</span>
                      <span className="font-medium truncate">{apontamento.responsaveis}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desktop View - Table */}
      <Card className="hidden lg:block overflow-hidden print:block print:shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 print:bg-gray-100">
                <TableHead className="font-semibold text-xs lg:text-sm print:text-[9pt] print:p-2">Data</TableHead>
                <TableHead className="font-semibold text-xs lg:text-sm print:text-[9pt] print:p-2">Território</TableHead>
                <TableHead className="font-semibold text-xs lg:text-sm print:text-[9pt] print:p-2">Pauta</TableHead>
                <TableHead className="font-semibold text-xs lg:text-sm print:text-[9pt] print:p-2">Problema</TableHead>
                <TableHead className="font-semibold text-xs lg:text-sm print:text-[9pt] print:p-2">Responsáveis</TableHead>
                <TableHead className="font-semibold text-xs lg:text-sm print:text-[9pt] print:p-2">Prazo</TableHead>
                <TableHead className="font-semibold text-xs lg:text-sm print:text-[9pt] print:p-2">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apontamentos.map((apontamento, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-smooth print:hover:bg-transparent">
                  <TableCell className="font-medium text-xs lg:text-sm print:text-[9pt] print:p-2 whitespace-nowrap">
                    {format(new Date(apontamento.dataReuniao), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-xs lg:text-sm print:text-[9pt] print:p-2">
                    <Badge variant="outline" className="font-normal text-[10px] lg:text-xs print:text-[8pt] print:px-1 print:py-0.5">
                      {apontamento.territorio}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[150px] lg:max-w-xs print:max-w-[120px]">
                    <div className="truncate text-xs lg:text-sm print:text-[9pt]">{apontamento.pauta}</div>
                  </TableCell>
                  <TableCell className="max-w-[150px] lg:max-w-xs print:max-w-[120px]">
                    <div className="truncate text-xs lg:text-sm print:text-[9pt]">{apontamento.problema}</div>
                  </TableCell>
                  <TableCell className="text-xs lg:text-sm print:text-[9pt] print:p-2">{apontamento.responsaveis}</TableCell>
                  <TableCell className="text-xs lg:text-sm print:text-[9pt] print:p-2 whitespace-nowrap">
                    {apontamento.prazo
                      ? format(new Date(apontamento.prazo), "dd/MM/yyyy", { locale: ptBR })
                      : "-"}
                  </TableCell>
                  <TableCell className="print:p-2">
                    <Badge variant={getStatusVariant(apontamento.status)} className="gap-1 lg:gap-1.5 text-[10px] lg:text-xs print:text-[8pt] print:px-1 print:py-0.5">
                      <span className="print:hidden">{getStatusIcon(apontamento.status)}</span>
                      {apontamento.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};