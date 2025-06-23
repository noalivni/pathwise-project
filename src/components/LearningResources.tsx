
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import ProUpgradeNotice from "@/components/learningResources/ProUpgradeNotice";
import JobRecommendationsTab from "@/components/learningResources/JobRecommendationsTab";
import SkillsDevelopmentTab from "@/components/learningResources/SkillsDevelopmentTab";
import EnhancedLearningResources from "@/components/EnhancedLearningResources";

const LearningResources = () => {
  const { user, profile } = useAuth();
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [loading, setLoading] = useState(true);

  const isPro = profile?.subscription_status === 'premium';

  useEffect(() => {
    // Show enhanced version if user has completed assessments
    const checkForAssessments = async () => {
      if (!user || !isPro) return;

      try {
        const { data: assessments } = await supabase
          .from('skills_assessments')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (assessments && assessments.length > 0) {
          setShowEnhanced(true);
        }
      } catch (error) {
        console.error('Error checking assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      if (isPro) {
        checkForAssessments();
      } else {
        setLoading(false);
      }
    }
  }, [user, isPro]);

  // If user has assessments and is pro, show enhanced version
  if (showEnhanced && isPro) {
    return <EnhancedLearningResources />;
  }

  // If not pro, show upgrade notice
  if (!isPro) {
    return <ProUpgradeNotice />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-pathwise-text-muted">Loading learning resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-pathwise-text">Learning Resources</h1>
          <p className="text-pathwise-text-muted mt-2">Personalized learning materials based on your career goals</p>
        </div>
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
          <Crown className="w-3 h-3 mr-1" />
          Pro Feature
        </Badge>
      </div>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">Job Recommendations</TabsTrigger>
          <TabsTrigger value="skills">Skills Development</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="space-y-6">
          <JobRecommendationsTab />
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-6">
          <SkillsDevelopmentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningResources;
