import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface UserBreakdown {
  total: number;
  free: number;
  premium: number;
}

interface AdminUsersChartProps {
  userBreakdown: UserBreakdown;
}

const AdminUsersChart = ({ userBreakdown }: AdminUsersChartProps) => {
  const chartData = [
    {
      name: "Free Users",
      value: userBreakdown.free,
      fill: "hsl(var(--chart-1))"
    },
    {
      name: "Premium Users", 
      value: userBreakdown.premium,
      fill: "hsl(var(--chart-2))"
    },
    {
      name: "Total Users",
      value: userBreakdown.total,
      fill: "hsl(var(--chart-3))"
    }
  ];

  const chartConfig = {
    value: {
      label: "Users",
    },
    free: {
      label: "Free Users",
      color: "hsl(var(--chart-1))",
    },
    premium: {
      label: "Premium Users", 
      color: "hsl(var(--chart-2))",
    },
    total: {
      label: "Total Users",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="name" 
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
              dataKey="value" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AdminUsersChart;