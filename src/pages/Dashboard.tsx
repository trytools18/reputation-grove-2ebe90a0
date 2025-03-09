
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pie, PieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PlusCircle, BarChart as BarChartIcon, PieChart as PieChartIcon, ArrowUpRight, Trash2, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useUserProfile } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [surveys, setSurveys] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useSession();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data: surveysData, error: surveysError } = await supabase
          .from('forms')
          .select('*')
          .eq('user_id', user.id);
          
        if (surveysError) throw surveysError;
        
        if (surveysData && surveysData.length > 0) {
          const surveyIds = surveysData.map(survey => survey.id);
          
          const { data: submissionsData, error: submissionsError } = await supabase
            .from('submissions')
            .select('*')
            .in('form_id', surveyIds);
            
          if (submissionsError) throw submissionsError;
          
          setSubmissions(submissionsData || []);
        }
        
        setSurveys(surveysData || []);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error fetching data",
          description: error.message || "Could not load dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);

  const handleDeleteSurvey = (surveyId: string) => {
    setSurveyToDelete(surveyId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteSurvey = async () => {
    if (!surveyToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error: questionsError } = await supabase
        .from('questions')
        .delete()
        .eq('form_id', surveyToDelete);
        
      if (questionsError) throw questionsError;
      
      const { error: submissionsError } = await supabase
        .from('submissions')
        .delete()
        .eq('form_id', surveyToDelete);
        
      if (submissionsError) throw submissionsError;
      
      const { error: surveyError } = await supabase
        .from('forms')
        .delete()
        .eq('id', surveyToDelete);
        
      if (surveyError) throw surveyError;
      
      setSurveys(surveys.filter(survey => survey.id !== surveyToDelete));
      setSubmissions(submissions.filter(sub => sub.form_id !== surveyToDelete));
      
      toast({
        title: "Survey deleted",
        description: "Survey and all related data have been deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting survey:", error);
      toast({
        title: "Error deleting survey",
        description: error.message || "Could not delete the survey",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setSurveyToDelete(null);
    }
  };

  const ratingDistribution = [
    { name: '1 Star', value: submissions.filter(s => Math.round(s.average_rating) === 1).length },
    { name: '2 Stars', value: submissions.filter(s => Math.round(s.average_rating) === 2).length },
    { name: '3 Stars', value: submissions.filter(s => Math.round(s.average_rating) === 3).length },
    { name: '4 Stars', value: submissions.filter(s => Math.round(s.average_rating) === 4).length },
    { name: '5 Stars', value: submissions.filter(s => Math.round(s.average_rating) === 5).length },
  ];
  
  const surveyPerformanceData = surveys.map(survey => {
    const surveySubs = submissions.filter(sub => sub.form_id === survey.id);
    return {
      name: survey.restaurant_name.substring(0, 15) + (survey.restaurant_name.length > 15 ? '...' : ''),
      submissions: surveySubs.length,
      averageRating: surveySubs.length > 0 
        ? (surveySubs.reduce((acc, curr) => acc + curr.average_rating, 0) / surveySubs.length).toFixed(1)
        : 0,
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {profile?.business_name || "User"}</h1>
          <p className="text-muted-foreground mt-1">Monitor your feedback and analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => navigate("/templates")}
            variant="outline"
          >
            Use Template
          </Button>
          <Button 
            onClick={() => navigate("/create-survey")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Survey
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{surveys.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {surveys.length === 0 ? "No surveys created yet" : "Surveys created to date"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{submissions.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {submissions.length === 0 ? "No responses received yet" : "Responses collected to date"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {submissions.length > 0 
                    ? (submissions.reduce((sum, sub) => sum + sub.average_rating, 0) / submissions.length).toFixed(1)
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {submissions.length === 0 ? "No ratings received yet" : "Average rating across all surveys"}
                </p>
              </CardContent>
            </Card>
          </div>

          {surveys.length === 0 ? (
            <div className="mt-8 text-center py-12 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-medium mb-2">No surveys created yet</h3>
              <p className="text-muted-foreground mb-4">Create your first survey or use a template to get started</p>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/templates")}
                >
                  Use Template
                </Button>
                <Button onClick={() => navigate("/create-survey")}>
                  Create Survey
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Feedback</CardTitle>
                  <CardDescription>The latest feedback from your customers</CardDescription>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded">
                      <p className="text-muted-foreground">No feedback received yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.slice(0, 5).map((submission, index) => {
                        const survey = surveys.find(s => s.id === submission.form_id);
                        return (
                          <div key={index} className="border rounded-md p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{survey?.restaurant_name || "Survey"}</h4>
                                <div className="flex mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.round(submission.average_rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
                                      }`}
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    {submission.average_rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <Badge variant={submission.average_rating >= 4 ? "success" : "default"}>
                                {submission.average_rating >= 4 ? "Positive" : "Neutral"}
                              </Badge>
                            </div>
                            <p className="text-sm mt-2 text-muted-foreground">
                              Submitted {new Date(submission.created_at).toLocaleDateString()}
                            </p>
                            <div className="mt-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-sm text-primary p-0 h-auto"
                                onClick={() => navigate(`/survey/${submission.form_id}/results`)}
                              >
                                View details <ArrowUpRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
                {submissions.length > 0 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("analytics")}>
                      View All Analytics
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="surveys">
          <div className="grid grid-cols-1 gap-6">
            {surveys.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium mb-2">No surveys created yet</h3>
                <p className="text-muted-foreground mb-4">Create your first survey or use a template to get started</p>
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/templates")}
                  >
                    Use Template
                  </Button>
                  <Button onClick={() => navigate("/create-survey")}>
                    Create Survey
                  </Button>
                </div>
              </div>
            ) : (
              surveys.map((survey) => {
                const surveySubs = submissions.filter(sub => sub.form_id === survey.id);
                const avgRating = surveySubs.length > 0 
                  ? surveySubs.reduce((sum, sub) => sum + sub.average_rating, 0) / surveySubs.length
                  : 0;
                
                return (
                  <Card key={survey.id} className="relative overflow-hidden">
                    <CardHeader>
                      <CardTitle>{survey.restaurant_name}</CardTitle>
                      <CardDescription>
                        Created on {new Date(survey.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Responses</h4>
                          <p className="text-2xl font-bold">{surveySubs.length}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Average Rating</h4>
                          <div className="flex items-center">
                            <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                            <div className="ml-2 flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
                                  }`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Google Maps URL</h4>
                          <a 
                            href={survey.google_maps_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline inline-flex items-center"
                          >
                            View link <ArrowUpRight className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/survey/${survey.id}`)}>
                          View Form
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeleteSurvey(survey.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/survey/${survey.id}/results`)}
                        >
                          <BarChart2 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                        <Button variant="default" size="sm" onClick={() => navigate(`/survey/${survey.id}/share`)}>
                          Share Survey
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {submissions.length === 0 ? (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No Analytics Available</CardTitle>
                  <CardDescription>Analytics will appear here after you receive feedback</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Share your survey with customers to start collecting feedback
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab("surveys")}>
                    View Surveys
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Rating Distribution</CardTitle>
                      <CardDescription>How customers are rating your business</CardDescription>
                    </div>
                    <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={ratingDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {ratingDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Survey Performance</CardTitle>
                      <CardDescription>Comparison of your surveys</CardDescription>
                    </div>
                    <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={surveyPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="submissions" fill="#8884d8" name="Submissions" />
                        <Bar dataKey="averageRating" fill="#82ca9d" name="Avg. Rating" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      Click on "Analytics" button on any survey card to see detailed survey analytics
                    </p>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this survey?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the survey and all of its data, 
              including questions and submissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteSurvey}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Survey"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
