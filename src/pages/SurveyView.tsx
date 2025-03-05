import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, QUESTION_TYPES } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const SurveyView = () => {
  // ... [previous state and other code remains the same]

  const submitSurvey = async () => {
    if (!survey || !id) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // ... [previous validation logic remains the same]
      
      // Calculate average rating from rating questions
      const ratingQuestions = questions.filter(q => q.type === QUESTION_TYPES.RATING);
      const ratingValues = ratingQuestions
        .map(q => Number(answers[q.id]) || 0)
        .filter(val => val > 0); // Only count answered ratings
      
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
      
      setSubmissionSuccess(true);
      
      // Redirect to Google Maps if rating is high enough and URL is provided
      if (averageRating >= survey.minimum_positive_rating && survey.google_maps_url) {
        window.open(survey.google_maps_url, '_blank', 'noopener,noreferrer');
      }
      
    } catch (error: any) {
      console.error("Error submitting survey:", error);
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

  if (submissionSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Thank You!</CardTitle>
            <CardDescription>Your feedback has been submitted successfully.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              {survey.google_maps_url ? "You'll be redirected to Google Maps to leave a review." : "We appreciate your time."}
            </p>
            {survey.google_maps_url && (
              <div className="flex justify-center">
                <a 
                  href={survey.google_maps_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center"
                >
                  Open Google Maps
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ... [rest of the component remains the same]
};

export default SurveyView;
