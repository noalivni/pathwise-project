
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Play, Clock, Star, Search, Crown, ExternalLink } from "lucide-react";

const LearningResources = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    {
      id: 1,
      title: "Complete React Developer Course",
      provider: "TechAcademy",
      duration: "8 weeks",
      rating: 4.8,
      students: 12543,
      level: "Intermediate",
      price: "$99",
      category: "Web Development",
      description: "Master React from basics to advanced concepts including hooks, context, and testing.",
      skills: ["React", "JavaScript", "HTML/CSS", "Testing"]
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      provider: "DataLearn",
      duration: "12 weeks",
      rating: 4.9,
      students: 8932,
      level: "Beginner",
      price: "$149",
      category: "Data Science",
      description: "Learn Python, statistics, and machine learning fundamentals for data science.",
      skills: ["Python", "Statistics", "Machine Learning", "Data Visualization"]
    },
    {
      id: 3,
      title: "UX Design Masterclass",
      provider: "DesignPro",
      duration: "6 weeks",
      rating: 4.7,
      students: 5621,
      level: "Intermediate",
      price: "$79",
      category: "Design",
      description: "Complete guide to user experience design with real-world projects.",
      skills: ["Figma", "User Research", "Prototyping", "Design Thinking"]
    },
    {
      id: 4,
      title: "Digital Marketing Strategy",
      provider: "MarketingHub",
      duration: "4 weeks",
      rating: 4.6,
      students: 3421,
      level: "Beginner",
      price: "$59",
      category: "Marketing",
      description: "Build comprehensive digital marketing campaigns across multiple channels.",
      skills: ["SEO", "Social Media", "Google Ads", "Analytics"]
    }
  ];

  const articles = [
    {
      id: 1,
      title: "10 Essential Skills for Frontend Developers in 2024",
      author: "Sarah Chen",
      readTime: "8 min read",
      category: "Web Development",
      publishedDate: "2 days ago",
      excerpt: "Discover the most in-demand frontend skills and how to master them."
    },
    {
      id: 2,
      title: "How to Transition from Junior to Senior Developer",
      author: "Michael Rodriguez",
      readTime: "12 min read",
      category: "Career Growth",
      publishedDate: "1 week ago",
      excerpt: "A comprehensive guide on advancing your development career."
    },
    {
      id: 3,
      title: "The Future of UX Design: Emerging Trends",
      author: "Emily Johnson",
      readTime: "6 min read",
      category: "Design",
      publishedDate: "3 days ago",
      excerpt: "Explore the latest trends shaping the future of user experience design."
    }
  ];

  const books = [
    {
      id: 1,
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      rating: 4.9,
      category: "Software Development",
      description: "A must-read for any developer looking to write better, cleaner code."
    },
    {
      id: 2,
      title: "The Design of Everyday Things",
      author: "Don Norman",
      rating: 4.7,
      category: "Design",
      description: "Fundamental principles of good design and user experience."
    },
    {
      id: 3,
      title: "Lean Analytics",
      author: "Alistair Croll & Benjamin Yoskovitz",
      rating: 4.6,
      category: "Data Analytics",
      description: "Use data to build a better startup and make informed decisions."
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-700";
      case "Intermediate": return "bg-yellow-100 text-yellow-700";
      case "Advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Learning Resources</h1>
          <p className="text-slate-600 mt-2">Curated content to advance your career</p>
        </div>
        <Badge className="bg-gradient-to-r from-teal-500 to-blue-600 text-white flex items-center gap-1">
          <Crown className="h-4 w-4" />
          PRO Feature
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search courses, articles, or books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                      <CardDescription>{course.provider}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-teal-600">{course.price}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        {course.rating}
                      </div>
                    </div>
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Preview
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                      <Play className="mr-2 h-4 w-4" />
                      Enroll
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles" className="space-y-6">
          <div className="grid gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                      <CardDescription>
                        By {article.author} • {article.readTime} • {article.publishedDate}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600">{article.excerpt}</p>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read Article
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="books" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      <span className="text-sm">{book.rating}</span>
                    </div>
                    <Badge variant="outline">{book.category}</Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600">{book.description}</p>
                  
                  <Button variant="outline" className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Book
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningResources;
