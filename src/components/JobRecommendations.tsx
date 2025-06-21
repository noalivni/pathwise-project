
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bookmark, MapPin, DollarSign, Clock, Search, Filter, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const JobRecommendations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([]);

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$70,000 - $90,000",
      type: "Full-time",
      match: 95,
      description: "Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern web technologies.",
      skills: ["React", "TypeScript", "CSS", "JavaScript", "Git"],
      postedDate: "2 days ago"
    },
    {
      id: 2,
      title: "UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$65,000 - $85,000",
      type: "Full-time",
      match: 88,
      description: "Create intuitive and beautiful user experiences for our digital products. Work with cross-functional teams to deliver exceptional design solutions.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Adobe Creative Suite"],
      postedDate: "4 days ago"
    },
    {
      id: 3,
      title: "Data Analyst",
      company: "Analytics Pro",
      location: "Remote",
      salary: "$55,000 - $75,000",
      type: "Full-time",
      match: 82,
      description: "Analyze complex datasets to drive business decisions. Create insightful reports and visualizations using Python and SQL.",
      skills: ["Python", "SQL", "Tableau", "Excel", "Statistics"],
      postedDate: "1 week ago"
    },
    {
      id: 4,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Austin, TX",
      salary: "$80,000 - $100,000",
      type: "Full-time",
      match: 78,
      description: "Lead product strategy and development for our innovative SaaS platform. Work closely with engineering and design teams.",
      skills: ["Product Strategy", "Agile", "Analytics", "Roadmapping", "Stakeholder Management"],
      postedDate: "3 days ago"
    },
    {
      id: 5,
      title: "Junior Software Engineer",
      company: "CodeBase Solutions",
      location: "Seattle, WA",
      salary: "$60,000 - $75,000",
      type: "Full-time",
      match: 85,
      description: "Perfect for new graduates! Join our mentorship program while contributing to real-world projects using modern development practices.",
      skills: ["JavaScript", "Node.js", "React", "MongoDB", "Git"],
      postedDate: "5 days ago"
    },
    {
      id: 6,
      title: "Marketing Specialist",
      company: "Growth Marketing Co",
      location: "Los Angeles, CA",
      salary: "$50,000 - $65,000",
      type: "Full-time",
      match: 72,
      description: "Drive customer acquisition and retention through innovative marketing campaigns across digital channels.",
      skills: ["Digital Marketing", "Google Analytics", "Content Marketing", "SEO", "Social Media"],
      postedDate: "1 week ago"
    }
  ];

  const handleBookmark = (jobId: number) => {
    setBookmarkedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
    
    toast({
      title: bookmarkedJobs.includes(jobId) ? "Bookmark Removed" : "Job Bookmarked",
      description: bookmarkedJobs.includes(jobId) ? "Job removed from bookmarks" : "Job added to your bookmarks",
    });
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-green-500";
    if (match >= 80) return "bg-blue-500";
    if (match >= 70) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Job Recommendations</h1>
        <p className="text-slate-600 mt-2">Personalized job matches based on your skills and preferences</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search jobs, companies, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Job Cards */}
      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <Badge className={`${getMatchColor(job.match)} text-white`}>
                      {job.match}% Match
                    </Badge>
                  </div>
                  <CardDescription className="text-lg font-medium text-slate-700">
                    {job.company}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark(job.id)}
                  className="flex items-center gap-1"
                >
                  {bookmarkedJobs.includes(job.id) ? (
                    <Bookmark className="h-4 w-4 fill-current text-teal-600" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">{job.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {job.salary}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.type}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-slate-500">Posted {job.postedDate}</span>
                <div className="flex gap-2">
                  <Button variant="outline">Learn More</Button>
                  <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No jobs found</h3>
          <p className="text-slate-500">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
