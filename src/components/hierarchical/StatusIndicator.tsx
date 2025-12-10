import { CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: 'Pendente' | 'Em andamento' | 'Concluído';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator = ({ status, size = 'md' }: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconSize = sizeClasses[size];

  if (status === 'Concluído') {
    return (
      <div className="flex items-center gap-1.5">
        <div className={cn("rounded-full bg-success/20 flex items-center justify-center p-1")}>
          <CheckCircle2 className={cn(iconSize, "text-success")} />
        </div>
        <span className="text-xs font-medium text-success">Concluído</span>
      </div>
    );
  }

  if (status === 'Em andamento') {
    return (
      <div className="flex items-center gap-1.5">
        <div className={cn("rounded-full bg-warning/20 flex items-center justify-center p-1")}>
          <PlayCircle className={cn(iconSize, "text-warning")} />
        </div>
        <span className="text-xs font-medium text-warning">Em andamento</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("rounded-full bg-danger/20 flex items-center justify-center p-1")}>
        <Clock className={cn(iconSize, "text-danger")} />
      </div>
      <span className="text-xs font-medium text-danger">Pendente</span>
    </div>
  );
};
