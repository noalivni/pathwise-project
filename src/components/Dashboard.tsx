
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import OnboardingQuestionnaire from "@/components/OnboardingQuestionnaire";
import SkillsAssessment from "@/components/SkillsAssessment";
import JobRecommendations from "@/components/JobRecommendations";
import InterviewPractice from "@/components/InterviewPractice";
import LearningResources from "@/components/LearningResources";
import ResumeBuilder from "@/components/ResumeBuilder";

interface DashboardProps {
  userRole: 'user' | 'admin';
  onLogout: () => void;
}

const Dashboard = ({ userRole, onLogout }: DashboardProps) => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    if (userRole === 'admin') {
      return <AdminDashboard />;
    }

    switch (activeView) {
      case 'dashboard':
        return <UserDashboard />;
      case 'onboarding':
        return <OnboardingQuestionnaire />;
      case 'assessment':
        return <SkillsAssessment />;
      case 'jobs':
        return <JobRecommendations />;
      case 'interview':
        return <InterviewPractice />;
      case 'learning':
        return <LearningResources />;
      case 'resume':
        return <ResumeBuilder />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar 
          userRole={userRole} 
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={onLogout}
        />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
