import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface StatusDistributionChartProps {
  data: {
    status: string;
    count: number;
  }[];
}

const COLORS = {
  Pendente: "hsl(0, 84%, 60%)",
  "Em andamento": "hsl(38, 92%, 50%)",
  Concluído: "hsl(142, 71%, 45%)",
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent === 0) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const StatusDistributionChart = ({ data }: StatusDistributionChartProps) => {
  return (
    <Card className="p-3 sm:p-4 md:p-6 print:p-3 print:shadow-none">
      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 print:text-[11pt] print:mb-2">
        Distribuição por Status
      </h3>
      <ResponsiveContainer width="100%" height={220} className="sm:h-[250px] md:h-[300px] print:h-[200px]">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={70}
            className="sm:outerRadius-[80] md:outerRadius-[100]"
            label={CustomLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.status as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              fontSize: "0.75rem",
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: "0.625rem" }}
            className="sm:text-xs md:text-sm print:text-[8pt]"
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
