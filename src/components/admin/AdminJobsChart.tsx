
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface JobRoleData {
  name: string;
  value: number;
  color: string;
}

interface AdminJobsChartProps {
  popularJobs: JobRoleData[];
  onRefresh?: () => void;
}

const AdminJobsChart = ({ popularJobs, onRefresh }: AdminJobsChartProps) => {
  const hasData = popularJobs && popularJobs.length > 0;
  const totalRecommendations = popularJobs.reduce((sum, job) => sum + job.value, 0);

  // Custom tooltip component with proper dark mode styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalRecommendations) * 100).toFixed(1);
      
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-popover-foreground">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            <span className="font-medium">{data.value}</span> recommendations
          </p>
          <p className="text-sm text-muted-foreground">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Most Recommended Job Roles</CardTitle>
          <CardDescription>
            Job roles most frequently recommended to users
            {hasData && ` • ${totalRecommendations} total recommendations`}
          </CardDescription>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={popularJobs}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {popularJobs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col space-y-3 lg:ml-8 mt-4 lg:mt-0">
              {popularJobs.map((item, index) => {
                const percentage = ((item.value / totalRecommendations) * 100).toFixed(1);
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.value} recommendations • {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-muted-foreground text-lg mb-2">No job recommendation data yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Data will appear as the system recommends jobs to users based on their profiles
            </p>
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>How it works:</strong>
              <br />• Each user receives 4 job recommendations
              <br />• Chart shows most frequently recommended roles
              <br />• Data updates as more users complete their profiles
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminJobsChart;
