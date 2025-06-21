import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import AuthModal from "@/components/AuthModal";
import Dashboard from "@/components/Dashboard";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Brain, Target, Users, BookOpen, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSignUp = () => {
    setIsSignUp(true);
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setIsSignUp(false);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Pathwise
            </span>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSignIn}
              variant="outline"
              className="border-teal-200 text-teal-700 hover:bg-teal-50"
            >
              Sign In (Returning Users)
            </Button>
            <Button 
              onClick={handleSignUp}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            >
              Sign Up (New Users)
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-slate-800 mb-6">
          Your AI-Powered <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Career Companion</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
          Discover your perfect career path with personalized assessments, job recommendations, 
          and AI-powered guidance tailored just for you.
        </p>
        <Button 
          size="lg"
          onClick={handleSignUp}
          className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-lg px-8 py-6"
        >
          Start Your Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          Everything You Need to Succeed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Skills Assessment</h3>
            <p className="text-slate-600">
              Discover your strengths and areas for growth with our comprehensive assessment.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Job Matching</h3>
            <p className="text-slate-600">
              Get personalized job recommendations based on your skills and preferences.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Learning Resources</h3>
            <p className="text-slate-600">
              Access curated learning materials to develop the skills you need.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Guidance</h3>
            <p className="text-slate-600">
              Get personalized career advice and interview practice powered by AI.
            </p>
          </div>
        </div>
      </section>

      <AuthModal 
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLogin={() => setShowAuthModal(false)}
        initialMode={isSignUp ? 'signup' : 'signin'}
      />
    </div>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    if (user) {
      // Check if user is admin based on email
      const isAdmin = user.email === "admin@pathwise.com";
      setUserRole(isAdmin ? 'admin' : 'user');
    }
  }, [user]);

  const handleLogout = async () => {
    // This will be handled by the auth context
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard userRole={userRole} onLogout={handleLogout} />;
  }

  return <LandingPage />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
};

export default Index;
