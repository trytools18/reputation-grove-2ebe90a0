
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pzuuaswwxkvobqzwxztk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6dXVhc3d3eGt2b2Jxend4enRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyOTEyOTMsImV4cCI6MjA1Mjg2NzI5M30.T0Bsj_Ksslxu1CNNC8Ue0i3biBX_BXClEmisBqPIwJA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
