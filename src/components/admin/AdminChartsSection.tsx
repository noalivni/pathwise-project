
import AdminMonthlyChart from './AdminMonthlyChart';
import AdminInterviewChart from './AdminInterviewChart';
import AdminJobsChart from './AdminJobsChart';

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
  monthlyData: MonthlyData[];
  popularJobs: JobRoleData[];
}

const AdminChartsSection = ({ monthlyData, popularJobs }: AdminChartsSectionProps) => {
  return (
    <>
      {/* Monthly Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminMonthlyChart monthlyData={monthlyData} />
        <AdminInterviewChart monthlyData={monthlyData} />
      </div>

      {/* Popular Jobs Chart */}
      <AdminJobsChart popularJobs={popularJobs} />
    </>
  );
};

export default AdminChartsSection;
