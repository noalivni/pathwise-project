
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import AuthModal from "@/components/AuthModal";
import Dashboard from "@/components/Dashboard";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Target, Users, BookOpen, ArrowRight } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/c4491739-e997-4ba2-8b03-ce1daa476a86.png" 
              alt="Pathwise Logo" 
              className="w-12 h-12"
            />
            <span className="text-3xl font-bold text-foreground">
              Pathwise
            </span>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSignIn}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Sign In
            </Button>
            <Button 
              onClick={handleSignUp}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/c4491739-e997-4ba2-8b03-ce1daa476a86.png" 
            alt="Pathwise Logo" 
            className="w-20 h-20 mx-auto mb-6 opacity-90"
          />
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-6">
          <TextShimmer
            duration={1.2}
            className="text-5xl font-bold [--base-color:theme(colors.indigo.600)] [--base-gradient-color:theme(colors.indigo.300)] dark:[--base-color:theme(colors.indigo.700)] dark:[--base-gradient-color:theme(colors.indigo.400)]"
            as="span"
          >
            Your AI-Powered Career Companion
          </TextShimmer>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Discover your perfect career path with personalized assessments, job recommendations, 
          and AI-powered guidance tailored just for you.
        </p>
        <Button 
          size="lg"
          onClick={handleSignUp}
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 transition-all duration-200 hover:scale-105"
        >
          Start Your Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Everything You Need to Succeed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Skills Assessment</h3>
            <p className="text-muted-foreground">
              Discover your strengths and areas for growth with our comprehensive assessment.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200">
            <div className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Job Matching</h3>
            <p className="text-muted-foreground">
              Get personalized job recommendations based on your skills and preferences.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200">
            <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Learning Resources</h3>
            <p className="text-muted-foreground">
              Access curated learning materials to develop the skills you need.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200">
            <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <img 
                src="/lovable-uploads/c4491739-e997-4ba2-8b03-ce1daa476a86.png" 
                alt="AI Guidance" 
                className="w-8 h-8 opacity-80"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">AI Guidance</h3>
            <p className="text-muted-foreground">
              Get personalized career advice and interview practice powered by AI.
            </p>
          </div>
        </div>
      </section>

      <AuthModal 
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLogin={() => setShowAuthModal(false)}
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img 
            src="/lovable-uploads/c4491739-e997-4ba2-8b03-ce1daa476a86.png" 
            alt="Pathwise Logo" 
            className="w-16 h-16 mx-auto mb-4 animate-pulse"
          />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
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
