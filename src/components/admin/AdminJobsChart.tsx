
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
  const totalInteractions = popularJobs.reduce((sum, job) => sum + job.value, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Most Popular Job Roles</CardTitle>
          <CardDescription>
            Job roles with the most user interactions (views and bookmarks)
            {hasData && ` • ${totalInteractions} total interactions`}
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
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value} interactions`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col space-y-3 lg:ml-8 mt-4 lg:mt-0">
              {popularJobs.map((item, index) => {
                const percentage = ((item.value / totalInteractions) * 100).toFixed(1);
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.value} interactions • {percentage}%
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
            <p className="text-gray-500 text-lg mb-2">No job interaction data yet</p>
            <p className="text-sm text-gray-400 mb-4">
              Data will appear as users view, bookmark, and interact with job roles
            </p>
            <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
              <strong>Tip:</strong> Job popularity is calculated based on:
              <br />• Views (1 point each)
              <br />• Bookmarks (2 points each)
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminJobsChart;
