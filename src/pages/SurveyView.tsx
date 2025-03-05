
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, QUESTION_TYPES } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/languageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Globe } from "lucide-react";

const SurveyView = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Effect to handle auto-redirect
  useEffect(() => {
    if (shouldRedirect && redirectUrl) {
      // Delayed redirect to ensure toast is seen
      const timer = setTimeout(() => {
        window.open(redirectUrl, '_blank');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, redirectUrl]);

  // Function to ensure we have an absolute URL
  function ensureAbsoluteUrl(url: string): string {
    if (url && !url.match(/^https?:\/\//i)) {
      return `https://${url}`;
    }
    return url;
  }

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching survey with ID:", id);
        
        const { data: formData, error: formError } = await supabase
          .from('forms')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (formError) {
          console.error("Error fetching form:", formError);
          throw formError;
        }
        
        if (!formData) {
          setError(t('surveyView.notFound'));
          setIsLoading(false);
          return;
        }
        
        console.log("Found survey:", formData);
        
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('form_id', id)
          .order('order', { ascending: true });
          
        if (questionsError) {
          console.error("Error fetching questions:", questionsError);
          throw questionsError;
        }
        
        console.log("Found questions:", questionsData?.length || 0);
        
        setSurvey(formData);
        setQuestions(questionsData || []);
        
        const initialAnswers: Record<string, any> = {};
        questionsData?.forEach(q => {
          if (q.type === QUESTION_TYPES.RATING) {
            initialAnswers[q.id] = 0;
          } else if (q.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
            initialAnswers[q.id] = [];
          } else {
            initialAnswers[q.id] = '';
          }
        });
        
        setAnswers(initialAnswers);
      } catch (error: any) {
        console.error("Error fetching survey:", error);
        setError(error.message || t('surveyView.notFound'));
        toast({
          title: t('common.error'),
          description: error.message || t('surveyView.notFound'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSurveyData();
  }, [id, toast, t]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultiChoiceChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const currentAnswers = [...(prev[questionId] || [])];
      
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, option]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter(item => item !== option)
        };
      }
    });
  };

  const submitSurvey = async () => {
    if (!survey || !id) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Submitting answers:", answers);
      
      const hasAnsweredSomething = Object.values(answers).some(answer => {
        if (Array.isArray(answer) && answer.length > 0) return true;
        if (typeof answer === 'number' && answer > 0) return true;
        if (typeof answer === 'string' && answer.trim() !== '') return true;
        return false;
      });
      
      if (!hasAnsweredSomething) {
        throw new Error(t('surveyView.answerAtLeastOne'));
      }
      
      const ratingQuestions = questions.filter(q => q.type === QUESTION_TYPES.RATING);
      const ratingValues = ratingQuestions
        .map(q => Number(answers[q.id]) || 0)
        .filter(val => val > 0);
      
      const averageRating = ratingValues.length > 0
        ? ratingValues.reduce((sum, val) => sum + val, 0) / ratingValues.length
        : 0;
      
      console.log("Average rating:", averageRating);
      
      const { error } = await supabase
        .from('submissions')
        .insert({
          form_id: survey.id,
          answers: answers,
          average_rating: averageRating
        });
        
      if (error) {
        console.error("Error submitting survey:", error);
        throw error;
      }
      
      toast({
        title: t('surveyView.thankYou'),
        description: t('surveyView.thankYouDesc')
      });
      
      setSubmissionSuccess(true);
      
      // Check if the rating meets the threshold for Google Maps redirection
      if (averageRating >= survey.minimum_positive_rating && survey.google_maps_url) {
        const absoluteUrl = ensureAbsoluteUrl(survey.google_maps_url);
        setRedirectUrl(absoluteUrl);
        setShouldRedirect(true);
        
        toast({
          title: t('surveyView.redirectingToGoogle'),
          description: t('surveyView.redirectingToGoogle')
        });
      }
      
    } catch (error: any) {
      console.error("Error submitting survey:", error);
      toast({
        title: t('surveyView.errorSubmitting'),
        description: error.message || t('common.error'),
        variant: "destructive"
      });
      setError(error.message || t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>{t('surveyView.notFound')}</CardTitle>
            <CardDescription>{t('surveyView.notFoundDesc')}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={() => window.history.back()}>{t('surveyView.goBack')}</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (submissionSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t('surveyView.thankYou')}</CardTitle>
            <CardDescription>{t('surveyView.thankYouDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {shouldRedirect && (
              <p className="text-center mb-4">
                {t('surveyView.redirectingToGoogle')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{survey.restaurant_name}</CardTitle>
          <CardDescription>{t('surveyView.shareFeedback')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.length === 0 ? (
            <p className="text-center text-muted-foreground">{t('surveyView.noQuestions')}</p>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="border-b pb-4 last:border-0">
                <h3 className="text-lg font-medium mb-2">{question.text}</h3>
                
                {question.type === QUESTION_TYPES.RATING && (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`w-12 h-12 rounded-full border ${
                          answers[question.id] === i + 1
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-primary/10'
                        } transition-colors flex items-center justify-center font-medium`}
                        onClick={() => handleAnswerChange(question.id, i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
                
                {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option: string, i: number) => (
                      <div key={i} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`${question.id}-${i}`}
                          className="h-4 w-4 rounded border-gray-300"
                          checked={answers[question.id]?.includes(option)}
                          onChange={(e) => handleMultiChoiceChange(question.id, option, e.target.checked)}
                        />
                        <label htmlFor={`${question.id}-${i}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === QUESTION_TYPES.TEXT && (
                  <Textarea
                    className="w-full"
                    rows={4}
                    placeholder={t('surveyView.enterResponse')}
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                )}
              </div>
            ))
          )}
        </CardContent>
        <CardFooter>
          {error && (
            <div className="text-red-500 mb-3 w-full text-center">{error}</div>
          )}
          <Button 
            className="w-full" 
            onClick={submitSurvey}
            disabled={isSubmitting || questions.length === 0}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                {t('surveyView.submitting')}
              </>
            ) : (
              t('surveyView.submitFeedback')
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SurveyView;
