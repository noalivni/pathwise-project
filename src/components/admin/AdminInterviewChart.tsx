
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  users: number;
  interviews: number;
}

interface AdminInterviewChartProps {
  monthlyData: MonthlyData[];
}

const AdminInterviewChart = ({ monthlyData }: AdminInterviewChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Simulations</CardTitle>
        <CardDescription>Monthly interview practice sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="interviews" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdminInterviewChart;
