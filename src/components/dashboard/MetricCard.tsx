import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const variantStyles = {
  default: "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10",
  success: "border-success/20 bg-gradient-to-br from-success/5 to-success/10",
  warning: "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10",
  danger: "border-danger/20 bg-gradient-to-br from-danger/5 to-danger/10",
  info: "border-info/20 bg-gradient-to-br from-info/5 to-info/10",
};

const iconVariantStyles = {
  default: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  danger: "text-danger bg-danger/10",
  info: "text-info bg-info/10",
};

const valueVariantStyles = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
  onClick,
  isActive = false,
}: MetricCardProps) => {
  const activeStyles = {
    default: "from-primary/30 to-primary/40 shadow-xl border-primary",
    success: "from-success/30 to-success/40 shadow-xl border-success",
    warning: "from-warning/30 to-warning/40 shadow-xl border-warning",
    danger: "from-danger/30 to-danger/40 shadow-xl border-danger",
    info: "from-info/30 to-info/40 shadow-xl border-info",
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden border-2 p-3 sm:p-4 md:p-6 transition-smooth print:p-3 print:border print:shadow-none",
        isActive ? `bg-gradient-to-br ${activeStyles[variant]}` : variantStyles[variant],
        onClick && "cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95",
        "print:cursor-default print:hover:shadow-none print:hover:translate-y-0",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground mb-1 sm:mb-2 print:text-[9pt] print:mb-1 truncate">
            {title}
          </p>
          <p className={cn(
            "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight print:text-[14pt]",
            valueVariantStyles[variant]
          )}>
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "text-xs sm:text-sm font-medium mt-1 sm:mt-2 print:text-[8pt]",
                trend.isPositive ? "text-success" : "text-danger"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-smooth shrink-0 print:p-2 print:rounded-lg",
            iconVariantStyles[variant]
          )}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 print:w-4 print:h-4" />
        </div>
      </div>
    </Card>
  );
};
