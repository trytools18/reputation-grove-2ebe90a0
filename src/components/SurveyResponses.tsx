
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, PieChart, Pie, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SurveyResponsesProps {
  surveyId: string;
}

const SurveyResponses = ({ surveyId }: SurveyResponsesProps) => {
  const [responses, setResponses] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<{
    ratingData: any[];
    choiceData: any[];
  }>({
    ratingData: [],
    choiceData: []
  });

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      if (!surveyId) return;
      
      setIsLoading(true);
      try {
        // Fetch questions for this survey
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('form_id', surveyId)
          .order('order', { ascending: true });
          
        if (questionsError) throw questionsError;
        
        // Fetch submissions for this survey
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('submissions')
          .select('*')
          .eq('form_id', surveyId);
          
        if (submissionsError) throw submissionsError;
        
        setQuestions(questionsData || []);
        setResponses(submissionsData || []);
        
        // Generate analytics data
        generateAnalytics(questionsData || [], submissionsData || []);
      } catch (error) {
        console.error("Error fetching survey details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSurveyDetails();
  }, [surveyId]);
  
  const generateAnalytics = (questions: any[], submissions: any[]) => {
    // Process rating questions
    const ratingQuestions = questions.filter(q => q.type === 'rating');
    const ratingData = ratingQuestions.map(question => {
      const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      submissions.forEach(sub => {
        const answers = sub.answers;
        if (answers[question.id] && typeof answers[question.id] === 'number') {
          const rating = Math.round(answers[question.id]);
          if (rating >= 1 && rating <= 5) {
            ratings[rating as keyof typeof ratings]++;
          }
        }
      });
      
      return {
        questionId: question.id,
        questionText: question.text,
        data: [
          { name: "1 Star", value: ratings[1] },
          { name: "2 Stars", value: ratings[2] },
          { name: "3 Stars", value: ratings[3] },
          { name: "4 Stars", value: ratings[4] },
          { name: "5 Stars", value: ratings[5] }
        ]
      };
    });
    
    // Process multiple choice questions
    const choiceQuestions = questions.filter(q => q.type === 'multiple-choice');
    const choiceData = choiceQuestions.map(question => {
      const options = question.options || [];
      const counts: Record<string, number> = {};
      
      // Initialize counts for each option
      options.forEach((opt: string) => {
        counts[opt] = 0;
      });
      
      submissions.forEach(sub => {
        const answers = sub.answers;
        if (answers[question.id] && typeof answers[question.id] === 'string') {
          const choice = answers[question.id];
          if (counts[choice] !== undefined) {
            counts[choice]++;
          }
        }
      });
      
      return {
        questionId: question.id,
        questionText: question.text,
        data: Object.entries(counts).map(([name, value]) => ({ name, value }))
      };
    });
    
    setAnalytics({ ratingData, choiceData });
  };

  const formatAnswers = (submission: any, questions: any[]) => {
    if (!submission.answers || typeof submission.answers !== 'object') {
      return <p className="text-sm text-muted-foreground">No data available</p>;
    }
    
    return (
      <div className="space-y-4">
        {questions.map(question => {
          const answer = submission.answers[question.id];
          if (answer === undefined || answer === null) return null;
          
          return (
            <div key={question.id} className="border-b pb-3">
              <h4 className="font-medium text-sm">{question.text}</h4>
              {question.type === 'rating' && (
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(answer) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm">{answer}</span>
                </div>
              )}
              {question.type === 'multiple-choice' && (
                <p className="text-sm mt-1">{answer}</p>
              )}
              {question.type === 'text' && (
                <p className="text-sm mt-1">{answer}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Responses Yet</CardTitle>
          <CardDescription>This survey hasn't received any submissions</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Share your survey to start collecting responses
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Response Analytics</h3>
        
        {analytics.ratingData.length > 0 && (
          <div className="space-y-6">
            <h4 className="text-md font-medium">Rating Questions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analytics.ratingData.map((item) => (
                <Card key={item.questionId}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{item.questionText}</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={item.data}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {item.data.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} responses`, ""]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {analytics.choiceData.length > 0 && (
          <div className="space-y-6 mt-8">
            <h4 className="text-md font-medium">Multiple Choice Questions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analytics.choiceData.map((item) => (
                <Card key={item.questionId}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{item.questionText}</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={item.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} responses`, ""]} />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Individual Responses ({responses.length})</h3>
        <div className="space-y-4">
          {responses.map((response, index) => (
            <Card key={response.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-sm font-medium">
                    Response #{index + 1}
                  </CardTitle>
                  <Badge variant={response.average_rating >= 4 ? "success" : "default"}>
                    {response.average_rating} / 5
                  </Badge>
                </div>
                <CardDescription>
                  Submitted on {new Date(response.created_at).toLocaleDateString()} at {new Date(response.created_at).toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formatAnswers(response, questions)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveyResponses;
