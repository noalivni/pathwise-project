
import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import AdminChartsSection from "@/components/admin/AdminChartsSection";
import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Users } from "lucide-react";

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

      {/* Enhanced Debug Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-blue-600" />
              <div className="text-sm">
                <div className="font-semibold text-blue-800">Data Status Report</div>
                <div className="text-blue-700">
                  <strong>Total Users:</strong> {userBreakdown.total} 
                  <span className="mx-2">•</span>
                  <strong>Free:</strong> {userBreakdown.free}
                  <span className="mx-2">•</span>
                  <strong>Premium:</strong> {userBreakdown.premium}
                  <span className="mx-2">•</span>
                  <strong>Job Interactions:</strong> {popularJobs.length} tracked
                </div>
              </div>
            </div>
            <div className="text-xs text-blue-600 text-right">
              <div>✅ Querying 'profiles' table</div>
              <div>✅ All registered users included</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Health Check Card */}
      {userBreakdown.total === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-yellow-600" />
              <div className="text-sm">
                <div className="font-semibold text-yellow-800">⚠️ No User Data Found</div>
                <div className="text-yellow-700">
                  The dashboard is not finding any users in the 'profiles' table. 
                  This could mean:
                </div>
                <ul className="text-xs text-yellow-600 mt-1 ml-4 list-disc">
                  <li>No users have registered yet</li>
                  <li>Database connection issue</li>
                  <li>Data is in a different table or environment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
