import { useState } from "react";
import { Calendar, ChevronRight, Clock, MapPin, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PautaCard } from "./PautaCard";
import { ReuniaoHierarchical } from "@/types/hierarchical";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ReuniaoCardProps {
  reuniao: ReuniaoHierarchical;
}

export const ReuniaoCard = ({ reuniao }: ReuniaoCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalApontamentos = reuniao.pautas.reduce(
    (acc, pauta) => acc + pauta.apontamentos.length, 
    0
  );

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header - clickable */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 cursor-pointer bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {/* Territory badge */}
            <Badge variant="default" className="mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              {reuniao.territorio}
            </Badge>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{format(new Date(reuniao.data), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>

              {reuniao.hora && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{reuniao.hora}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate">{reuniao.facilitador}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mt-3 text-xs">
              <span className="text-muted-foreground">
                {reuniao.pautas.length} pauta{reuniao.pautas.length !== 1 ? 's' : ''}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {totalApontamentos} apontamento{totalApontamentos !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <ChevronRight 
            className={cn(
              "w-6 h-6 text-muted-foreground transition-transform shrink-0",
              isExpanded && "rotate-90"
            )} 
          />
        </div>
      </div>

      {/* Expanded content - pautas */}
      {isExpanded && reuniao.pautas.length > 0 && (
        <div className="p-4 sm:p-5 pt-0 space-y-3 bg-muted/10">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Pautas discutidas ({reuniao.pautas.length})
          </p>
          {reuniao.pautas.map((pauta) => (
            <PautaCard key={pauta.id} pauta={pauta} />
          ))}
        </div>
      )}

      {isExpanded && reuniao.pautas.length === 0 && (
        <div className="p-4 sm:p-5 pt-0 bg-muted/10">
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma pauta registrada nesta reunião
          </p>
        </div>
      )}
    </Card>
  );
};
