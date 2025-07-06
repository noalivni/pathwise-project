
import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import AdminChartsSection from "@/components/admin/AdminChartsSection";
import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";
import { Card, CardContent } from "@/components/ui/card";

const AdminDashboard = () => {
  const {
    userBreakdown,
    totalInterviews,
    totalJobMatches,
    monthlyData,
    popularJobs,
    loading
  } = useAdminDashboardData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Loading platform analytics...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Platform analytics and insights</p>
        </div>
      </div>

      {/* KPI Cards */}
      <AdminDashboardStats 
        userBreakdown={userBreakdown}
        totalInterviews={totalInterviews}
        totalJobMatches={totalJobMatches}
      />

      {/* Charts */}
      <AdminChartsSection 
        monthlyData={monthlyData}
        popularJobs={popularJobs}
      />
    </div>
  );
};

export default AdminDashboard;
