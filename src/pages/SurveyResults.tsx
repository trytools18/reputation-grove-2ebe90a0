import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, QUESTION_TYPES, exportSurveyData } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/lib/auth";
import { Loader2, ArrowLeft, ClipboardCheck, Download, ListIcon } from "lucide-react";
import SummaryCards from "@/components/survey-results/SummaryCards";
import RatingQuestionSection from "@/components/survey-results/RatingQuestionSection";
import MultipleChoiceSection from "@/components/survey-results/MultipleChoiceSection";
import TextQuestionsSection from "@/components/survey-results/TextQuestionsSection";
import IndividualResponsesSection from "@/components/survey-results/IndividualResponsesSection";
import NoResponsesCard from "@/components/survey-results/NoResponsesCard";
const SurveyResults = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
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
  const {
    toast
  } = useToast();
  const {
    user
  } = useSession();
  useEffect(() => {
    if (!id || !user) return;
    fetchSurveyData();
  }, [id, user]);
  const fetchSurveyData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const {
        data: formData,
        error: formError
      } = await supabase.from('forms').select('*').eq('id', id).eq('user_id', user?.id).maybeSingle();
      if (formError) throw formError;
      if (!formData) {
        setError("Survey not found or you don't have permission to view it");
        setIsLoading(false);
        return;
      }
      setSurvey(formData);
      const {
        data: questionsData,
        error: questionsError
      } = await supabase.from('questions').select('*').eq('form_id', id).order('order', {
        ascending: true
      });
      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);
      const {
        data: submissionsData,
        error: submissionsError
      } = await supabase.from('submissions').select('*').eq('form_id', id).order('created_at', {
        ascending: false
      });
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
        description: error.message || "Could not load the survey data",
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
          percentage: totalAnswered > 0 ? Math.round(count / totalAnswered * 100) : 0
        }));
        questionStats[question.id] = {
          totalAnswered,
          average: totalAnswered > 0 ? ratingCounts.reduce((sum, count, index) => sum + count * (index + 1), 0) / totalAnswered : 0,
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
          percentage: totalSelections > 0 ? Math.round(value / submissions.length * 100) : 0
        }));
        questionStats[question.id] = {
          totalAnswered: submissions.filter(s => s.answers[question.id] && (Array.isArray(s.answers[question.id]) ? s.answers[question.id].length > 0 : s.answers[question.id] !== '')).length,
          totalSelections,
          distribution: optionData
        };
      } else if (question.type === QUESTION_TYPES.TEXT) {
        const textResponses = submissions.filter(s => s.answers[question.id] && s.answers[question.id].trim() !== '').map(s => ({
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
        description: "Survey data has been downloaded as JSON"
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
    return <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>;
  }
  if (error || !survey) {
    return <div className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Survey Not Found</CardTitle>
            <CardDescription>{error || "The survey you're looking for does not exist or you don't have permission to view it."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>;
  }
  const ratingQuestions = questions.filter(q => q.type === QUESTION_TYPES.RATING);
  const multipleChoiceQuestions = questions.filter(q => q.type === QUESTION_TYPES.MULTIPLE_CHOICE);
  const textQuestions = questions.filter(q => q.type === QUESTION_TYPES.TEXT);
  return <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            
            <h1 className="text-3xl font-bold">{survey.restaurant_name}</h1>
          </div>
          <p className="text-muted-foreground mt-1">Survey Results and Analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(`/survey/${id}/share`)}>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Share Survey
          </Button>
          <Button variant="outline" onClick={handleExportData}>
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
          <SummaryCards totalResponses={analytics.totalResponses} averageRating={analytics.averageRating} completionRate={analytics.totalResponses > 0 ? '100%' : '0%'} />
          
          {analytics.totalResponses === 0 ? <NoResponsesCard surveyId={id || ''} /> : <div className="space-y-8">
              <RatingQuestionSection questions={ratingQuestions} analytics={analytics} />
              
              <MultipleChoiceSection questions={multipleChoiceQuestions} analytics={analytics} />
              
              <TextQuestionsSection questions={textQuestions} analytics={analytics} formatDate={formatDate} />
            </div>}
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50 rounded-t-lg border-b">
              <CardTitle>Individual Responses</CardTitle>
              <CardDescription>View all collected responses</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <IndividualResponsesSection submissions={submissions} questions={questions} formatDate={formatDate} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default SurveyResults;