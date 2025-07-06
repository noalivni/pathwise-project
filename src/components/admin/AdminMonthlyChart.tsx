
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
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#14B8A6" 
              strokeWidth={3}
              dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdminMonthlyChart;
