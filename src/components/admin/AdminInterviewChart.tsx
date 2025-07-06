
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
  const hasInterviewData = monthlyData && monthlyData.some(data => data.interviews > 0);
  const totalInterviews = monthlyData.reduce((sum, data) => sum + data.interviews, 0);

  // Custom tooltip component with proper dark mode styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-popover-foreground">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="font-medium">{payload[0].value}</span> interviews
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Interview Simulations</CardTitle>
        <CardDescription>
          Monthly interview practice sessions completed by users
          {hasInterviewData && ` • ${totalInterviews} total sessions`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasInterviewData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="interviews" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎤</div>
            <p className="text-muted-foreground text-lg mb-2">No interview simulation data available yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Encourage users to try the Interview Practice feature!
            </p>
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>How it works:</strong>
              <br />• Users complete interview practice sessions
              <br />• Chart shows monthly completion trends
              <br />• Data updates as more users practice interviews
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminInterviewChart;
