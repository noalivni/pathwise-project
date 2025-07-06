
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface JobRoleData {
  name: string;
  value: number;
  color: string;
}

interface AdminJobsChartProps {
  popularJobs: JobRoleData[];
}

const AdminJobsChart = ({ popularJobs }: AdminJobsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Popular Job Roles</CardTitle>
        <CardDescription>Job roles with the most user interactions (views and bookmarks)</CardDescription>
      </CardHeader>
      <CardContent>
        {popularJobs.length > 0 ? (
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col space-y-2 lg:ml-8">
              {popularJobs.map((item, index) => {
                const total = popularJobs.reduce((sum, job) => sum + job.value, 0);
                const percentage = ((item.value / total) * 100).toFixed(1);
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm text-gray-500">({item.value} interactions - {percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No job interaction data available yet</p>
            <p className="text-sm text-gray-400 mt-2">Data will appear as users interact with job roles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminJobsChart;
