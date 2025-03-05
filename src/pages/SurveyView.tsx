import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, QUESTION_TYPES } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const SurveyView = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

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
          setError("Survey not found");
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
        console.error("Error in fetchSurveyData:", error);
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

  const submitSurvey = async () => {
    if (!survey || !id) {
      console.error("No survey or ID found");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Submitting survey with answers:", answers);
      
      // Validate answers
      const hasAnsweredSomething = Object.values(answers).some(answer => {
        if (Array.isArray(answer) && answer.length > 0) return true;
        if (typeof answer === 'number' && answer > 0) return true;
        if (typeof answer === 'string' && answer.trim() !== '') return true;
        return false;
      });
      
      if (!hasAnsweredSomething) {
        throw new Error("Please answer at least one question");
      }
      
      // Calculate average rating
      const ratingQuestions = questions.filter(q => q.type === QUESTION_TYPES.RATING);
      const ratingValues = ratingQuestions
        .map(q => Number(answers[q.id]) || 0)
        .filter(val => val > 0);
      
      const averageRating = ratingValues.length > 0
        ? ratingValues.reduce((sum, val) => sum + val, 0) / ratingValues.length
        : 0;
      
      console.log("Average rating:", averageRating);
      
      // Submit to the submissions table
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
      
      console.log("Setting submissionSuccess to true");
      setSubmissionSuccess(true);
      
      // Redirect to Google Maps if rating is high enough and URL is provided
      if (averageRating >= survey.minimum_positive_rating && survey.google_maps_url) {
        console.log("Redirecting to Google Maps:", survey.google_maps_url);
        window.open(survey.google_maps_url, '_blank', 'noopener,noreferrer');
      }
      
    } catch (error: any) {
      console.error("Error in submitSurvey:", error);
      toast({
        title: "Error submitting survey",
        description: error.message || "Could not submit your feedback",
        variant: "destructive"
      });
      setError(error.message || "Could not submit your feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of the component remains the same...

  // Add a console log to debug rendering
  console.log("Current state:", { 
    isLoading, 
    error, 
    survey, 
    submissionSuccess 
  });

  // Existing render methods...
};

export default SurveyView;
