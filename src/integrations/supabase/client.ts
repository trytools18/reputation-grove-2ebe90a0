
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
    // Make sure the question type matches one of the allowed types in QUESTION_TYPES
    const questionsToInsert = templateQuestions.map((q, index) => {
      // Validate and transform the type to ensure it matches allowed values
      let validType = q.type;
      
      // Check if type needs to be normalized to match DB constraints
      if (!Object.values(QUESTION_TYPES).includes(q.type)) {
        // Try to find a matching type from our FRONTEND_TO_DB_TYPE mapping
        validType = FRONTEND_TO_DB_TYPE[q.type.toLowerCase()] || QUESTION_TYPES.TEXT;
        console.log(`Normalized question type from ${q.type} to ${validType}`);
      }
      
      return {
        form_id: formData.id,
        text: q.text,
        type: validType,
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

// Function to fetch global analytics data for comparison
export const fetchGlobalAnalytics = async (city: string, businessCategory: string) => {
  try {
    const { data, error } = await supabase
      .from('global_analytics')
      .select('*')
      .eq('city', city)
      .eq('business_category', businessCategory)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" - not an error for us
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching global analytics:", error);
    return { data: null, error: error.message || "Failed to fetch global analytics" };
  }
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
