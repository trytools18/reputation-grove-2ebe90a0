
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, QUESTION_TYPES, DB_TO_FRONTEND_TYPE } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const SurveyView = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching survey with ID:", id);
        
        // Get the form data without user_id restriction for public access
        const { data: formData, error: formError } = await supabase
          .from('forms')
          .select('*')
          .eq('id', id)
          .single();
          
        if (formError) {
          console.error("Error fetching form:", formError);
          throw formError;
        }
        
        if (!formData) {
          setError("Survey not found");
          setIsLoading(false);
          return;
        }
        
        console.log("Found survey:", formData);
        
        // Get the questions associated with this form
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('form_id', id)
          .order('order', { ascending: true });
          
        if (questionsError) {
          console.error("Error fetching questions:", questionsError);
          throw questionsError;
        }
        
        if (!questionsData || questionsData.length === 0) {
          console.log("No questions found for survey");
        } else {
          console.log("Found questions:", questionsData.length);
        }
        
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
        setError(error.message || "Could not load the survey");
        toast({
          title: "Error loading survey",
          description: error.message || "Could not load the survey",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSurveyData();
  }, [id, toast]);

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
    if (!survey) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting answers:", answers);
      
      const ratingQuestions = questions.filter(q => q.type === QUESTION_TYPES.RATING);
      const ratingValues = ratingQuestions.map(q => Number(answers[q.id]) || 0);
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
        title: "Thank you for your feedback!",
        description: "Your responses have been submitted successfully."
      });
      
      // If the average rating is high enough and there's a Google Maps URL, redirect
      if (averageRating >= survey.minimum_positive_rating && survey.google_maps_url) {
        toast({
          title: "Redirecting to Google Maps",
          description: "Please leave a review there as well!"
        });
        
        setTimeout(() => {
          window.location.href = survey.google_maps_url;
        }, 2000);
      }
      
    } catch (error: any) {
      console.error("Error submitting survey:", error);
      toast({
        title: "Error submitting survey",
        description: error.message || "Could not submit your feedback",
        variant: "destructive"
      });
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
            <CardTitle>Survey Not Found</CardTitle>
            <CardDescription>The survey you're looking for does not exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{survey.restaurant_name}</CardTitle>
          <CardDescription>Please share your feedback with us</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.length === 0 ? (
            <p className="text-center text-muted-foreground">This survey has no questions yet.</p>
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
                    placeholder="Enter your response here..."
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                )}
              </div>
            ))
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={submitSurvey}
            disabled={isSubmitting || questions.length === 0}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SurveyView;
