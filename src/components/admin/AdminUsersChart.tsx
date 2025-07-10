import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface MonthlyData {
  month: string;
  users: number;
  freeUsers: number;
  premiumUsers: number;
  interviews: number;
}

interface AdminUsersChartProps {
  monthlyData: MonthlyData[];
}

const AdminUsersChart = ({ monthlyData }: AdminUsersChartProps) => {
  const chartConfig = {
    freeUsers: {
      label: "Freemium Users",
      color: "hsl(var(--muted-foreground))",
    },
    premiumUsers: {
      label: "Premium Users",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly User Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="freeUsers" 
              stackId="users"
              fill="hsl(var(--muted-foreground))"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="premiumUsers" 
              stackId="users"
              fill="hsl(var(--accent))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AdminUsersChart;