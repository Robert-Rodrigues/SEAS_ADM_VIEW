import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MetricasTerritoriais } from "@/types/dashboard";

interface TerritoryMetricsChartProps {
  data: MetricasTerritoriais[];
}

const COLORS = {
  total: "rgb(99, 102, 241)",
  pendentes: "rgb(239, 68, 68)",
  emAndamento: "rgb(245, 158, 11)",
  concluidos: "rgb(34, 197, 94)",
};

export const TerritoryMetricsChart = ({ data }: TerritoryMetricsChartProps) => {
  return (
    <Card className="p-3 sm:p-4 md:p-6 print:p-3 print:shadow-none">
      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 print:text-[11pt] print:mb-2">
        Métricas por Território
      </h3>
      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px] md:h-[400px] print:h-[280px]">
        <BarChart 
          data={data} 
          margin={{ top: 5, right: 5, left: -10, bottom: 60 }}
          className="sm:margin-[{top:10,right:10,left:0,bottom:80}]"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="territorio"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 9 }}
            className="sm:text-[10px] md:text-xs print:text-[8pt]"
          />
          <YAxis 
            tick={{ fill: "hsl(var(--foreground))", fontSize: 9 }} 
            className="sm:text-[10px] md:text-xs print:text-[8pt]"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              fontSize: "0.625rem",
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "8px", fontSize: "0.625rem" }}
            iconType="circle"
            className="sm:text-xs md:text-sm print:text-[8pt]"
          />
          <Bar
            dataKey="pendentes"
            name="Pendentes"
            fill={COLORS.pendentes}
            radius={[3, 3, 0, 0]}
            className="sm:radius-[4,4,0,0] md:radius-[6,6,0,0]"
          />
          <Bar
            dataKey="emAndamento"
            name="Em Andamento"
            fill={COLORS.emAndamento}
            radius={[3, 3, 0, 0]}
            className="sm:radius-[4,4,0,0] md:radius-[6,6,0,0]"
          />
          <Bar
            dataKey="concluidos"
            name="Concluídos"
            fill={COLORS.concluidos}
            radius={[3, 3, 0, 0]}
            className="sm:radius-[4,4,0,0] md:radius-[6,6,0,0]"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
