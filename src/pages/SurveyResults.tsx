import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, QUESTION_TYPES, exportSurveyData } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/lib/auth";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2, ArrowLeft, ClipboardCheck, Download, ListIcon, Badge } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SurveyResults = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
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
      
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('form_id', id)
        .order('order', { ascending: true });
        
      if (questionsError) throw questionsError;
      
      setQuestions(questionsData || []);
      
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('form_id', id)
        .order('created_at', { ascending: false });
        
      if (submissionsError) throw submissionsError;
      
      setSubmissions(submissionsData || []);
      
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
    
    const sum = submissions.reduce((acc, submission) => acc + (submission.average_rating || 0), 0);
    const averageRating = totalResponses > 0 ? sum / totalResponses : 0;
    
    const questionStats: Record<string, any> = {};
    
    questions.forEach(question => {
      if (question.type === QUESTION_TYPES.RATING) {
        const ratingCounts = [0, 0, 0, 0, 0];
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
        const optionCounts: Record<string, number> = {};
        let totalSelections = 0;
        
        question.options.forEach((option: string) => {
          optionCounts[option] = 0;
        });
        
        submissions.forEach(submission => {
          const selections = submission.answers[question.id] || [];
          if (Array.isArray(selections)) {
            selections.forEach((selection: string) => {
              if (optionCounts[selection] !== undefined) {
                optionCounts[selection]++;
                totalSelections++;
              }
            });
          } else if (typeof selections === 'string') {
            if (optionCounts[selections] !== undefined) {
              optionCounts[selections]++;
              totalSelections++;
            }
          }
        });
        
        const optionData = Object.entries(optionCounts).map(([name, value]) => ({
          name,
          value,
          percentage: totalSelections > 0 ? Math.round((value / submissions.length) * 100) : 0
        }));
        
        questionStats[question.id] = {
          totalAnswered: submissions.filter(s => 
            s.answers[question.id] && 
            (Array.isArray(s.answers[question.id]) ? 
              s.answers[question.id].length > 0 : 
              s.answers[question.id] !== '')
          ).length,
          totalSelections,
          distribution: optionData
        };
        
      } else if (question.type === QUESTION_TYPES.TEXT) {
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

  const handleExportData = () => {
    if (exportSurveyData(survey, questions, submissions, analytics)) {
      toast({
        title: "Export successful",
        description: "Survey data has been downloaded as JSON",
      });
    } else {
      toast({
        title: "Export failed",
        description: "Could not export survey data",
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

  const ratingQuestions = questions.filter(q => q.type === QUESTION_TYPES.RATING);
  const multipleChoiceQuestions = questions.filter(q => q.type === QUESTION_TYPES.MULTIPLE_CHOICE);
  const textQuestions = questions.filter(q => q.type === QUESTION_TYPES.TEXT);

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
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center">
            Overview & Questions
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center">
            <ListIcon className="h-4 w-4 mr-2" />
            Individual Responses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
            <div className="space-y-8">
              {ratingQuestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rating Questions</CardTitle>
                    <CardDescription>Results from rating-based questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-10">
                      {ratingQuestions.map((question, index) => {
                        const stats = analytics.questionStats[question.id];
                        if (!stats) return null;
                        
                        return (
                          <div key={question.id} className="border-b pb-8 last:border-0 last:pb-0">
                            <h3 className="text-xl font-semibold mb-2">{question.text}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={stats.distribution}
                                      cx="50%"
                                      cy="50%"
                                      labelLine={true}
                                      outerRadius={80}
                                      fill="#8884d8"
                                      dataKey="value"
                                      label={({ name, percentage }) => 
                                        percentage > 0 ? `${name}: ${percentage}%` : ''
                                      }
                                    >
                                      {stats.distribution.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="flex flex-col justify-center space-y-2">
                                <div className="flex items-center">
                                  <Badge variant="success" className="mr-2">Average</Badge>
                                  <span className="text-2xl font-bold">{stats.average.toFixed(1)} ★</span>
                                </div>
                                <div className="flex items-center">
                                  <Badge variant="secondary" className="mr-2">Responses</Badge>
                                  <span>{stats.totalAnswered} answers</span>
                                </div>
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Rating Distribution</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {stats.distribution.map((item: any) => (
                                      <li key={item.name} className="text-sm">
                                        {item.name}: {item.percentage}% ({item.value} responses)
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {multipleChoiceQuestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Multiple-Choice Questions</CardTitle>
                    <CardDescription>Results from selection-based questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-10">
                      {multipleChoiceQuestions.map((question, index) => {
                        const stats = analytics.questionStats[question.id];
                        if (!stats) return null;
                        
                        return (
                          <div key={question.id} className="border-b pb-8 last:border-0 last:pb-0">
                            <h3 className="text-xl font-semibold mb-2">{question.text}</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    layout="vertical"
                                    data={stats.distribution}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis 
                                      type="category" 
                                      dataKey="name" 
                                      width={150}
                                      tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
                                    <Bar dataKey="value" name="Responses" fill="#82ca9d" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="flex flex-col justify-center space-y-2">
                                <div className="flex items-center">
                                  <Badge variant="secondary" className="mr-2">Respondents</Badge>
                                  <span>{stats.totalAnswered} people answered</span>
                                </div>
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Response Distribution</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {stats.distribution.map((item: any) => (
                                      <li key={item.name} className="text-sm">
                                        {item.name}: {item.percentage}% ({item.value} responses)
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {textQuestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Text Questions</CardTitle>
                    <CardDescription>Free-form text responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {textQuestions.map((question) => {
                        const stats = analytics.questionStats[question.id];
                        if (!stats) return null;
                        
                        return (
                          <div key={question.id} className="border-b pb-6 last:border-0 last:pb-0">
                            <h3 className="text-xl font-semibold mb-2">{question.text}</h3>
                            <div className="flex items-center mb-4">
                              <Badge variant="secondary" className="mr-2">Responses</Badge>
                              <span>{stats.totalAnswered} text answers</span>
                            </div>
                            
                            {stats.responses.length > 0 ? (
                              <div className="space-y-3 max-h-64 overflow-y-auto p-1">
                                {stats.responses.map((resp: any, i: number) => (
                                  <div key={i} className="p-3 bg-muted rounded-md">
                                    <p className="mb-1">{resp.response}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Submitted: {formatDate(resp.timestamp)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground italic">No text responses received yet</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
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
                                    {!submission.answers[question.id] || 
                                     (Array.isArray(submission.answers[question.id]) && submission.answers[question.id].length === 0) ||
                                     (!Array.isArray(submission.answers[question.id]) && submission.answers[question.id] === '') ? (
                                      <span className="text-muted-foreground text-sm">Not answered</span>
                                    ) : (
                                      <ul className="list-disc list-inside text-sm">
                                        {Array.isArray(submission.answers[question.id]) ? 
                                          submission.answers[question.id].map((answer: string, i: number) => (
                                            <li key={i}>{answer}</li>
                                          )) : 
                                          <li>{submission.answers[question.id]}</li>
                                        }
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
