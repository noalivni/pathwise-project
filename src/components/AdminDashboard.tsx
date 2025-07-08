
import { useState } from 'react';
import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import AdminChartsSection from "@/components/admin/AdminChartsSection";
import UserManagement from "@/components/admin/UserManagement";
import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AdminDashboardProps {
  activeView: string;
}

const AdminDashboard = ({ activeView }: AdminDashboardProps) => {
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

  // Show User Management for the users view
  if (activeView === 'users') {
    return <UserManagement />;
  }

  // Show Analytics Dashboard for the dashboard view
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">Loading platform analytics...</p>
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
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">Platform management and insights</p>
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
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
