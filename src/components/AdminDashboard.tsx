
import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import AdminChartsSection from "@/components/admin/AdminChartsSection";
import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const AdminDashboard = () => {
  const {
    userBreakdown,
    totalInterviews,
    totalJobMatches,
    monthlyData,
    popularJobs,
    loading,
    lastUpdated,
    refreshData
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
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-600">Platform analytics and insights</p>
            {lastUpdated && (
              <span className="text-xs text-slate-500">
                • Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshData}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Debug Info Card - shows actual data counts */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <strong>Data Status:</strong> {userBreakdown.total} total users • {popularJobs.length} job interactions tracked
            </div>
            <div className="text-xs text-blue-600">
              This shows ALL registered users, not just admins
            </div>
          </div>
        </CardContent>
      </Card>

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
        onRefresh={refreshData}
      />
    </div>
  );
};

export default AdminDashboard;
