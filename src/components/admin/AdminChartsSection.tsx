
import AdminMonthlyChart from './AdminMonthlyChart';
import AdminInterviewChart from './AdminInterviewChart';
import AdminJobsChart from './AdminJobsChart';
import AdminUsersChart from './AdminUsersChart';

interface UserBreakdown {
  total: number;
  free: number;
  premium: number;
}

interface MonthlyData {
  month: string;
  users: number;
  interviews: number;
}

interface JobRoleData {
  name: string;
  value: number;
  color: string;
}

interface AdminChartsSectionProps {
  userBreakdown: UserBreakdown;
  monthlyData: MonthlyData[];
  popularJobs: JobRoleData[];
  onRefresh?: () => void;
}

const AdminChartsSection = ({ userBreakdown, monthlyData, popularJobs, onRefresh }: AdminChartsSectionProps) => {
  return (
    <>
      {/* User Statistics Chart */}
      <AdminUsersChart userBreakdown={userBreakdown} />

      {/* Monthly Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminMonthlyChart monthlyData={monthlyData} />
        <AdminInterviewChart monthlyData={monthlyData} />
      </div>

      {/* Popular Jobs Chart */}
      <AdminJobsChart popularJobs={popularJobs} onRefresh={onRefresh} />
    </>
  );
};

export default AdminChartsSection;
