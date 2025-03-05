
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, QUESTION_TYPES } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/lib/auth";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2, ArrowLeft, ClipboardCheck, Download } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SurveyResults = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>({
    totalResponses: 0,
    averageRating: 0,
    questionStats: {}
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSession();

  useEffect(() => {
    if (!id || !user) return;
    fetchSurveyData();
  }, [id, user]);

  const fetchSurveyData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Fetch the survey
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .maybeSingle();
        
      if (formError) throw formError;
      
      if (!formData) {
        setError("Survey not found or you don't have permission to view it");
        setIsLoading(false);
        return;
      }
      
      setSurvey(formData);
      
      // 2. Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('form_id', id)
        .order('order', { ascending: true });
        
      if (questionsError) throw questionsError;
      
      setQuestions(questionsData || []);
      
      // 3. Fetch submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('form_id', id)
        .order('created_at', { ascending: false });
        
      if (submissionsError) throw submissionsError;
      
      setSubmissions(submissionsData || []);
      
      // 4. Calculate analytics for this specific survey
      if (submissionsData && submissionsData.length > 0) {
        processAnalytics(questionsData || [], submissionsData);
      }
      
    } catch (error: any) {
      console.error("Error fetching survey data:", error);
      setError(error.message || "Could not load the survey data");
      toast({
        title: "Error loading survey results",
        description: error.message || "Could not load the survey results",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processAnalytics = (questions: any[], submissions: any[]) => {
    const totalResponses = submissions.length;
    
    // Calculate average rating for this specific survey
    const sum = submissions.reduce((acc, submission) => acc + (submission.average_rating || 0), 0);
    const averageRating = totalResponses > 0 ? sum / totalResponses : 0;
    
    // Process each question's responses for this survey
    const questionStats: Record<string, any> = {};
    
    questions.forEach(question => {
      if (question.type === QUESTION_TYPES.RATING) {
        // For rating questions, calculate distribution
        const ratingCounts = [0, 0, 0, 0, 0]; // For 1-5 stars
        let totalAnswered = 0;
        
        submissions.forEach(submission => {
          const rating = submission.answers[question.id];
          if (rating && rating > 0 && rating <= 5) {
            ratingCounts[rating - 1]++;
            totalAnswered++;
          }
        });
        
        const ratingData = ratingCounts.map((count, index) => ({
          name: `${index + 1} Star${index > 0 ? 's' : ''}`,
          value: count,
          percentage: totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0
        }));
        
        questionStats[question.id] = {
          totalAnswered,
          average: totalAnswered > 0 
            ? ratingCounts.reduce((sum, count, index) => sum + count * (index + 1), 0) / totalAnswered
            : 0,
          distribution: ratingData
        };
        
      } else if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE && question.options) {
        // For multiple choice, count selections for each option
        const optionCounts: Record<string, number> = {};
        let totalSelections = 0;
        
        question.options.forEach((option: string) => {
          optionCounts[option] = 0;
        });
        
        submissions.forEach(submission => {
          const selections = submission.answers[question.id] || [];
          selections.forEach((selection: string) => {
            if (optionCounts[selection] !== undefined) {
              optionCounts[selection]++;
              totalSelections++;
            }
          });
        });
        
        const optionData = Object.entries(optionCounts).map(([name, value]) => ({
          name,
          value,
          percentage: totalSelections > 0 ? Math.round((value / submissions.length) * 100) : 0
        }));
        
        questionStats[question.id] = {
          totalAnswered: submissions.filter(s => 
            s.answers[question.id] && s.answers[question.id].length > 0
          ).length,
          totalSelections,
          distribution: optionData
        };
        
      } else if (question.type === QUESTION_TYPES.TEXT) {
        // For text responses, list all answers
        const textResponses = submissions
          .filter(s => s.answers[question.id] && s.answers[question.id].trim() !== '')
          .map(s => ({
            response: s.answers[question.id],
            timestamp: s.created_at
          }));
        
        questionStats[question.id] = {
          totalAnswered: textResponses.length,
          responses: textResponses
        };
      }
    });
    
    setAnalytics({
      totalResponses,
      averageRating,
      questionStats
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const exportSurveyData = () => {
    try {
      // Prepare the data to export
      const exportData = {
        surveyInfo: {
          name: survey?.restaurant_name || "Survey",
          createdAt: survey?.created_at || new Date().toISOString(),
          totalResponses: submissions.length
        },
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: q.options
        })),
        responses: submissions.map(s => ({
          id: s.id,
          submittedAt: s.created_at,
          answers: s.answers,
          averageRating: s.average_rating
        })),
        analytics: analytics
      };
      
      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `${survey?.restaurant_name || 'survey'}-results.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Survey data has been downloaded as JSON",
      });
    } catch (error: any) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: error.message || "Could not export survey data",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Survey Not Found</CardTitle>
            <CardDescription>{error || "The survey you're looking for does not exist or you don't have permission to view it."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto" 
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">{survey.restaurant_name}</h1>
          </div>
          <p className="text-muted-foreground mt-1">Survey Results and Analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/survey/${id}/share`)}
          >
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Share Survey
          </Button>
          <Button 
            variant="outline" 
            onClick={exportSurveyData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.totalResponses}</div>
                <p className="text-sm text-muted-foreground mt-1">Total survey submissions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.averageRating.toFixed(1)}</div>
                <p className="text-sm text-muted-foreground mt-1">Out of 5 stars</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {analytics.totalResponses > 0 ? '100%' : '0%'}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Of started surveys</p>
              </CardContent>
            </Card>
          </div>
          
          {analytics.totalResponses === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No responses received yet for this survey.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate(`/survey/${id}/share`)}
                >
                  Share your survey to collect responses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating questions summary */}
              {questions
                .filter(q => q.type === QUESTION_TYPES.RATING)
                .map((question, index) => {
                  const stats = analytics.questionStats[question.id];
                  if (!stats) return null;
                  
                  return (
                    <Card key={question.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{question.text}</CardTitle>
                        <CardDescription>Average rating: {stats.average.toFixed(1)}/5</CardDescription>
                      </CardHeader>
                      <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={stats.distribution}
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" name="Responses" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  );
                })
              }
              
              {/* Multiple choice questions summary */}
              {questions
                .filter(q => q.type === QUESTION_TYPES.MULTIPLE_CHOICE)
                .map((question, index) => {
                  const stats = analytics.questionStats[question.id];
                  if (!stats) return null;
                  
                  return (
                    <Card key={question.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{question.text}</CardTitle>
                        <CardDescription>{stats.totalAnswered} responses</CardDescription>
                      </CardHeader>
                      <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.distribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => 
                                percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                              }
                            >
                              {stats.distribution.map((_: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  );
                })
              }
            </div>
          )}
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          {questions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No questions found for this survey.</p>
              </CardContent>
            </Card>
          ) : (
            questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-xl">Question {index + 1}</CardTitle>
                  <CardDescription>{question.text}</CardDescription>
                </CardHeader>
                <CardContent>
                  {!analytics.questionStats[question.id] ? (
                    <p className="text-center text-muted-foreground py-4">No responses yet</p>
                  ) : question.type === QUESTION_TYPES.RATING ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold">
                          {analytics.questionStats[question.id].average.toFixed(1)}
                        </span>
                        <div className="text-sm text-muted-foreground">
                          Average rating from {analytics.questionStats[question.id].totalAnswered} responses
                        </div>
                      </div>
                      
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={analytics.questionStats[question.id].distribution}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" name="Number of Ratings" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : question.type === QUESTION_TYPES.MULTIPLE_CHOICE ? (
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        {analytics.questionStats[question.id].totalAnswered} respondents answered this question
                      </div>
                      
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.questionStats[question.id].distribution}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {analytics.questionStats[question.id].distribution.map((_: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground mb-4">
                        {analytics.questionStats[question.id].totalAnswered} text responses received
                      </div>
                      
                      {analytics.questionStats[question.id].responses.map((resp: any, i: number) => (
                        <div key={i} className="p-3 bg-muted rounded-md">
                          <p className="mb-1">{resp.response}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {formatDate(resp.timestamp)}
                          </p>
                        </div>
                      ))}
                      
                      {analytics.questionStats[question.id].responses.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          No text responses received yet
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Responses</CardTitle>
              <CardDescription>View all collected responses</CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No responses received yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {submissions.map((submission, index) => (
                    <Card key={submission.id} className="shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Response #{submissions.length - index}</CardTitle>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(submission.created_at)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          {questions.map((question) => (
                            <div key={question.id} className="border-b pb-3 last:border-0 last:pb-0">
                              <h4 className="text-sm font-medium">{question.text}</h4>
                              
                              <div className="mt-1">
                                {question.type === QUESTION_TYPES.RATING && (
                                  <div className="flex items-center">
                                    <span className="text-lg font-medium">
                                      {submission.answers[question.id] || "Not answered"}
                                    </span>
                                    {submission.answers[question.id] && (
                                      <span className="text-sm text-muted-foreground ml-2">
                                        out of 5
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
                                  <div>
                                    {!submission.answers[question.id] || submission.answers[question.id].length === 0 ? (
                                      <span className="text-muted-foreground text-sm">Not answered</span>
                                    ) : (
                                      <ul className="list-disc list-inside text-sm">
                                        {submission.answers[question.id].map((answer: string, i: number) => (
                                          <li key={i}>{answer}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                )}
                                
                                {question.type === QUESTION_TYPES.TEXT && (
                                  <div>
                                    {!submission.answers[question.id] || submission.answers[question.id].trim() === "" ? (
                                      <span className="text-muted-foreground text-sm">Not answered</span>
                                    ) : (
                                      <p className="text-sm bg-muted p-2 rounded">
                                        {submission.answers[question.id]}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurveyResults;
