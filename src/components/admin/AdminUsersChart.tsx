import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  // Custom tooltip component with proper dark mode styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-popover-foreground">
          <p className="font-medium">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm">
                <span className="inline-block w-3 h-3 rounded mr-2" style={{ backgroundColor: entry.color }}></span>
                <span className="font-medium">{entry.value}</span> {entry.dataKey === 'freeUsers' ? 'freemium' : 'premium'} users
              </p>
            ))}
            <p className="text-sm font-medium border-t pt-1">
              Total: {total} users
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly User Statistics</CardTitle>
        <CardDescription>User breakdown by subscription type throughout the year</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="freeUsers" 
              stackId="users"
              fill="hsl(var(--muted-foreground))"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="premiumUsers" 
              stackId="users"
              fill="#7C3AED"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdminUsersChart;