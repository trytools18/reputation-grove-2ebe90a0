import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pzuuaswwxkvobqzwxztk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6dXVhc3d3eGt2b2Jxend4enRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyOTEyOTMsImV4cCI6MjA1Mjg2NzI5M30.T0Bsj_Ksslxu1CNNC8Ue0i3biBX_BXClEmisBqPIwJA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Define the allowed question types based on the database constraint
export const QUESTION_TYPES = {
  RATING: 'rating',
  MULTIPLE_CHOICE: 'multiple-choice',
  TEXT: 'text'
};

// Map between frontend display types and database types
export const FRONTEND_TO_DB_TYPE = {
  "multiplechoice": QUESTION_TYPES.MULTIPLE_CHOICE,
  "rating": QUESTION_TYPES.RATING,
  "text": QUESTION_TYPES.TEXT
};

export const DB_TO_FRONTEND_TYPE = {
  [QUESTION_TYPES.MULTIPLE_CHOICE]: "multiplechoice",
  [QUESTION_TYPES.RATING]: "rating",
  [QUESTION_TYPES.TEXT]: "text"
};

// Create a function to convert template questions to survey questions
export const convertTemplateToSurvey = async (templateId: string, businessName: string, googleMapsUrl: string, userId: string) => {
  try {
    // 1. Create the form
    const { data: formData, error: formError } = await supabase
      .from('forms')
      .insert({
        restaurant_name: businessName,
        google_maps_url: googleMapsUrl,
        minimum_positive_rating: 4,
        user_id: userId
      })
      .select()
      .single();
      
    if (formError) throw formError;
    
    // 2. Get template questions
    const { data: templateQuestions, error: questionsError } = await supabase
      .from('template_questions')
      .select('*')
      .eq('template_id', templateId)
      .order('order_num', { ascending: true });
      
    if (questionsError) throw questionsError;
    
    if (!templateQuestions || templateQuestions.length === 0) {
      return { id: formData.id, error: "No questions found in template" };
    }
    
    // 3. Convert template questions to form questions
    // Ensure the question type matches the allowed types in the database constraint
    const questionsToInsert = templateQuestions.map((q, index) => {
      // Ensure we only use multiple-choice or rating by default, with text as fallback
      let questionType = q.type;
      
      // If the question type is not one of the allowed types, or it's text type,
      // determine a better type based on the content
      if (![QUESTION_TYPES.RATING, QUESTION_TYPES.MULTIPLE_CHOICE].includes(questionType)) {
        // Default to multiple-choice if it has options
        if (q.options && q.options.length > 0) {
          questionType = QUESTION_TYPES.MULTIPLE_CHOICE;
        } 
        // Use rating if the question text contains "rate" or "rating"
        else if (q.text.toLowerCase().includes("rate") || q.text.toLowerCase().includes("experience")) {
          questionType = QUESTION_TYPES.RATING;
        }
        // Otherwise default to multiple-choice with standard options
        else {
          questionType = QUESTION_TYPES.MULTIPLE_CHOICE;
          q.options = ['Excellent', 'Good', 'Average', 'Below average', 'Poor'];
        }
      }
      
      return {
        form_id: formData.id,
        text: q.text,
        type: questionType,
        options: q.options,
        order: index
      };
    });
    
    // 4. Insert questions
    const { error: insertError } = await supabase
      .from('questions')
      .insert(questionsToInsert);
      
    if (insertError) throw insertError;
    
    return { id: formData.id, error: null };
  } catch (error: any) {
    console.error("Error converting template to survey:", error);
    return { id: null, error: error.message || "Failed to create survey from template" };
  }
};

// Export survey data as JSON file
export const exportSurveyData = (survey: any, questions: any[], submissions: any[], analytics: any) => {
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
    
    return true;
  } catch (error) {
    console.error("Error exporting data:", error);
    return false;
  }
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
