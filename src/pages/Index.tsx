
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, BookOpen, Users, TrendingUp, Shield } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');

  const handleLogin = (role: 'user' | 'admin') => {
    setIsLoggedIn(true);
    setUserRole(role);
    setShowAuthModal(false);
  };

  if (isLoggedIn) {
    return <Dashboard userRole={userRole} onLogout={() => setIsLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Pathwise
            </span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => setShowAuthModal(true)}>
              Sign In
            </Button>
            <Button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-teal-100 text-teal-700 hover:bg-teal-200">
          AI-Powered Career Guidance
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-teal-700 to-blue-700 bg-clip-text text-transparent">
          Find Your Perfect
          <br />
          Career Path
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          AI-powered platform helping recent graduates and career changers identify suitable paths, 
          upskill effectively, and ace their interviews.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-lg px-8 py-6"
          >
            Start Your Journey
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
            View Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            From career assessment to interview preparation, we've got you covered
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <Target className="w-12 h-12 text-teal-600 mb-4" />
              <CardTitle>Smart Career Matching</CardTitle>
              <CardDescription>
                AI-powered recommendations based on your skills, interests, and market demand
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Personalized Learning</CardTitle>
              <CardDescription>
                Curated resources and courses tailored to your career goals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <Users className="w-12 h-12 text-teal-600 mb-4" />
              <CardTitle>Interview Practice</CardTitle>
              <CardDescription>
                AI-powered mock interviews with real-time feedback and coaching
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>
                Comprehensive evaluation of your current skills and growth opportunities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <Shield className="w-12 h-12 text-teal-600 mb-4" />
              <CardTitle>Resume Builder</CardTitle>
              <CardDescription>
                Professional resume templates optimized for your target roles
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <Brain className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>
                Data-driven insights about industry trends and career opportunities
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who've found their perfect career path
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowAuthModal(true)}
            className="bg-white text-teal-600 hover:bg-slate-100 text-lg px-8 py-6"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      <AuthModal 
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
