import { useState, useEffect } from "react";
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
import EditableProfile from "@/components/EditableProfile";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";

interface DashboardProps {
  userRole: 'user' | 'admin';
  onLogout: () => void;
}

const Dashboard = ({ userRole, onLogout }: DashboardProps) => {
  const { profile, signOut } = useAuth();
  const { showWelcome, showUpgrade } = useNotifications();
  const [activeView, setActiveView] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding
    if (profile && !profile.onboarding_completed && userRole === 'user') {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }

    // Show welcome modal for new users (only once per session)
    if (profile && !profile.onboarding_completed && userRole === 'user' && !hasShownWelcome) {
      setTimeout(() => {
        showWelcome(
          () => setShowOnboarding(true),
          profile.full_name || 'there'
        );
        setHasShownWelcome(true);
      }, 1000);
    }
  }, [profile, userRole, hasShownWelcome, showWelcome]);

  useEffect(() => {
    // Listen for navigation events from dashboard buttons
    const handleNavigateToAssessment = () => setActiveView('assessment');
    const handleNavigateToJobs = () => setActiveView('jobs');
    const handleNavigateToInterview = () => {
      if (profile?.subscription_status !== 'premium') {
        showUpgrade('Interview Practice', () => {
          // Handle upgrade logic here
          console.log('Upgrade to premium');
        });
        return;
      }
      setActiveView('interview');
    };

    window.addEventListener('navigate-to-assessment', handleNavigateToAssessment);
    window.addEventListener('navigate-to-jobs', handleNavigateToJobs);
    window.addEventListener('navigate-to-interview', handleNavigateToInterview);

    return () => {
      window.removeEventListener('navigate-to-assessment', handleNavigateToAssessment);
      window.removeEventListener('navigate-to-jobs', handleNavigateToJobs);
      window.removeEventListener('navigate-to-interview', handleNavigateToInterview);
    };
  }, [profile, showUpgrade]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setActiveView('dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Force a complete page refresh to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force refresh even if logout fails
      window.location.href = '/';
    }
  };

  // Show onboarding if user hasn't completed it
  if (showOnboarding) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <main className="flex-1 p-6">
          <OnboardingQuestionnaire onComplete={handleOnboardingComplete} />
        </main>
      </div>
    );
  }

  const renderContent = () => {
    if (userRole === 'admin') {
      return <AdminDashboard />;
    }

    switch (activeView) {
      case 'dashboard':
        return <UserDashboard />;
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
      case 'profile':
        return <EditableProfile />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          userRole={userRole} 
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-6 bg-background">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
