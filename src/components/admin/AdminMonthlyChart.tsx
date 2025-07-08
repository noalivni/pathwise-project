
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  users: number;
  interviews: number;
}

interface AdminMonthlyChartProps {
  monthlyData: MonthlyData[];
}

const AdminMonthlyChart = ({ monthlyData }: AdminMonthlyChartProps) => {
  // Custom tooltip component with proper dark mode styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-popover-foreground">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="font-medium">{payload[0].value}</span> new users
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly New Users ({new Date().getFullYear()})</CardTitle>
        <CardDescription>User registrations throughout the year</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#059669" 
              strokeWidth={3}
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdminMonthlyChart;
